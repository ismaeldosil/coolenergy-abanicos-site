/**
 * Cool Energy Abanicos - Configuracion Centralizada
 *
 * Este archivo contiene todas las configuraciones del sistema.
 * Para cambiar valores en produccion, usar variables de entorno.
 *
 * Variables de entorno disponibles:
 * - SITE_URL: URL del sitio desplegado
 * - PORT: Puerto del servidor
 * - CLOUDINARY_CLOUD_NAME: Nombre del cloud de Cloudinary
 * - CLOUDINARY_API_KEY: API Key de Cloudinary
 * - CLOUDINARY_API_SECRET: API Secret de Cloudinary
 * - JWT_SECRET: Secreto para firmar tokens JWT
 * - ADMIN_PASSWORD_HASH: Hash bcrypt de la contrasena del admin
 */

module.exports = {
  // ============================================
  // SITIO WEB
  // ============================================
  site: {
    name: 'Cool Energy Abanicos',
    url: process.env.SITE_URL || 'https://web-production-8584.up.railway.app',
    description: 'Abanicos premium para festivales y raves. Hechos en Uruguay con amor.',
    locale: 'es_UY',
    themeColor: '#0a0a0a'
  },

  // ============================================
  // SERVIDOR
  // ============================================
  server: {
    port: process.env.PORT || 3000,
    adminPath: '/admin-abanicos-abm',
    healthPath: '/health'
  },

  // ============================================
  // CLOUDINARY
  // ============================================
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    baseFolder: 'coolenergy/abanicos',
    maxFileSize: 10000000, // 10MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    thumbnailSize: { width: 300, height: 300 },
    fullSize: { width: 800 }
  },

  // ============================================
  // AUTENTICACION
  // ============================================
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'coolenergy-jwt-secret-change-in-production',
    jwtExpiresIn: '24h',
    // Hash bcrypt para: #Ab4n1co5-2024!
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '$2a$10$mTqdeAbk0TjKAzH59l.0xeixmYPtj5uVlJBvJDcevwXYRbECtYixy'
  },

  // ============================================
  // RATE LIMITING
  // ============================================
  rateLimiting: {
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // maximo 100 requests por ventana
      message: { error: 'Demasiadas solicitudes, intenta de nuevo mas tarde' }
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 5, // maximo 5 intentos de login
      message: { error: 'Demasiados intentos de login, intenta de nuevo en 15 minutos' }
    }
  },

  // ============================================
  // CONTACTO
  // ============================================
  contact: {
    whatsapp: {
      number: '59895192300',
      defaultMessage: 'Hola! Me interesan los abanicos'
    },
    instagram: '@coolenergy.uy'
  },

  // ============================================
  // CATEGORIAS DE PRODUCTOS
  // ============================================
  categories: {
    list: ['rave-xl', 'rave-l', 'medium', 'personalizados'],
    labels: {
      'rave-xl': 'RAVE XL',
      'rave-l': 'RAVE L',
      'medium': 'MEDIUM',
      'personalizados': 'Personalizado'
    },
    sizes: {
      'rave-xl': '66cm',
      'rave-l': '50cm',
      'medium': '40cm',
      'personalizados': 'XL o L'
    }
  },

  // ============================================
  // CACHE
  // ============================================
  cache: {
    staticFiles: '1d',
    images: '7d',
    cssJs: '1d'
  },

  // ============================================
  // ANALYTICS (configuracion del tracking)
  // ============================================
  analytics: {
    enabled: true,
    maxEvents: 1000, // maximo eventos en memoria
    endpoints: {
      pageview: '/api/analytics/pageview',
      event: '/api/analytics/event'
    }
  }
};
