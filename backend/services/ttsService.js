const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const VOICE = process.env.TTS_VOICE || 'en-US-AriaNeural';

/**
 * Converts text to speech using Microsoft Edge TTS (edge-tts).
 * Writes text to a temp file to avoid shell escaping / null byte issues.
 *
 * @param {string} text - Text to synthesize
 * @param {string} outputFilePath - Path where the MP3 file should be saved
 * @returns {Promise<string>} - Path to the generated audio file
 */
exports.generateSpeech = (text, outputFilePath) => {
  return new Promise((resolve, reject) => {
    // Clean the text: remove null bytes, control chars, and limit length
    const cleanedText = text
      .replace(/\0/g, '')           // Remove null bytes
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // Remove control chars
      .replace(/\r\n/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000);          // Limit text length

    if (!cleanedText) {
      return reject(new Error('No usable text found in the PDF'));
    }

    // Write text to a temp file to avoid shell escaping issues entirely
    const tempTextFile = outputFilePath + '.txt';
    fs.writeFileSync(tempTextFile, cleanedText, 'utf-8');

    const command = `python -m edge_tts --voice "${VOICE}" --file "${tempTextFile}" --write-media "${outputFilePath}"`;

    exec(command, { maxBuffer: 1024 * 1024 * 10, timeout: 120000 }, (error, stdout, stderr) => {
      // Cleanup temp text file
      try { fs.unlinkSync(tempTextFile); } catch (e) { /* ignore */ }

      if (error) {
        console.error('Edge TTS Error:', error.message);
        console.error('Edge TTS Stderr:', stderr);
        return reject(new Error('Failed to generate speech from text'));
      }

      if (!fs.existsSync(outputFilePath)) {
        return reject(new Error('Audio file was not generated'));
      }

      resolve(outputFilePath);
    });
  });
};
