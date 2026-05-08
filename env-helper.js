
const checkRequiredKeys = () => {
    const required = ['DANA_API_KEY', 'OVO_API_KEY', 'GOPAY_API_KEY'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0 && process.env.API_MODE === 'live') {
        console.warn(`⚠️ WARNING: Missing API keys: ${missing.join(', ')}`);
        return false;
    }
    return true;
};

const getApiMode = () => process.env.API_MODE || 'sandbox';

const getDanaConfig = () => ({
    apiKey: process.env.DANA_API_KEY,
    merchantId: process.env.DANA_MERCHANT_ID,
    isLive: getApiMode() === 'live'
});

const getOvoConfig = () => ({
    apiKey: process.env.OVO_API_KEY,
    merchantId: process.env.OVO_MERCHANT_ID,
    isLive: getApiMode() === 'live'
});

const getGopayConfig = () => ({
    apiKey: process.env.GOPAY_API_KEY,
    merchantId: process.env.GOPAY_MERCHANT_ID,
    isLive: getApiMode() === 'live'
});

const getFlipConfig = () => ({
    apiKey: process.env.FLIP_API_KEY,
    secretKey: process.env.FLIP_SECRET_KEY,
    baseUrl: process.env.FLIP_BASE_URL || 'https://api.flip.id/v1',
    isLive: getApiMode() === 'live'
});

const getDigirtcConfig = () => ({
    apiKey: process.env.DIGIRTC_API_KEY,
    secret: process.env.DIGIRTC_SECRET,
    isLive: getApiMode() === 'live'
});

const getFirebaseConfig = () => ({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
});

const getEncryptionKey = () => process.env.ENCRYPTION_KEY || 'N4B0ngYuk10?19372';

module.exports = {
    checkRequiredKeys,
    getApiMode,
    getDanaConfig,
    getOvoConfig,
    getGopayConfig,
    getFlipConfig,
    getDigirtcConfig,
    getFirebaseConfig,
    getEncryptionKey
};