const express= require('express');
const {parseInvoiceFromText, generateReminderEmail, getDashboardSummary}=require("../controllers/aiController");
const {protect}= require("../middlewares/authMiddleware.js");
const router= express.Router();

// @desc parse invoice from text
// @route POST /api/ai/parse-invoice
// @access Private
router.post('/parse-text', protect, parseInvoiceFromText);   
router.post('/generate-reminder', protect, generateReminderEmail);
router.get('/dashboard-summary', protect, getDashboardSummary);

module.exports= router;