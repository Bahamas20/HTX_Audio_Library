import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, Typography, Box, Card, CardContent} from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://htx-audio-library.onrender.com';

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
      .catch((error) =>{
        if (error.response.data.message) {
          alert("There was an error creating user: " + error.response.data.message);
        }
        console.error("Error creating user:", error);
      });
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
      .catch((error) =>{
        if (error.response.data.message) {
          alert("There was an error editing user: " + error.response.data.message);
        }
        console.error("Error updating user:", error);
      });
  };

  const handleDeleteUser = (userId) => {
    axios.delete(`${API_BASE_URL}/api/users/${userId}`)
      .then(() => {
        setUsers(users.filter(user => user.user_id !== userId));
      })
      .catch((error) =>{
        if (error.response.data.message) {
          alert("There was an error deleting user: " + error.response.data.message);
        }
        console.error("Error deleting user:", error);
      });
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
    <div style={{ padding: '30px', backgroundColor:'#682bd7', height: '100vh' }}>
      <Typography className='library-titles' variant="h4" gutterBottom align="center">Account Management</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: 3, backgroundColor: 'white', padding: '30px', borderRadius:'10px' }}>
        <Typography variant="h6" gutterBottom>Create / Edit User</Typography>
        
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="User Name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Button
            onClick={selectedUser ? handleEditUser : handleCreateUser}
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
          >
            {selectedUser ? 'Update User' : 'Create User'}
          </Button>

          {selectedUser && (
            <Button
              onClick={clearForm}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>

      <div>
        <Typography className='library-titles' variant="h5" gutterBottom>User List</Typography>

        <Grid container spacing={2} justifyContent="center">
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.user_id}>
              <Card sx={{ borderRadius: 2, boxShadow: 3, padding: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{user.username}</Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>{user.email}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      onClick={() => handleSelectUser(user)}
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(user.user_id)}
                      variant="outlined"
                      color="error"
                      size="small"
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );

}

export default AccountManagement;
