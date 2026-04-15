// ZYNC BOT - index.js (Principal)
// Inicia el cliente y registra todos los eventos

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

const { registrarHandlers } = require('./handlers');

// ==================== EVENTOS ====================

client.on('qr', qr => {
  console.log('========================================');
  console.log('     ZYNC ELECTRONICS BOT v2.0');
  console.log('========================================');
  console.log('ESCANEA ESTE QR CON WHATSAPP:');
  console.log('');
  qrcode.generate(qr, { small: true });
  console.log('');
  console.log('Abre WhatsApp > Dispositivos vinculados');
  console.log('========================================');
});

client.on('ready', () => {
  console.log('========================================');
  console.log('✅ BOT ZYNC ELECTRONICS ACTIVO');
  console.log('========================================');
  console.log('📦 Productos ZYNC:', ZYNC.length);
  console.log('🇪🇸 Amazon España:', AMAZON_ES.length);
  console.log('🇺🇸 Amazon USA:', AMAZON_USA.length);
  console.log('🇨🇳 AliExpress:', ALIEXPRESS.length);
  console.log('🛒 BODEGA PRO v2.0: Incluido');
  console.log('💳 Métodos de pago:', BANCOS_NAC.length + BANCOS_INT.length);
  console.log('========================================');
  console.log('Esperando mensajes...');
  console.log('========================================');
});

client.on('authenticated', () => {
  console.log('✅ Autenticación exitosa');
});

client.on('auth_failure', () => {
  console.log('❌ Error de autenticación');
});

client.on('disconnected', (reason) => {
  console.log('⚠️ Bot desconectado:', reason);
});

// Registrar logica de mensajes
registrarHandlers(client);

// ==================== INICIALIZAR ====================

client.initialize();