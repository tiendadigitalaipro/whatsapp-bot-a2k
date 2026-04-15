try {
  const cfg = require('./config');
  const keys = Object.keys(cfg);
  console.log('? config.js OK ? exports:', keys.join(', '));
  console.log('  ZYNC:', cfg.ZYNC.length, 'productos');
  console.log('  AMAZON_ES:', cfg.AMAZON_ES.length);
  console.log('  AMAZON_USA:', cfg.AMAZON_USA.length);
  console.log('  ALIEXPRESS:', cfg.ALIEXPRESS.length);
  console.log('  BANCOS_NAC:', cfg.BANCOS_NAC.length);
  console.log('  BANCOS_INT:', cfg.BANCOS_INT.length);
} catch(e) { console.error('? config.js:', e.message); }

try {
  const h = require('./handlers');
  console.log('? handlers.js OK ? registrarHandlers:', typeof h.registrarHandlers);
} catch(e) { console.error('? handlers.js:', e.message); }

try {
  const idx = require('fs').readFileSync('./index.js', 'utf8');
  if (idx.includes('registrarHandlers') && idx.includes('client.initialize')) {
    console.log('? index.js OK ? tiene registrarHandlers y client.initialize');
  }
} catch(e) { console.error('? index.js:', e.message); }
