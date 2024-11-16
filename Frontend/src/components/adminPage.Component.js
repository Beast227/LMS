import React, { useState } from 'react';
import Modal from 'react-modal'; // Ensure you have this installed: `npm install react-modal`

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

  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle gender selection change
  const handleGenderChange = (event) => {
    setFormData({ ...formData, selectedGender: event.target.value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { fullName, dob, ssn, selectedGender, email } = formData;
    const gender = selectedGender;

    const data = {
      fullName,
      dob,
      ssn,
      gender,
      email
    };

    try {
      const response = await fetch('http://localhost:3500/teacherRegistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        console.log('Signup successful!');
        // Close the modal after successful signup
        closeModal();
      } else {
        console.error('Signup failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <button className="btn btn-primary" onClick={openModal}>
        Add Teacher
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Teacher Modal"
      >
        <h2>Sign Up a Teacher</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>DOB</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Gender</label>
            <select
              className="form-control"
              name="selectedGender"
              value={formData.selectedGender}
              onChange={handleGenderChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Others</option>
            </select>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered <a href="/sign-in">sign in?</a>
          </p>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;