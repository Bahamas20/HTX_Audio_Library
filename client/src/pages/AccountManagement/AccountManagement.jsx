import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, Typography } from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

function AccountManagement() {
  const [users, setUsers] = useState([]);
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/users`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleCreateUser = () => {
    const newUser = { username, email, password };
    axios.post(`${API_BASE_URL}/api/users`, newUser)
      .then((response) => {
        setUsers([...users, response.data]);
        clearForm();
      })
      .catch((error) => console.error("Error creating user:", error));
  };

  const handleEditUser = () => {
    const updatedUser = { username, email, password };
    axios.put(`${API_BASE_URL}/api/users/${selectedUser.user_id}`, updatedUser)
      .then((response) => {
        const updatedUsers = users.map(user => 
          user.user_id === selectedUser.user_id ? response.data : user
        );
        setUsers(updatedUsers);
        clearForm();
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  const handleDeleteUser = (userId) => {
    axios.delete(`${API_BASE_URL}/api/users/${userId}`)
      .then(() => {
        setUsers(users.filter(user => user.user_id !== userId));
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUserName(user.username);
    setEmail(user.email);
    setPassword(user.password);
  };

  const clearForm = () => {
    setSelectedUser(null);
    setUserName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Account Management</Typography>

      <div>
        <Typography variant="h6">Create / Edit User</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="User Name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              fullWidth
            />
          </Grid>
        </Grid>

        <Button
          onClick={selectedUser ? handleEditUser : handleCreateUser}
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
        >
          {selectedUser ? 'Update User' : 'Create User'}
        </Button>
        {selectedUser && (
          <Button
            onClick={clearForm}
            variant="outlined"
            style={{ marginTop: 20, marginLeft: 10 }}
          >
            Cancel
          </Button>
        )}
      </div>

      <div style={{ marginTop: 30 }}>
        <Typography variant="h6">User List</Typography>
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.user_id}>
              <div style={{ border: '1px solid #ccc', padding: 10, borderRadius: 5 }}>
                <Typography>{user.username}</Typography>
                <Typography>{user.email}</Typography>
                <Button
                  onClick={() => handleSelectUser(user)}
                  variant="contained"
                  color="secondary"
                  style={{ marginRight: 10 }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteUser(user.user_id)}
                  variant="outlined"
                  color="error"
                >
                  Delete
                </Button>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export default AccountManagement;
