const fs = require('fs');
const pdf = require('pdf-parse');

/**
 * Extracts text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text
 */
exports.extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    
    // Clean up text: remove extra whitespace and non-useful characters
    let text = data.text.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (!text) {
      throw new Error('No text content found in the PDF');
    }

    return text;
  } catch (error) {
    console.error('PDF Extraction Error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
