const express = require("express");
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const audioRoutes = require('./routes/audioRoutes');
const runInitScript = require('./initDb');

const app = express();

app.use(cors());
app.use(express.json());

runInitScript();

app.use('/api', userRoutes);
app.use('/api', audioRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server has started on port ${PORT}`);
});
