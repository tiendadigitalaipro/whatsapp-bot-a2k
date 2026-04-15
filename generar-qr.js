// Wrapper: captura el QR del bot y lo guarda como PNG escaneable
const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const QR_PATH = path.join(__dirname, 'qr_whatsapp.png');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', async (qr) => {
  console.log('\n========================================');
  console.log('  ZYNC BOT — Generando QR como imagen...');
  console.log('========================================\n');
  try {
    await QRCode.toFile(QR_PATH, qr, {
      type: 'png',
      width: 500,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' }
    });
    console.log('✅ QR guardado en: ' + QR_PATH);
    console.log('📂 Abre el archivo y escanéalo con WhatsApp');
    console.log('   WhatsApp > Dispositivos vinculados > Vincular dispositivo\n');
    // Abrir automáticamente la imagen
    require('child_process').exec('start "" "' + QR_PATH + '"');
  } catch (err) {
    console.error('Error generando QR:', err);
  }
});

client.on('ready', () => {
  console.log('\n✅ ¡BOT CONECTADO! Sesión guardada correctamente.');
  // Borrar imagen QR ya no necesaria
  if (fs.existsSync(QR_PATH)) fs.unlinkSync(QR_PATH);
  console.log('🤖 Zync Electronics Bot v2.0 — ACTIVO\n');
});

client.on('auth_failure', () => {
  console.error('❌ Error de autenticación. Intenta de nuevo.');
});

client.on('disconnected', (reason) => {
  console.log('Bot desconectado:', reason);
});

console.log('⏳ Iniciando bot, espera...\n');
client.initialize();
