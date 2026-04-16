const path = require('path');
const fs = require('fs');
const PdfAudio = require('../models/PdfAudio');
const pdfService = require('../services/pdfService');
const ttsService = require('../services/ttsService');
const cloudinaryService = require('../services/cloudinaryService');

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const localPdfPath = req.file.path;
  const originalFileName = req.file.originalname;

  try {
    // 1. Create initial record in MongoDB
    const pdfAudioRecord = await PdfAudio.create({
      originalFileName: originalFileName,
      pdfUrl: 'pending', // Will update after Cloudinary upload
      status: 'uploaded'
    });

    // 2. Upload PDF to Cloudinary
    const pdfUploadResult = await cloudinaryService.uploadFile(localPdfPath, 'ihatepdf/pdfs');
    pdfAudioRecord.pdfUrl = pdfUploadResult.secure_url;
    await pdfAudioRecord.save();

    // 3. Extract Text from PDF
    const text = await pdfService.extractTextFromPDF(localPdfPath);

    // 4. Update status to processing
    pdfAudioRecord.status = 'processing';
    await pdfAudioRecord.save();

    // 5. Convert Text to Speech
    const outputFileName = `audio-${Date.now()}.mp3`;
    const localAudioPath = path.join(__dirname, '../outputs', outputFileName);

    await ttsService.generateSpeech(text, localAudioPath);

    // 6. Upload Audio to Cloudinary
    const audioUploadResult = await cloudinaryService.uploadFile(localAudioPath, 'ihatepdf/audio', 'video');

    // 7. Update Record to Completed
    pdfAudioRecord.audioUrl = audioUploadResult.secure_url;
    pdfAudioRecord.status = 'completed';
    await pdfAudioRecord.save();

    // 8. Cleanup local files
    cloudinaryService.deleteLocalFile(localPdfPath);
    cloudinaryService.deleteLocalFile(localAudioPath);

    res.status(200).json({
      message: 'Conversion completed successfully',
      data: pdfAudioRecord
    });

  } catch (error) {
    console.error('Conversion Flow Error:', error);

    // Handle specific errors and update status if possible
    res.status(500).json({
      error: error.message || 'An error occurred during conversion'
    });
  }
};
