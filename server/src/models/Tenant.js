// server/models/Tenant.js
const mongoose = require('mongoose');

const whatsappConfigSchema = new mongoose.Schema({
  phoneNumberId: String,
  accessToken: String,
  webhookUrl: String,
  verifyToken: String
});

const tenantSchema = new mongoose.Schema({
  name: String,
  whatsappConfig: whatsappConfigSchema
});

module.exports = mongoose.model('Tenant', tenantSchema);