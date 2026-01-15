const express = require('express');
const cloudinary = require('cloudinary').v2;
const path = require('path');

const app = express();
app.use(express.json());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpjfcgmpe',
  api_key: process.env.CLOUDINARY_API_KEY || '184998516246899',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'OKd0GHsYtysdKUH_rNCqYcHU5qw'
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// API: List images
app.get('/api/images', async (req, res) => {
  try {
    const { category } = req.query;

    let options = {
      type: 'upload',
      prefix: 'coolenergy/abanicos',
      max_results: 500
    };

    if (category && category !== 'all') {
      options.prefix = `coolenergy/abanicos/${category}`;
    }

    const result = await cloudinary.api.resources(options);

    // Get images with their tags
    const images = result.resources.map(img => ({
      public_id: img.public_id,
      url: img.secure_url,
      thumbnail: cloudinary.url(img.public_id, {
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
      }),
      full: cloudinary.url(img.public_id, {
        width: 800,
        quality: 'auto',
        format: 'auto'
      }),
      category: extractCategory(img.public_id),
      created_at: img.created_at
    }));

    res.json({ success: true, images });
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Upload image (generates signature for signed upload)
app.post('/api/upload/signature', (req, res) => {
  const { category } = req.body;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = `coolenergy/abanicos/${category || 'sin-categoria'}`;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET || 'OKd0GHsYtysdKUH_rNCqYcHU5qw'
  );

  res.json({
    signature,
    timestamp,
    folder,
    api_key: process.env.CLOUDINARY_API_KEY || '184998516246899',
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpjfcgmpe'
  });
});

// API: Delete image
app.delete('/api/images/:publicId(*)', async (req, res) => {
  try {
    const publicId = req.params.publicId;

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({ success: true, message: 'Imagen eliminada' });
    } else {
      res.status(400).json({ success: false, error: 'No se pudo eliminar la imagen' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get stats
app.get('/api/stats', async (req, res) => {
  try {
    const categories = ['rave-xl', 'rave-l', 'medium', 'personalizados'];
    const stats = { total: 0 };

    for (const cat of categories) {
      try {
        const result = await cloudinary.api.resources({
          type: 'upload',
          prefix: `coolenergy/abanicos/${cat}`,
          max_results: 500
        });
        stats[cat] = result.resources.length;
        stats.total += result.resources.length;
      } catch (e) {
        stats[cat] = 0;
      }
    }

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper: Extract category from public_id
function extractCategory(publicId) {
  const parts = publicId.split('/');
  if (parts.length >= 3) {
    return parts[2]; // coolenergy/abanicos/CATEGORY/filename
  }
  return 'sin-categoria';
}

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  // Don't redirect API calls
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
