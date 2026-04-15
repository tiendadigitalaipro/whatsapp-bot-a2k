// ????????????????????????????????????????????????????
// ?   ZYNC BOT ? config.js                          ?
// ?   Cat?logo de productos, bancos y estados        ?
// ????????????????????????????????????????????????????

// ==================== PRODUCTOS ====================

const ZYNC = [
  { 
    id: 1, 
    nombre: '🎧 Headphones K9', 
    precio: 15, 
    desc: 'Audio HD inalámbrico con graves profundos. Batería de 20 horas. Cancelación de ruido. El mejor sonido para tu música, gaming y llamadas.' 
  },
  { 
    id: 2, 
    nombre: '⌚ Smartwatch Inteligente', 
    precio: 25, 
    desc: 'Monitor de salud 24/7: ritmo cardíaco, oxígeno, presión arterial, sueño. GPS integrado. Notificaciones de WhatsApp, llamadas y apps. Batería 7 días. Resistente al agua.' 
  },
  { 
    id: 3, 
    nombre: '🎤 Micrófono K9 Pro', 
    precio: 15, 
    desc: 'Calidad de estudio profesional. Perfecto para streaming, gaming, podcasts y videollamadas. Plug & Play. Compatible con PC, PS4, PS5, Xbox.' 
  }
];

const AMAZON_ES = [
  { nombre: '💨 Limpiador Aire PC', link: 'https://amzn.to/4cCQkHF', cat: 'tech' },
  { nombre: '💇 Cepillo Secador Voluminizador', link: 'https://amzn.to/4cE3e8b', cat: 'belleza' },
  { nombre: '🌡️ Cepillo Aire Caliente', link: 'https://amzn.to/4kMqROb', cat: 'belleza' },
  { nombre: '🌟 Proyector Astronauta', link: 'https://amzn.to/3OnMw2Z', cat: 'hogar' },
  { nombre: '📱 Catálogo Tecnología', link: 'https://amzn.to/4kMFBwp', cat: 'tech' },
  { nombre: '💪 Pistola Masajes RENPHO', link: 'https://amzn.to/4b27qOi', cat: 'fitness' },
  { nombre: '🏃 Catálogo Fitness Virales', link: 'https://amzn.to/4aDrZ1S', cat: 'fitness' },
  { nombre: '💧 Botella Motivacional 1L', link: 'https://amzn.to/4s3aVtk', cat: 'fitness' },
  { nombre: '💧 Botella Motivacional 2L', link: 'https://amzn.to/4b0DJg6', cat: 'fitness' },
  { nombre: '📹 Cámara Seguridad 360°', link: 'https://amzn.to/3MVT1D5', cat: 'hogar' },
  { nombre: '💡 Sensor Movimiento LED', link: 'https://amzn.to/4tOIh1C', cat: 'hogar' },
  { nombre: '☕ Taza Automática Waymeduo', link: 'https://amzn.to/4bYYR7B', cat: 'hogar' }
];

const AMAZON_USA = [
  { nombre: '💧 Filtro Brita Cromado', link: 'https://amzn.to/40kesHG', cat: 'hogar' },
  { nombre: '💧 Filtro Brita Blanco', link: 'https://amzn.to/4aVTgOI', cat: 'hogar' },
  { nombre: '📱 Gimbal COMITOK L7C Pro', link: 'https://amzn.to/3ZOIX8w', cat: 'tech' },
  { nombre: '💆 Almohadilla Lifepro', link: 'https://amzn.to/4tMXT4H', cat: 'fitness' },
  { nombre: '🏃 Walking Pad Caminadora', link: 'https://amzn.to/4aLiGNx', cat: 'fitness' },
  { nombre: '💪 Mancuernas BDSHE', link: 'https://amzn.to/4b7mgII', cat: 'fitness' },
  { nombre: '💨 Ventilador Techo', link: 'https://amzn.to/3MH9Ec8', cat: 'hogar' },
  { nombre: '🔋 CyberPower Sistema', link: 'https://amzn.to/4b7pyFd', cat: 'tech' },
  { nombre: '🔪 Fullstar Picador', link: 'https://amzn.to/40kFa2T', cat: 'cocina' },
  { nombre: '💄 Limpiador Brochas', link: 'https://amzn.to/4awV5kE', cat: 'belleza' }
];

const ALIEXPRESS = [
  { nombre: '📽️ Proyector 4K', link: 'https://s.click.aliexpress.com/e/_c3IG0O6R' },
  { nombre: '🎧 Lenovo GM2 Pro', link: 'https://s.click.aliexpress.com/e/_c3VeH5PH' },
  { nombre: '🎮 Game Stick Retro', link: 'https://s.click.aliexpress.com/e/_c4461eEX' },
  { nombre: '🎮 Consola Retro M8', link: 'https://s.click.aliexpress.com/e/_c3QeEMWn' }
];

// ==================== BANCOS ====================

const BANCOS_NAC = [
  { n: 'Mercantil', c: '0105-0191-1981-9100-5433', t: 'Abigail Jose Rojas', ci: 'V-11558392', cod: '0105' },
  { n: 'Provincial', c: '0108-0134-6101-0008-0442', t: 'Abigail Jose Rojas', ci: 'V-11558392', cod: '0108' },
  { n: 'Venezuela', c: '0102-0456-9500-0001-9004', t: 'Abigail Rojas', ci: 'V-11558392', cod: '0102' },
  { n: 'Banesco', c: '0134-0059-8105-9304-0991', t: 'Abigail Jose Rojas', ci: 'V-11558392', cod: '0134' },
  { n: 'Tesoro Personal', c: '0163-0209-1020-9500-6416', t: 'Abigail Jose Rojas', ci: 'V-11558392', cod: '0163' },
  { n: 'Tesoro Jurídica', c: '0163-0209-1120-9300-9911', t: 'Inversiones 2k 3112 C.A', ci: 'J-40632338-1', cod: '0163' },
  { n: 'BDT', c: '0175-0525-4000-7219-9833', t: 'Abigail Jose Rojas', ci: 'V-11558392', cod: '0175' },
  { n: 'Exterior', c: '0115-0034-0110-0617-7575', t: 'Abigail Jose Rojas', ci: 'V-11558392', cod: '0115' },
  { n: 'R4', c: '0169-0001-0110-0146-4751', t: 'Abigail Jose Rojas', ci: 'V-11558392', cod: '0169' }
];

const BANCOS_INT = [
  { n: 'Zinli', d: 'abijose1158@gmail.com', tipo: 'Email' },
  { n: 'Wally Tech', d: '+584126148666', tipo: 'Teléfono' },
  { n: 'Payoneer', d: 'inversiones2k3112@hotmail.com', tipo: 'Email' },
  { n: 'Binance', d: 'abijose1158@hotmail.com', tipo: 'Email' },
  { n: 'Global66', d: 'ABIROJ4', tipo: 'Usuario' },
  { n: 'Facebank', d: '56110079352', routing: '021502189', tipo: 'Cuenta + Routing' },
  { n: 'Pipol Pay', d: 'servirefri2k@gmail.com', tipo: 'Email' },
  { n: 'Citibank', d: '70588270001777164', aba: '031100209', swift: 'CITIUS33', tipo: 'Checking' },
  { n: 'Mercantil Panamá', d: '639897225', tipo: 'Cuenta' },
  { n: 'Barking Circles', iban: 'LU194080000056238058', bic: 'BICIRLULL', tipo: 'IBAN' }
];

// ==================== ESTADOS ====================

let estados = {};


module.exports = { ZYNC, AMAZON_ES, AMAZON_USA, ALIEXPRESS, BANCOS_NAC, BANCOS_INT, estados };
