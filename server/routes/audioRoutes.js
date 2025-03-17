const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');

router.post('/audios/:user_id', audioController.uploadAudio);
router.get('/audios/:audio_id/user/:user_id', audioController.getAudioPlayback);
router.get('/audios/user/:user_id', audioController.getUserAudioFiles);
router.delete('/audios/:audio_id', audioController.deleteAudio);

module.exports = router;
