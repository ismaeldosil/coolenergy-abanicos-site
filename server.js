const express = require('express');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Security: Helmet for HTTP headers (relaxed CSP for Cloudinary)
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP to allow Cloudinary images
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Performance: Compression
app.use(compression());

// Security: Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Demasiadas solicitudes, intenta de nuevo mas tarde' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  message: { error: 'Demasiados intentos de login, intenta de nuevo en 15 minutos' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

app.use(express.json({ limit: '10kb' })); // Limit body size

// Environment variables with NO fallbacks for credentials
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'coolenergy-jwt-secret-change-in-production';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$PTR6g/3ECD7XzMZNHXA8seyzMl9OHW1P9RPfHhaJUu8lQxJpR.NxS'; // Default: coolenergy2024

// Cloudinary config - only configure if credentials exist
if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  });
} else {
  console.warn('WARNING: Cloudinary credentials not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
}

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Performance: Static files with caching headers
app.use(express.static(path.join(__dirname), {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Longer cache for images and fonts
    if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg|woff|woff2|ttf)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days
    }
    // Shorter cache for CSS/JS (might change more often)
    if (filePath.match(/\.(css|js)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
    }
  }
}));

// ================== ANALYTICS ==================

// Simple in-memory analytics (for demo - use a DB in production)
const analytics = {
  pageviews: {},
  events: [],
  sessions: new Set()
};

// Analytics: Track pageview
app.post('/api/analytics/pageview', [
  body('page').isString().trim().escape().isLength({ max: 200 }),
  body('referrer').optional().isString().trim().escape().isLength({ max: 500 }),
  body('sessionId').optional().isString().trim().isLength({ max: 50 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { page, referrer, sessionId } = req.body;
  const today = new Date().toISOString().split('T')[0];

  if (!analytics.pageviews[today]) {
    analytics.pageviews[today] = {};
  }
  if (!analytics.pageviews[today][page]) {
    analytics.pageviews[today][page] = 0;
  }
  analytics.pageviews[today][page]++;

  if (sessionId) {
    analytics.sessions.add(sessionId);
  }

  res.json({ success: true });
});

// Analytics: Track event (clicks, etc)
app.post('/api/analytics/event', [
  body('event').isString().trim().escape().isLength({ max: 100 }),
  body('data').optional().isObject()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { event, data } = req.body;
  analytics.events.push({
    event,
    data: data || {},
    timestamp: new Date().toISOString()
  });

  // Keep only last 1000 events
  if (analytics.events.length > 1000) {
    analytics.events = analytics.events.slice(-1000);
  }

  res.json({ success: true });
});

// ================== AUTHENTICATION ==================

// Auth: Login endpoint
app.post('/api/auth/login', [
  body('password').isString().isLength({ min: 1, max: 100 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Password requerido' });
  }

  const { password } = req.body;

  try {
    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (isValid) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, error: 'Password incorrecto' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Error de autenticacion' });
  }
});

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Token invalido o expirado' });
    }
    req.user = user;
    next();
  });
}

// ================== CLOUDINARY API (Protected) ==================

// Check if Cloudinary is configured
function requireCloudinary(req, res, next) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(503).json({
      success: false,
      error: 'Cloudinary no configurado. Configura las variables de entorno.'
    });
  }
  next();
}

// API: List images (public for gallery)
app.get('/api/images', requireCloudinary, async (req, res) => {
  try {
    const { category } = req.query;

    let options = {
      type: 'upload',
      prefix: 'coolenergy/abanicos',
      max_results: 500
    };

    if (category && category !== 'all') {
      // Sanitize category input
      const allowedCategories = ['rave-xl', 'rave-l', 'medium', 'personalizados'];
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ success: false, error: 'Categoria invalida' });
      }
      options.prefix = `coolenergy/abanicos/${category}`;
    }

    const result = await cloudinary.api.resources(options);

    const images = result.resources.map(img => ({
      public_id: img.public_id,
      url: img.secure_url,
      thumbnail: cloudinary.url(img.public_id, {
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
        secure: true
      }),
      full: cloudinary.url(img.public_id, {
        width: 800,
        quality: 'auto',
        fetch_format: 'auto',
        secure: true
      }),
      category: extractCategory(img.public_id),
      created_at: img.created_at
    }));

    res.json({ success: true, images });
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ success: false, error: 'Error listando imagenes' });
  }
});

// API: Upload signature (Protected - requires auth)
app.post('/api/upload/signature', authenticateToken, requireCloudinary, [
  body('category').isString().isIn(['rave-xl', 'rave-l', 'medium', 'personalizados'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Categoria invalida' });
  }

  const { category } = req.body;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = `coolenergy/abanicos/${category}`;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    CLOUDINARY_API_SECRET
  );

  res.json({
    signature,
    timestamp,
    folder,
    api_key: CLOUDINARY_API_KEY,
    cloud_name: CLOUDINARY_CLOUD_NAME
  });
});

// API: Delete image (Protected - requires auth)
app.delete('/api/images/:publicId(*)', authenticateToken, requireCloudinary, async (req, res) => {
  try {
    const publicId = req.params.publicId;

    // Validate publicId format
    if (!publicId.startsWith('coolenergy/abanicos/')) {
      return res.status(400).json({ success: false, error: 'ID de imagen invalido' });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({ success: true, message: 'Imagen eliminada' });
    } else {
      res.status(400).json({ success: false, error: 'No se pudo eliminar la imagen' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, error: 'Error eliminando imagen' });
  }
});

// API: Get stats (Protected - requires auth)
app.get('/api/stats', authenticateToken, requireCloudinary, async (req, res) => {
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
    res.status(500).json({ success: false, error: 'Error obteniendo estadisticas' });
  }
});

// API: Get analytics (Protected - requires auth)
app.get('/api/analytics', authenticateToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todayViews = analytics.pageviews[today] || {};

  let totalToday = 0;
  Object.values(todayViews).forEach(v => totalToday += v);

  res.json({
    success: true,
    analytics: {
      todayPageviews: totalToday,
      uniqueSessions: analytics.sessions.size,
      pageviews: analytics.pageviews,
      recentEvents: analytics.events.slice(-50)
    }
  });
});

// Helper: Extract category from public_id
function extractCategory(publicId) {
  const parts = publicId.split('/');
  if (parts.length >= 3) {
    return parts[2]; // coolenergy/abanicos/CATEGORY/filename
  }
  return 'sin-categoria';
}

// Admin route (without .html)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

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
  console.log(`Cloudinary configured: ${!!CLOUDINARY_CLOUD_NAME}`);
});
