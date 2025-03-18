const audioModel = require('../models/audioModel');
const { upload, deleteAudio } = require('../config/multer'); 

exports.uploadAudio = [
  upload.single('audio'),
  async (req, res) => {
    
    try {
      
      const { user_id } = req.params;
      const {title, description, category } = req.body;

      if (!title || !req.file) {
        return res.status(400).json({ message: 'Missing required fields or file' });
      }
      
      const newAudio = await audioModel.createAudio(
        user_id,
        title,
        description,
        category,
        req.file.location
      );

      res.status(200).json(newAudio.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to upload audio file.' });
    }
  }
];

exports.getAudioPlayback = async (req, res) => {
  try {
    const { audio_id, user_id } = req.params;

    const audio = await audioModel.getAudioById(audio_id, user_id);

    if (audio.rows.length === 0) {
      return res.status(404).json({ message: 'Audio file not found or you do not have permission to access it' });
    }

    res.status(200).json({ playbackUrl: audio.rows[0].s3_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching audio file for playback' });
  }
};

exports.getUserAudioFiles = async (req, res) => {
  try {
    const { user_id } = req.params;

    const audios = await audioModel.getAudiosByUser(user_id);

    res.status(200).json(audios.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve audio files.' });
  }
};

exports.deleteAudio = async (req, res) => {
  try {
    const { audio_id } = req.params;
    const {user_id} = req.body
    const audio = await audioModel.getAudioById(audio_id, user_id);
    const fileKey = audio.rows[0].s3_url.split('/').slice(-2).join('/');

    if (!fileKey) {
      return res.status(400).json({ message: 'Invalid S3 URL. Cannot delete file.' });
    }

    // Delete on S3
    await deleteAudio(fileKey);

    //Delete on db
    const deletedAudio = await audioModel.deleteAudio(audio_id, user_id);

    if (deletedAudio.rows.length === 0) {
      return res.status(404).json({ message: 'Audio file not found or you do not have permission to delete it' });
    }

    res.status(200).json({ message: 'Audio file deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting audio file' });
  }
};
