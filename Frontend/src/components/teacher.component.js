import React, { useState } from "react";

const TeachersTable = ({ teachers, setTeachers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleEdit = (index, updatedTeacher) => {
    const updatedTeachers = [...teachers];
    updatedTeachers[index] = updatedTeacher;
    setTeachers(updatedTeachers);
  };

  const handleDelete = (index) => {
    const updatedTeachers = teachers.filter((_, i) => i !== index);
    setTeachers(updatedTeachers);
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.fullName.toLowerCase().includes(searchTerm) ||
      teacher.email.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="teachers-table container mt-4">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table className="table table-striped table-hover">
        <thead className="table-primary">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher, index) => (
              <tr key={index}>
                <td>{teacher.fullName}</td>
                <td>{teacher.email}</td>
                <td>{teacher.dob}</td>
                <td>{teacher.selectedGender}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(index, { ...teacher, fullName: "Edited Name" })}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No teachers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeachersTable;