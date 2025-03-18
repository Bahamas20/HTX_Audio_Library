import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, TextField, Button, FormControl, FormHelperText, Grid, Card, CardContent, Typography, IconButton, InputLabel, Select, MenuItem, Stack, Chip } from '@mui/material'; 
import { jwtDecode } from 'jwt-decode';
import './audiolibrary.css'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';


const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const categories = [
  'Music',
  'Podcasts',
  'Audiobooks',
  'Sound Effects',
  'Voice Recordings',
  'Educational',
  'Other'
];

function AudioLibrary() {
  

  const [audioFiles, setAudioFiles] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [userId, setUserId] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const fileInputRef = useRef(null);


  useEffect(() => {
    const token = localStorage.getItem('authToken'); 

    if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user_id);
    }
  }, []);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/audios/user/${userId}`);
        setAudioFiles(response.data);
      } catch (error) {
        console.error('Error fetching audio files:', error);
      }
    };

    if (userId) {
      fetchAudioFiles();
    }
  }, [userId]);

  const handlePlayAudio = (audioUrl) => {
    setCurrentAudio(audioUrl);
  };

  const handleDeleteAudio = async (audioId) => {
    const user_id = userId;

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/audios/${audioId}`, {
        data: { user_id },
      });
  
      if (response.status === 200) {
        setAudioFiles(audioFiles.filter((audio) => audio.audio_id !== audioId));
        alert('Audio file deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting audio file:', error);
      alert('Failed to delete audio file');
    }
  };
  

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  }
  
  const handleUploadAudio = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('audio', uploadFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/audios/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setAudioFiles([response.data, ...audioFiles]);
        alert('Audio file uploaded successfully');
        setUploadFile(null);
        setTitle('');
        setDescription('');
        setCategory('');

        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }        

      }
    } catch (error) {
      console.error('Error uploading audio file:', error);
      alert('Failed to upload audio file');
    }
  };
  return (
    <Box sx={{ backgroundColor: '#8452de', minHeight: '100vh' }}>
    <div style={{ display: 'flex', flexDirection:'column'}}>
      <h1 className='library-titles'>Audio Library</h1>
      <section className='upload-section'>
        <h3 className='library-titles upload-title '>Upload Audio File</h3>
        <form onSubmit={handleUploadAudio}>
          <Grid container spacing={2} alignItems="center" marginBottom={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <label htmlFor="audios" className="drop-container" id="dropcontainer">
                  <span className="drop-title">Drop audio file here</span>
                  or
                  <input type="file" id="audios" accept="audio/*" required onChange={handleFileChange} ref={fileInputRef}></input>
                </label>                
        <FormHelperText>Upload an audio file</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack>
              <TextField
                label="Title"
                value={title}
                onChange={handleTitleChange}
                fullWidth
                required
                margin="normal"
              />
            <TextField
            label="Description"
            value={description}
            onChange={handleDescriptionChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
            <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Category"
                autoWidth
                onChange={handleCategoryChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              </Stack>
            </Grid>
          </Grid>          
          <Button variant="contained" type="submit" fullWidth 
          sx={{ 
            backgroundColor: 'black',            
            '&:hover': {
              backgroundColor: '#682bd7', 
              color: 'white', 
            }}}>
            Upload
          </Button>
        </form>
      </section>
      {audioFiles.length === 0 ? (
        <p className='library-titles'>No audio files available</p>
      ) : (
        <ol>
          {audioFiles.map((audio) => (
            <li className='list-item' key={audio.audio_id}>
              <Card sx={{ marginBottom: 2, backgroundColor:'' }}>
                <CardContent sx={{ paddingBottom: '0 !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{audio.title}</Typography>
                  <Box>
                    <IconButton onClick={() => handlePlayAudio(audio.s3_url)}>
                      <PlayArrowIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteAudio(audio.audio_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{paddingBlockEnd:2 }}>
                {audio.category && (
                  <Chip label={audio.category} color="primary" size="small" sx={{ mb: 1 }} />
                )}
                <Typography variant="body2" color="text.secondary">
                  {audio.description}
                </Typography>
                </Box>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      )}
      
      {currentAudio ? (
        <div className='audio-player' style={{ height: '30vh' }}>
          <h2 className='library-titles'>Now Playing</h2>
          <audio key={currentAudio} controls>
            <source src={currentAudio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        <div style={{ height: '20vh' }}>
          <h2 className='library-titles'>{audioFiles.length !== 0 ? 'Click play on any audio to get started!': ''}</h2>
        </div>
      )}
    </div>
    </Box>
  );
}

export default AudioLibrary;
