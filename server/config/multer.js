const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('./aws');

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `audio-files/${Date.now()}_${file.originalname}`);
    }
  })
});

const deleteAudio = (fileKey) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  };
  
  return s3.deleteObject(params).promise();
};

module.exports = { upload, deleteAudio };
