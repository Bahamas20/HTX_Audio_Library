import React, { useState } from "react";
import {
  Avatar,
  Box,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Checkbox,
  Button
} from "@mui/material";
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { InputAdornment, IconButton } from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const Login = () => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("adminpassword");
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password,
      });

      if (response.data.token) {
        console.log("Login successful", response.data.token);
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("username", username);
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <Box sx={{ backgroundColor: '#682bd7', minHeight: '100vh', padding: 4 }}>
    <Container maxWidth="sm">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 10, backgroundColor: '#2a2a2a', color: 'white' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 2, 
          mb: 2,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="500"
        >
          HamJam
        </Typography>
        <Avatar
          sx={{
            bgcolor: '#682bd7',
          }}
        >
          <AudiotrackIcon />
        </Avatar>
      </Box>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center", mt: 2, mb: 2 }}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            label="Username"
            fullWidth
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2, color:'white'}}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            InputProps={{
              style: {color: 'white'}
            }}
          />
          <TextField
            label="Password"
            fullWidth
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2,  color: 'white' }}
            InputProps={{
              style: {color: 'white'},
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: "white" }} >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
          />
          {errorMessage && (
            <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
              {errorMessage}
            </Typography>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                value="remember"
                color="secondary"
              />
            }
            label="Remember me"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 , backgroundColor: 'white', color: '#682bd7',    
           '&:hover': {
              backgroundColor: '#682bd7', 
              color: 'white', 
            }}}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
    </Box>
  );
};

export default Login;
