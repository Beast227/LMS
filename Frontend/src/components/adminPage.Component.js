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

  // Generate email api call
  const generateEmail = async () => {
    if (!formData.fullName) {
      alert("Please enter the full name first.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3500/generateEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName: formData.fullName }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      setFormData((prevData) => ({
        ...prevData,
        email: data.email, // Assuming the backend returns the email as "email"
      }));
    } catch (error) {
      console.error(error);
      alert('Error generating email. Please try again.');
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
            <div className="mb-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={generateEmail}
                disabled={!formData.fullName}
              >
                Generate Email
              </button>
              {formData.email && (
                <p className="mt-2">Generated Email: {formData.email}</p>
              )}
            </div>
            <input
              type="text"
              name="ssn"
              placeholder="SSN"
              className="form-control mb-2"
              value={formData.ssn}
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