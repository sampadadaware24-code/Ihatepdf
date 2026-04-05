const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file to Cloudinary
 * @param {string} filePath - Local path to the file
 * @param {string} folder - Folder name in Cloudinary
 * @param {string} resourceType - 'auto', 'raw', 'video', 'image'
 * @returns {Promise<object>} - Cloudinary upload result
 */
exports.uploadFile = async (filePath, folder = 'ihatepdf', resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

/**
 * Deletes a file from local storage after it's been uploaded to Cloudinary
 * @param {string} filePath - Local path to the file
 */
exports.deleteLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting local file:', err);
    });
  }
};
