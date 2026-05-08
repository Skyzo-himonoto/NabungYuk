const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', mode: 'sandbox' });
});

// Topup
app.post('/api/topup', (req, res) => {
    const { amount, method, user_id } = req.body;
    res.json({
        success: true,
        transaction_id: `TXN_${Date.now()}`,
        amount: amount,
        method: method,
        message: `Top up Rp ${amount.toLocaleString()} via ${method} berhasil!`
    });
});

// Withdraw
app.post('/api/withdraw', (req, res) => {
    const { amount, bank_code, account_number } = req.body;
    res.json({
        success: true,
        withdrawal_id: `WD_${Date.now()}`,
        message: `Penarikan Rp ${amount.toLocaleString()} berhasil!`
    });
});

// Voucher
app.post('/api/voucher', (req, res) => {
    const { voucher_type } = req.body;
    res.json({
        success: true,
        voucher_code: `NBYK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        message: `Voucher ${voucher_type} berhasil ditukar!`
    });
});

// Balance
app.get('/api/balance/:userId', (req, res) => {
    res.json({
        success: true,
        user_id: req.params.userId,
        balance: 1000000
    });
});

module.exports = app;
