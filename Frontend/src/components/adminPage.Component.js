import React, { useState } from 'react';
import Modal from 'react-modal';
import '../style/Dashboard.css'
import Teacher from './teacher.component'

Modal.setAppElement('#root'); // Set app root for accessibility

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    email: '',
    ssn: '',
    selectedGender: ''
  });
  const [teachers, setTeachers] = useState([]);

  // Open and close modal
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3500/teacherRegistration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        console.log('Signup successful!');
        toggleModal(); // Close the modal on success
      } else {
        console.error('Signup failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={`dashboard ${isModalOpen ? 'blur-background' : ''}`}>
      <h2>Admin Dashboard</h2>
      <button className="btn btn-primary" onClick={toggleModal}>
        Add Teacher
      </button>
      <Teacher teachers={teachers} setTeachers={setTeachers} ></Teacher>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={toggleModal}
        className="custom-modal"
        overlayClassName="custom-overlay"
        contentLabel="Add Teacher"
      >
        <div className="modal-header">
          <h3>Add New Teacher</h3>
          <button className="close-button" onClick={toggleModal}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="form-control mb-2"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="dob"
              className="form-control mb-2"
              value={formData.dob}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-2"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select
              name="selectedGender"
              className="form-control mb-2"
              value={formData.selectedGender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;