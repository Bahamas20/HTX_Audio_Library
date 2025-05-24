const express = require("express");
const app = express();
const cors = require("cors")
const userRoutes = require('./routes/userRoutes');
const audioRoutes = require('./routes/audioRoutes')

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes); 
app.use('/api', audioRoutes);
  
app.listen(process.env.PORT || 3001, () => {
    console.log("Server has started on port 3001");
  });