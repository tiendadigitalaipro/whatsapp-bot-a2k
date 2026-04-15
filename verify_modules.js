// Verificar que los m?dulos se cargan sin error
try {
  const cfg = require('./config');
  console.log('? config.js OK');
  console.log('  Productos ZYNC:', cfg.productos.length);
  console.log('  Amazon ES:', cfg.amazonEspana.length);
  console.log('  Amazon USA:', cfg.amazonUSA.length);
  console.log('  AliExpress:', cfg.aliexpress.length);
  console.log('  Bancos:', Object.keys(cfg.bancos).length);
  console.log('  Primer producto:', cfg.productos[0].nombre);
  console.log('  Emoji OK?', cfg.productos[0].nombre.includes('??') || cfg.productos[0].emoji ? 'SI' : cfg.productos[0].nombre);
} catch(e) {
  console.error('? config.js ERROR:', e.message);
}
try {
  const h = require('./handlers');
  console.log('? handlers.js OK - funci?n:', typeof h.registrarHandlers);
} catch(e) {
  console.error('? handlers.js ERROR:', e.message);
}
