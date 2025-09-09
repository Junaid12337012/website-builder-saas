const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { auth } = require('../middleware/auth');
const { checkStorageLimit, updateUsage } = require('../middleware/subscription');
const Media = require('../models/Media');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images, videos, and documents
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg|mp4|webm|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter
});

// Get all media for user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, search } = req.query;
    
    const query = { user: req.user.id };
    
    if (type) {
      query.mimeType = { $regex: type, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { alt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Media.countDocuments(query);
    
    res.json({
      media,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload single file
router.post('/upload', auth, (req, res, next) => {
  // Check storage limit before upload
  const fileSize = req.headers['content-length'];
  const fileSizeMB = fileSize ? Math.ceil(fileSize / (1024 * 1024)) : 5; // Default 5MB if unknown
  return checkStorageLimit(fileSizeMB)(req, res, next);
}, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { alt, caption, tags } = req.body;
    
    const media = new Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      path: req.file.path,
      alt: alt || '',
      caption: caption || '',
      user: req.user.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });
    
    // Add image dimensions if it's an image
    if (req.file.mimetype.startsWith('image/')) {
      try {
        const sharp = require('sharp');
        const metadata = await sharp(req.file.path).metadata();
        media.metadata = {
          width: metadata.width,
          height: metadata.height
        };
      } catch (err) {
        console.log('Sharp not available, skipping image metadata');
      }
    }
    
    await media.save();
    
    // Update storage usage
    const fileSizeMB = Math.ceil(req.file.size / (1024 * 1024));
    await updateUsage(req.user.id, 'storage', fileSizeMB);
    
    res.status(201).json(media);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Upload multiple files
router.post('/upload-multiple', auth, (req, res, next) => {
  // Check total storage limit for all files
  const totalSize = req.headers['content-length'];
  const totalSizeMB = totalSize ? Math.ceil(totalSize / (1024 * 1024)) : 50; // Default 50MB if unknown
  return checkStorageLimit(totalSizeMB)(req, res, next);
}, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const mediaItems = [];
    
    for (const file of req.files) {
      const media = new Media({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        path: file.path,
        user: req.user.id
      });
      
      // Add image dimensions if it's an image
      if (file.mimetype.startsWith('image/')) {
        try {
          const sharp = require('sharp');
          const metadata = await sharp(file.path).metadata();
          media.metadata = {
            width: metadata.width,
            height: metadata.height
          };
        } catch (err) {
          console.log('Sharp not available, skipping image metadata');
        }
      }
      
      await media.save();
      mediaItems.push(media);
    }
    
    // Update storage usage for all files
    const totalSizeMB = req.files.reduce((total, file) => total + Math.ceil(file.size / (1024 * 1024)), 0);
    await updateUsage(req.user.id, 'storage', totalSizeMB);
    
    res.status(201).json(mediaItems);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single media item
router.get('/:id', auth, async (req, res) => {
  try {
    const media = await Media.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update media metadata
router.put('/:id', auth, async (req, res) => {
  try {
    const { alt, caption, tags } = req.body;
    
    const media = await Media.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    if (alt !== undefined) media.alt = alt;
    if (caption !== undefined) media.caption = caption;
    if (tags) media.tags = tags.split(',').map(tag => tag.trim());
    
    await media.save();
    res.json(media);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete media
router.delete('/:id', auth, async (req, res) => {
  try {
    const media = await Media.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    // Delete file from filesystem
    if (fs.existsSync(media.path)) {
      fs.unlinkSync(media.path);
    }
    
    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve uploaded files
router.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '../uploads', filename);
  
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

module.exports = router;
