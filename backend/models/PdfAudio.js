const mongoose = require('mongoose');

const pdfAudioSchema = new mongoose.Schema({
  originalFileName: {
    type: String,
    required: true,
    trim: true
  },
  pdfUrl: {
    type: String,
    required: true,
    trim: true
  },
  audioUrl: {
    type: String,
    trim: true,
    default: null
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'completed', 'failed'],
    default: 'uploaded'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you'll have a User model later
    required: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const PdfAudio = mongoose.model('PdfAudio', pdfAudioSchema);

module.exports = PdfAudio;
