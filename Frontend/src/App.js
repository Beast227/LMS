import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './components/login.component';
import AdminPage from './components/adminPage.Component';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'}>
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          {/* Wrap login components in auth-wrapper */}
          <Route
            exact
            path="/"
            element={
              <div className="auth-wrapper">
                <div className="auth-inner">
                  <Login />
                </div>
              </div>
            }
          />
          <Route
            path="/sign-in"
            element={
              <div className="auth-wrapper">
                <div className="auth-inner">
                  <Login />
                </div>
              </div>
            }
          />
          {/* Directly render AdminPage for /dashboard */}
          <Route path="/dashboard" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;