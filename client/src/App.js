import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AccountManagement from './pages/AccountManagement/AccountManagement';
import Home from './pages/Home/Home';
import Login from './pages/Login';
import ProtectedRoutes from './utils/ProtectedRoutes';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/accounts" element={<AccountManagement />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
