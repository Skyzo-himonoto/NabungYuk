require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const envHelper = require('./env-helper.js');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const authenticateRequest = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token || token !== 'N4B0ngYuk10') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        mode: envHelper.getApiMode(),
        timestamp: new Date().toISOString(),
        endpoints: [
            '/api/topup',
            '/api/withdraw',
            '/api/voucher',
            '/api/balance'
        ]
    });
});

app.post('/api/topup', authenticateRequest, async (req, res) => {
    try {
        const { amount, method, user_id } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Amount tidak valid' });
        }
        
        let apiConfig;
        let providerName;
        
        switch(method) {
            case 'dana':
                apiConfig = envHelper.getDanaConfig();
                providerName = 'DANA';
                break;
            case 'ovo':
                apiConfig = envHelper.getOvoConfig();
                providerName = 'OVO';
                break;
            case 'gopay':
                apiConfig = envHelper.getGopayConfig();
                providerName = 'GoPay';
                break;
            default:
                return res.status(400).json({ error: 'Method tidak didukung' });
        }
        
        if (envHelper.getApiMode() === 'live' && !apiConfig.apiKey) {
            return res.status(500).json({ error: 'API Key tidak tersedia' });
        }
        
    
        console.log(`🔐 Processing ${providerName} topup of Rp ${amount} for user ${user_id}`);
        console.log(`🔐 Using API Key: ${apiConfig.apiKey ? '✅ exists' : '❌ missing'}`);
    
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        
        res.json({
            success: true,
            transaction_id: transactionId,
            amount: amount,
            method: method,
            message: `Top up Rp ${amount.toLocaleString()} via ${providerName} berhasil!`,
            mode: envHelper.getApiMode()
        });
        
    } catch (error) {
        console.error('Topup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/withdraw', authenticateRequest, async (req, res) => {
    try {
        const { amount, bank_code, account_number, account_name, user_id } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Amount tidak valid' });
        }
        
        if (!bank_code || !account_number) {
            return res.status(400).json({ error: 'Bank code dan account number wajib diisi' });
        }
        
        const flipConfig = envHelper.getFlipConfig();
        if (envHelper.getApiMode() === 'live' && !flipConfig.apiKey) {
            return res.status(500).json({ error: 'API Key Flip tidak tersedia' });
        }
        
        console.log(`🔐 Processing withdrawal of Rp ${amount} to ${bank_code} - ${account_number}`);
        console.log(`🔐 Using Flip API Key: ${flipConfig.apiKey ? '✅ exists' : '❌ missing'}`);
        
        // SIMULASI API CALL (ganti dengan API Flip beneran nanti)
        const withdrawalId = `WD_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        
        res.json({
            success: true,
            withdrawal_id: withdrawalId,
            amount: amount,
            bank_code: bank_code,
            account_number: account_number,
            message: `Penarikan Rp ${amount.toLocaleString()} berhasil! Dana akan masuk dalam 1x24 jam.`,
            mode: envHelper.getApiMode()
        });
        
    } catch (error) {
        console.error('Withdraw error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/voucher', authenticateRequest, async (req, res) => {
    try {
        const { voucher_type, user_id, points_used } = req.body;
        
        const digirtcConfig = envHelper.getDigirtcConfig();
        
        console.log(`🔐 Processing voucher exchange: ${voucher_type} using ${points_used} points`);
        console.log(`🔐 Using DigiRTC API Key: ${digirtcConfig.apiKey ? '✅ exists' : '❌ missing'}`);
        
        const voucherCode = `NBYK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        
        res.json({
            success: true,
            voucher_code: voucherCode,
            voucher_type: voucher_type,
            message: `Voucher ${voucher_type} berhasil ditukarkan! Kode: ${voucherCode}`,
            mode: envHelper.getApiMode()
        });
        
    } catch (error) {
        console.error('Voucher error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/balance/:userId', authenticateRequest, (req, res) => {
    const { userId } = req.params;
    
    res.json({
        success: true,
        user_id: userId,
        balance: 1000000, // Simulasi
        mode: envHelper.getApiMode()
    });
});


app.get('/api/firebase-config', (req, res) => {
    const firebaseConfig = envHelper.getFirebaseConfig();
    res.json(firebaseConfig);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║    NABUNGYUK BACKEND RUNNING                          ║
║                                                          ║
║   📡 Port: ${PORT}                                            ║
║   🔐 Mode: ${envHelper.getApiMode()}                                       ║
║   🔑 API Keys: ${envHelper.checkRequiredKeys() ? 'Configured ✅' : 'Missing ⚠️'}     ║
║                                                          ║
║   📍 Endpoints:                                          ║
║   - POST   /api/topup                                    ║
║   - POST   /api/withdraw                                 ║
║   - POST   /api/voucher                                  ║
║   - GET    /api/balance/:userId                          ║
║   - GET    /api/health                                   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
});