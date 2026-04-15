/**
 * ===========================================================
 *  WhatsApp Bot - ZYNC Electronics + A2K Digital Studio v3.0
 *  Bot EXPERTO en Marketing y Ventas por WhatsApp
 *  Responde como un VENDEDOR HUMANO profesional
 * ===========================================================
 *  Tecnología: whatsapp-web.js + Node.js + LocalAuth
 *  Tienda: https://tiendadigitalaipro.github.io/a2k-digital-studio/
 * ===========================================================
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURACIÓN
// ============================================================

const STORE_URL = 'https://tiendadigitalaipro.github.io/a2k-digital-studio/';
const WHATSAPP_NUMBER = '+584164117331';
const BODEGA_DEMO_URL = 'https://tiendadigitalaipro.github.io/bodega-demo/formulario-demo-bodega.html';
const BODEGA_LICENSE_URL = 'https://tiendadigitalaipro.github.io/bodega-demo/formulario-licencia-pro-bodega.html';

// ============================================================
// 9 APLICACIONES A2K DIGITAL STUDIO
// ============================================================

const A2K_APPS = [
  { id: 'barberia', nombre: 'Barbería Pro', icono: '💈', precio: 25, desc: 'Sistema POS profesional para barberías. Gestiona turnos, servicios, clientes, caja, reportes y facturas.', demo: 'https://tiendadigitalaipro.github.io/barberia-pro/', keywords: ['barberia', 'barbero', 'barber', 'corte', 'peluqueria', 'pelu', 'cabello'] },
  { id: 'nail', nombre: 'Nail Studio Pro', icono: '💅', precio: 25, desc: 'Sistema completo para nail studios. Agenda, clientas, servicios, materiales, caja dual dólares y bolívares.', demo: 'https://tiendadigitalaipro.github.io/nail-studio-pro/', keywords: ['nail', 'uñas', 'manicura', 'pedicura', 'belleza', 'estetica', 'estética', 'manicure'] },
  { id: 'repuestos', nombre: 'Repuestos de Motos Pro', icono: '🏍️', precio: 25, desc: 'Sistema integral para tiendas de repuestos de motos. Catálogo, inventario, ventas y reportes.', demo: 'https://tiendadigitalaipro.github.io/Repuestos-de-motos-pro-/', keywords: ['repuestos', 'motos', 'motocicleta', 'taller', 'mecanica'] },
  { id: 'ferreteria', nombre: 'Ferretería A2K Pro', icono: '🔧', precio: 25, desc: 'Sistema de gestión para ferreterías. Inventario, ventas, facturación, proveedores y reportes.', demo: 'https://tiendadigitalaipro.github.io/ferreteriaa2kDiitalStudioPro/', keywords: ['ferreteria', 'herramientas', 'construccion', 'tornillo'] },
  { id: 'bodega', nombre: 'Bodega Descarga Pro', icono: '📦', precio: 25, desc: 'Gestión comercial completa para bodegas y abastos. ¡Funciona SIN internet! Inventario, ventas, facturación, escáner QR.', demo: 'https://tiendadigitalaipro.github.io/bodega-pro-descarga.html/', keywords: ['bodega', 'abasto', 'descarga', 'almacen', 'almacén', 'mayoreo', 'mayorista', 'despensa'] },
  { id: 'mercado', nombre: 'MERCADO LOGIC PRO', icono: '🛒', precio: 25, desc: 'El sistema POS más avanzado de A2K. Sistema IRON LOCK v2, inventario multi-almacén, multi-usuario, analíticas.', demo: 'https://tiendadigitalaipro.github.io/mercado-logic-pro/', keywords: ['mercado', 'supermercado', 'pos', 'industrial', 'negocio', 'logic'] },
  { id: 'farmacia', nombre: 'Farmacia Pro Plus', icono: '💊', precio: 25, desc: 'Sistema de gestión para farmacias. Control de medicamentos, inventario por lote, alertas de vencimiento.', demo: null, keywords: ['farmacia', 'medicamentos', 'drogueria', 'droguería', 'botica', 'salud'] },
  { id: 'fruteria', nombre: 'Frutería Pro', icono: '🍎', precio: 25, desc: 'Sistema POS para fruterías con 74 productos pre-cargados. Inventario, ventas y control total.', demo: null, keywords: ['fruteria', 'frutas', 'verdura', 'hortaliza', 'verduleria'] },
  { id: 'cloud', nombre: 'Bodega Pro Cloud', icono: '☁️', precio: 25, desc: 'Bodega Pro con sincronización en la nube. Multi-dispositivo, respaldo automático, colaboración en equipo.', demo: null, keywords: ['cloud', 'nube', 'sincronizar', 'online', 'sincronización'] }
];

// ============================================================
// PRODUCTOS ZYNC ELECTRONICS
// ============================================================

const ZYNC_PRODUCTS = [
  { id: 1, nombre: '🎧 Headphones K9', precio: 15, desc: 'Audio HD inalámbrico con graves profundos. Batería de 20 horas. Cancelación de ruido.' },
  { id: 2, nombre: '⌚ Smartwatch Inteligente', precio: 25, desc: 'Monitor de salud 24/7: ritmo cardíaco, oxígeno, presión arterial, sueño. GPS. Notificaciones. Batería 7 días.' },
  { id: 3, nombre: '🎤 Micrófono K9 Pro', precio: 15, desc: 'Calidad profesional. Perfecto para streaming, gaming, podcasts. Plug & Play.' }
];

// ============================================================
// AMAZON ESPAÑA (12 productos)
// ============================================================

const AMAZON_ES = [
  { nombre: '💨 Limpiador Aire PC', link: 'https://amzn.to/4cCQkHF' },
  { nombre: '💇 Cepillo Secador Voluminizador', link: 'https://amzn.to/4cE3e8b' },
  { nombre: '🌡️ Cepillo Aire Caliente', link: 'https://amzn.to/4kMqROb' },
  { nombre: '🌟 Proyector Astronauta', link: 'https://amzn.to/3OnMw2Z' },
  { nombre: '📱 Catálogo Tecnología', link: 'https://amzn.to/4kMFBwp' },
  { nombre: '💪 Pistola Masajes RENPHO', link: 'https://amzn.to/4b27qOi' },
  { nombre: '🏃 Catálogo Fitness Virales', link: 'https://amzn.to/4aDrZ1S' },
  { nombre: '💧 Botella Motivacional 1L', link: 'https://amzn.to/4s3aVtk' },
  { nombre: '💧 Botella Motivacional 2L', link: 'https://amzn.to/4b0DJg6' },
  { nombre: '📹 Cámara Seguridad 360°', link: 'https://amzn.to/3MVT1D5' },
  { nombre: '💡 Sensor Movimiento LED', link: 'https://amzn.to/4tOIh1C' },
  { nombre: '☕ Taza Automática Waymeduo', link: 'https://amzn.to/4bYYR7B' }
];

// ============================================================
// AMAZON USA (10 productos)
// ============================================================

const AMAZON_USA = [
  { nombre: '💧 Filtro Brita Cromado', link: 'https://amzn.to/40kesHG' },
  { nombre: '💧 Filtro Brita Blanco', link: 'https://amzn.to/4aVTgOI' },
  { nombre: '📱 Gimbal COMITOK L7C Pro', link: 'https://amzn.to/3ZOIX8w' },
  { nombre: '💆 Almohadilla Lifepro', link: 'https://amzn.to/4tMXT4H' },
  { nombre: '🏃 Walking Pad Caminadora', link: 'https://amzn.to/4aLiGNx' },
  { nombre: '💪 Mancuernas BDSHE', link: 'https://amzn.to/4b7mgII' },
  { nombre: '💨 Ventilador Techo', link: 'https://amzn.to/3MH9Ec8' },
  { nombre: '🔋 CyberPower Sistema', link: 'https://amzn.to/4b7pyFd' },
  { nombre: '🔪 Fullstar Picador', link: 'https://amzn.to/40kFa2T' },
  { nombre: '💄 Limpiador Brochas', link: 'https://amzn.to/4awV5kE' }
];

// ============================================================
// ALIEXPRESS (4 productos)
// ============================================================

const ALIEXPRESS = [
  { nombre: '📽️ Proyector 4K', link: 'https://s.click.aliexpress.com/e/_c3IG0O6R' },
  { nombre: '🎧 Lenovo GM2 Pro', link: 'https://s.click.aliexpress.com/e/_c3VeH5PH' },
  { nombre: '🎮 Game Stick Retro', link: 'https://s.click.aliexpress.com/e/_c4461eEX' },
  { nombre: '🎮 Consola Retro M8', link: 'https://s.click.aliexpress.com/e/_c3QeEMWn' }
];

// ============================================================
// BANCOS NACIONALES (9)
// ============================================================

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

// ============================================================
// BANCOS INTERNACIONALES (10)
// ============================================================

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

// ============================================================
// MAPEO DE NEGOCIOS A APPS
// ============================================================

const NEGOCIO_APP_MAP = [
  { palabras: ['barberia', 'barbero', 'barber', 'corte', 'peluqueria', 'cabello', 'estilista'], appId: 'barberia', tipo: 'barbería' },
  { palabras: ['nail', 'uña', 'uñas', 'manicura', 'pedicura', 'estetica', 'estética', 'belleza'], appId: 'nail', tipo: 'nail studio' },
  { palabras: ['motos', 'moto', 'repuesto', 'motocicleta', 'taller', 'mecanica'], appId: 'repuestos', tipo: 'repuestos de motos' },
  { palabras: ['ferreteria', 'ferretería', 'herramientas', 'construccion', 'tornillo'], appId: 'ferreteria', tipo: 'ferretería' },
  { palabras: ['bodega', 'abasto', 'descarga', 'almacen', 'mayoreo', 'despensa', 'minimarket'], appId: 'bodega', tipo: 'bodega/abasto' },
  { palabras: ['supermercado', 'mercado', 'industrial', 'cadenas'], appId: 'mercado', tipo: 'supermercado/mercado' },
  { palabras: ['farmacia', 'medicamentos', 'drogueria', 'botica', 'salud'], appId: 'farmacia', tipo: 'farmacia' },
  { palabras: ['fruteria', 'frutería', 'frutas', 'verdura', 'hortaliza'], appId: 'fruteria', tipo: 'frutería' },
  { palabras: ['nube', 'cloud', 'sincronizar', 'online', 'multi-dispositivo'], appId: 'cloud', tipo: 'cloud/multi-sede' }
];

// ============================================================
// ESTADOS DE CONVERSACIÓN
// ============================================================

const estados = {};
const ESTADOS = {
  NUEVO: 'nuevo', DESCUBRIMIENTO: 'descubrimiento', RECOMENDACION: 'recomendacion',
  PRESENTACION: 'presentacion', OBJECION: 'objecion', CIERRE: 'cierre',
  COMPRA: 'compra', BANCO: 'banco', DATOS_CLIENTE: 'datos_cliente',
  COMPROBANTE: 'comprobante', POST_VENTA: 'post_venta', MENU_CATALOGO: 'menu_catalogo',
  MENU_ZYNC: 'menu_zync', MENU_AMAZON_ES: 'menu_amazon_es', MENU_AMAZON_USA: 'menu_amazon_usa',
  MENU_ALIEXPRESS: 'menu_aliexpress', MENU_PAGOS: 'menu_pagos',
  DETALLE_APP: 'detalle_app', DETALLE_ZYNC: 'detalle_zync'
};

function getEstado(num) {
  if (!estados[num]) {
    estados[num] = {
      paso: ESTADOS.NUEVO, appRecomendada: null, negocioDetectado: null,
      interacciones: 0, ultimaInteraccion: Date.now(), nombre: null,
      productoZync: null, bancoSeleccionado: null, mensajesPrevios: [],
      objecionActual: null, retorno: false
    };
    log(`🆕 Nueva conversación: ${maskPhone(num)}`);
  }
  return estados[num];
}

function actualizarEstado(num) {
  if (estados[num]) {
    estados[num].interacciones++;
    estados[num].ultimaInteraccion = Date.now();
  }
}

// ============================================================
// UTILIDADES
// ============================================================

function log(msg) { console.log(`[${new Date().toISOString()}] ${msg}`); }
function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function smartDelay(msgLength) {
  const ms = Math.min(800 + (msgLength * 15) + (Math.random() * 600), 4000);
  return delay(Math.max(ms, 1000));
}
function normalize(text) {
  return text.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '');
}
function saveSale(filename, data) {
  const line = `[${new Date().toLocaleString('es-VE')}] ${data}\n`;
  fs.appendFileSync(path.join(__dirname, filename), line, 'utf-8');
}
function saveLog(data) {
  fs.appendFileSync(path.join(__dirname, 'conversaciones.txt'), `[${new Date().toLocaleString('es-VE')}] ${data}\n`, 'utf-8');
}
function findAppById(id) { return A2K_APPS.find(a => a.id === id); }
function findAppByNumber(num) { const idx = parseInt(num) - 1; return (idx >= 0 && idx < A2K_APPS.length) ? A2K_APPS[idx] : null; }
function findAppByKeyword(text) {
  const t = normalize(text);
  for (const app of A2K_APPS) {
    for (const kw of app.keywords) { if (t.includes(normalize(kw))) return app; }
  }
  return null;
}
function detectarNegocio(text) {
  const t = normalize(text);
  for (const mapping of NEGOCIO_APP_MAP) {
    for (const palabra of mapping.palabras) {
      if (t.includes(normalize(palabra))) {
        return { app: findAppById(mapping.appId), tipo: mapping.tipo };
      }
    }
  }
  return null;
}
function maskPhone(phone) {
  const clean = phone.replace('@c.us', '').replace('+', '');
  return clean.length >= 8 ? `+${clean.substring(0, 4)}XXXX${clean.substring(clean.length - 2)}` : phone;
}
function horaDelDia() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'dia';
  if (h >= 12 && h < 19) return 'tarde';
  return 'noche';
}

// ============================================================
// PLANTILLAS
// ============================================================

const SALUDOS = [
  '¡Hola! ¿Cómo estás? 👋 Me llamo Abi, soy de *A2K Digital Studio* y *ZYNC Electronics*. ¿En qué te puedo ayudar hoy?',
  '¡Buenas! 😊 Bienvenido/a. Cuéntame, ¿qué estás buscando? ¿Un sistema para tu negocio o algún gadget?',
  '¡Hey! 👋 Gracias por escribirnos. ¿Buscas tecnología, sistemas para tu negocio o algo más? Cuéntame 💡',
  '¡Hola amigo/a! 😊 Estás en *A2K Digital Studio* + *ZYNC Electronics*. ¿Qué necesitas hoy?'
];

const SALUDOS_RETORNO = [
  '¡Qué gusto tenerte de vuelta! 😊 ¿En qué te ayudo?',
  '¡Hola de nuevo! 👋 ¿Cómo puedo ayudarte?',
  '¡Bienvenido/a de nuevo! 💪 ¿Qué necesitas?'
];

const GRACIAS = [
  '¡De nada! 😊 ¿Necesitas algo más?',
  '¡Con mucho gusto! 💪 ¿Algo más?',
  '¡A la orden! ✨ ¿Puedo ayudarte con algo más?'
];

const DESPEDIDAS = [
  '¡Hasta luego! 👋 ¡Éxitos con tu negocio! 💪',
  '¡Que te vaya súper! ✨ Aquí estaré cuando me necesites 😊',
  '¡Nos vemos! 👋 ¡Que te vaya muy bien! 🙌'
];

const NO_ENTIENDO = [
  'Mmm, no entendí bien 🤔 ¿Tienes un negocio y buscas sistema? ¿O buscas gadgets? Cuéntame 😊',
  '¿Podrías explicarme un poco más? 😅 ¿Qué tipo de negocio tienes o qué producto buscas?',
  'No capté bien tu mensaje 🙈 Escribe *menu* para ver todas las opciones 💪'
];

const OBJECIONES = {
  caro: {
    triggers: ['caro', 'mucha plata', 'mucho dinero', 'no tengo', 'costoso', 'no puedo pagar', 'es mucho', 'no alcanza'],
    respuestas: [
      'Te entiendo 🤔 Pero mira: $25 es pago ÚNICO. Sin mensualidades. Otros cobran $30-100 USD al mes por menos.\n\nEn una semana de uso ya pagó solo porque ahorras tiempo y evitas pérdidas 💰\n\n¿Quieres ver la demo gratis primero? 🎮',
      'Oye, $25 USD UNA SOLA VEZ, de por vida. ¿Sabes cuánto pierdes por mes sin tener control de tu negocio? Más que eso 📈\n\nPrueba la demo y decides. Sin compromiso 😊'
    ]
  },
  dudar: {
    triggers: ['no se', 'dudo', 'tengo dudas', 'estafa', 'sera verdad', 'no creo'],
    respuestas: [
      'Es normal tener dudas 😊 Por eso tenemos demo GRATIS. Pruébalo tú mismo/a sin compromiso.\n\nMás de 50 negocios en Venezuela ya lo usan. Desarrollado por ingenieros venezolanos 💪\n\n¿Te mando la demo? 🎮'
    ]
  },
  pensar: {
    triggers: ['voy a pensar', 'lo pienso', 'después', 'luego', 'te aviso', 'no me interesa', 'no gracias'],
    respuestas: [
      'Tranquilo/a, sin apuro 😊 Solo te digo: este precio de $25 es especial. Cuando estés listo/a, aquí estoy 💪\n\n¡Éxitos con tu negocio! 🚀'
    ]
  },
  gratis: {
    triggers: ['gratis', 'free', 'gratuito', 'no quiero pagar', 'pirata'],
    respuestas: [
      '¡La DEMO es 100% gratuita! 🎮 Puedes probar todo sin pagar nada.\n\nLa licencia completa son solo $25 USD una vez — desarrollada por ingenieros reales que necesitan comer también 😄\n\n¿Quieres la demo gratis? 🎮'
    ]
  }
};

const CIERRES = [
  '¿Qué dices? 💪 Por solo $25 USD (pago único) tienes el sistema completo con soporte y actualizaciones gratis.\n\n¿Te guío con los métodos de pago? Tengo 19 opciones 💳',
  'Son solo $25 USD. Una inversión que se paga sola en la primera semana 📈\n\n¿Listo/a para dar el paso? 💪'
];

// ============================================================
// CONSTRUCTORES DE MENSAJES
// ============================================================

function buildMenuPrincipal() {
  return `🚀 *ZYNC Electronics + A2K Digital Studio*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📱 *Sistemas para negocios:*\n` +
    `1️⃣ Ver catálogo de apps (9 sistemas)\n` +
    `2️⃣ Comprar una app ($25 USD)\n` +
    `3️⃣ Probar demo gratis\n\n` +
    `🎧 *ZYNC Electronics:*\n` +
    `4️⃣ Headphones K9 - $15\n` +
    `5️⃣ Smartwatch - $25\n` +
    `6️⃣ Micrófono K9 Pro - $15\n\n` +
    `🛒 *Afiliados:*\n` +
    `7️⃣ Amazon España\n` +
    `8️⃣ Amazon USA\n` +
    `9️⃣ AliExpress\n\n` +
    `💳 *Otros:*\n` +
    `🔟 Métodos de pago (19 opciones)\n` +
    `1️⃣1️⃣ 🔥 Bodega Pro (especial)\n` +
    `1️⃣2️⃣ Hablar con Ingeniero\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Responde con el número o cuéntame qué negocio tienes 💡\n\n` +
    `🏪 ${STORE_URL}`;
}

function buildCatalogo() {
  let msg = `📱 *CATÁLOGO - A2K Digital Studio*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  A2K_APPS.forEach((app, i) => {
    msg += `${i + 1}. ${app.icono} *${app.nombre}* — $${app.precio} USD\n   ${app.desc}\n\n`;
  });
  msg += `━━━━━━━━━━━━━━━━━━━━━━━\n💰 *$25 USD por app (pago único)*\n➕ Terminal adicional: $5 USD\n\n🎮 Escribe el nombre de cualquier app para más detalles`;
  return msg;
}

function buildDetalleApp(app) {
  let msg = `${app.icono} *${app.nombre}*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `📝 ${app.desc}\n\n💰 *Precio:* $${app.precio} USD (pago único)\n➕ Terminal extra: $5 USD\n\n`;
  msg += app.demo ? `🎮 *Demo:* ${app.demo}\n\n` : `🎮 Demo próximamente disponible\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━\n✅ *SI* → Comprar | 🎮 *DEMO* → Probar | 📱 *catálogo* → Ver todo`;
  return msg;
}

function buildZync() {
  let msg = `🎧 *ZYNC Electronics*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  ZYNC_PRODUCTS.forEach(p => {
    msg += `${p.nombre}\n💰 $${p.precio} USD\n📝 ${p.desc}\n\n`;
  });
  msg += `━━━━━━━━━━━━━━━━━━━━━━━\n📦 Entrega inmediata en Venezuela\n💳 Escribe *pagos* para métodos de pago`;
  return msg;
}

function buildAmazonES() {
  let msg = `🇪🇸 *Amazon España*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  AMAZON_ES.forEach((p, i) => { msg += `${i + 1}. ${p.nombre}\n👉 ${p.link}\n\n`; });
  msg += `📱 Escribe *menu* para volver`;
  return msg;
}

function buildAmazonUSA() {
  let msg = `🇺🇸 *Amazon USA*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  AMAZON_USA.forEach((p, i) => { msg += `${i + 1}. ${p.nombre}\n👉 ${p.link}\n\n`; });
  msg += `📱 Escribe *menu* para volver`;
  return msg;
}

function buildAliExpress() {
  let msg = `🌏 *AliExpress*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  ALIEXPRESS.forEach((p, i) => { msg += `${i + 1}. ${p.nombre}\n👉 ${p.link}\n\n`; });
  msg += `📱 Escribe *menu* para volver`;
  return msg;
}

function buildPagos() {
  let msg = `💳 *MÉTODOS DE PAGO — 19 OPCIONES*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `🇻🇪 *NACIONALES (Bolívares):*\n`;
  BANCOS_NAC.forEach((b, i) => {
    msg += `${i + 1}. 🏦 *${b.n}* | ${b.c} | ${b.t} | ${b.ci}\n`;
  });
  msg += `\n🇺🇸 *INTERNACIONALES (USD):*\n`;
  BANCOS_INT.forEach((b, i) => {
    let dato = b.tipo === 'IBAN' ? `IBAN: ${b.iban} BIC: ${b.bic}` :
      b.tipo === 'Checking' ? `${b.d} ABA: ${b.aba}` :
      b.tipo === 'Cuenta + Routing' ? `${b.d} Routing: ${b.routing}` : b.d;
    msg += `${BANCOS_NAC.length + i + 1}. 💳 *${b.n}* | ${dato}\n`;
  });
  msg += `\n━━━━━━━━━━━━━━━━━━━━━━━\n📸 Paga y envía el comprobante para activar tu licencia ⚡`;
  return msg;
}

function buildBancoSeleccion(appName) {
  let msg = `🎉 ¡Excelente! Vamos a adquirir *${appName}*\n\n`;
  msg += `🇻🇪 *NACIONALES:*\n`;
  BANCOS_NAC.forEach((b, i) => { msg += `${i + 1}. ${b.n}\n`; });
  msg += `\n🇺🇸 *INTERNACIONALES:*\n`;
  BANCOS_INT.forEach((b, i) => { msg += `${BANCOS_NAC.length + i + 1}. ${b.n}\n`; });
  msg += `\n━━━━━━━━━━━━━━━━━━━━━━━\nEscribe el *número* del banco donde vas a pagar 👆`;
  return msg;
}

function buildBancoData(banco, isNacional, appName) {
  let msg = `🏦 *DATOS PARA EL PAGO*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  if (isNacional) {
    msg += `🇻🇪 *Banco ${banco.n}*\n📄 Cuenta: ${banco.c}\n👤 Titular: ${banco.t}\n🆔 CI/RIF: ${banco.ci}\n`;
  } else {
    msg += `🇺🇸 *${banco.n}*\n`;
    if (banco.tipo === 'IBAN') msg += `📄 IBAN: ${banco.iban}\n🏦 BIC: ${banco.bic}\n`;
    else if (banco.tipo === 'Checking') msg += `📄 Cuenta: ${banco.d}\n🏦 ABA: ${banco.aba}\nSWIFT: ${banco.swift}\n`;
    else if (banco.tipo === 'Cuenta + Routing') msg += `📄 Cuenta: ${banco.d}\n🏦 Routing: ${banco.routing}\n`;
    else msg += `📄 ${banco.tipo}: ${banco.d}\n`;
  }
  msg += `\n━━━━━━━━━━━━━━━━━━━━━━━\n💰 *Monto:* $25 USD\n\n📸 Realiza el pago y envía:\n1️⃣ Datos: Nombre, Cédula, Teléfono, Dirección\n2️⃣ Comprobante de pago\n\n¡Te activamos al instante! ⚡`;
  return msg;
}

function buildBodegaEspecial() {
  return `🔥 *BODEGA DESCARGA PRO* ⭐\n━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📦 El sistema #1 para bodegas en Venezuela\n\n` +
    `✅ *¡FUNCIONA SIN INTERNET!*\n✅ Escáner QR/Código de barras\n✅ Inventario completo\n✅ Facturación profesional\n✅ Más de 50 bodegas ya lo usan\n\n` +
    `🎮 Demo: ${BODEGA_DEMO_URL}\n📋 Licencia: ${BODEGA_LICENSE_URL}\n\n💰 *$25 USD (pago único)*\n\n` +
    `• *comprar* → Adquirir ahora\n• *demo* → Probar gratis\n• *menu* → Volver`;
}

function buildContacto() {
  return `👤 *Hablar con Ingeniero*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n📱 WhatsApp: ${WHATSAPP_NUMBER}\n🏪 Tienda: ${STORE_URL}\n\n¡Escríbenos y te ayudamos! 😊`;
}

function buildPrecios() {
  return `💰 *PRECIOS*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `💎 Apps POS: *$25 USD* (pago único)\n➕ Terminal adicional: *$5 USD*\n\n` +
    `🎧 ZYNC Electronics:\n• Headphones K9: $15 USD\n• Smartwatch: $25 USD\n• Micrófono K9: $15 USD\n\n` +
    `✅ Sin mensualidades\n✅ Soporte incluido\n✅ Actualizaciones gratis\n\n💡 Otros cobran $30-100 USD mensuales. Nosotros: UNA VEZ 💎`;
}

// ============================================================
// MOTOR DE DETECCIÓN DE INTENCIÓN
// ============================================================

function detectarIntencion(text) {
  const t = normalize(text);

  const saludos = ['hola', 'buenas', 'hey', 'ey', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'saludos', 'epa', 'buen dia'];
  if (saludos.some(s => t.includes(s))) return 'saludo';

  const despedidas = ['chao', 'adios', 'bye', 'hasta luego', 'cuidate', 'nos vemos', 'me voy'];
  if (despedidas.some(d => t.includes(d))) return 'despedida';

  const gracias = ['gracias', 'muchas gracias', 'thank', 'te lo agradezco', 'gracia'];
  if (gracias.some(g => t.includes(g))) return 'agradecimiento';

  if (/^(menu|menú|inicio|start|ayuda|help)$/i.test(t)) return 'menu';
  if (/^(catalogo|catálogo|apps|aplicaciones|sistemas|ver todo)$/i.test(t)) return 'catalogo';
  if (t.includes('precio') || t.includes('cuanto cuesta') || t.includes('cuanto vale')) return 'precios';
  if (t.includes('demo') || t.includes('probar') || t.includes('prueba')) return 'demo';
  if (t.includes('pago') || t.includes('pagar') || t.includes('banco') || t.includes('transferencia')) return 'pagos';
  if (t.includes('bodega') && (t.includes('especial') || t.includes('pro'))) return 'bodega_especial';
  if (t.includes('contacto') || t.includes('ingeniero') || t.includes('soporte')) return 'contacto';

  if (t.includes('amazon') && (t.includes('españa') || t.includes('spain'))) return 'amazon_es';
  if (t.includes('amazon') && (t.includes('usa') || t.includes('eeuu'))) return 'amazon_usa';
  if (t.includes('amazon')) return 'amazon_general';
  if (t.includes('aliexpress') || t.includes('ali')) return 'aliexpress';
  if (t.includes('zync') || t.includes('headphone') || t.includes('auricular') || t.includes('smartwatch') || t.includes('microfono') || t.includes('micrófono')) return 'zync';

  const compra = ['quiero comprar', 'deseo comprar', 'como compro', 'lo quiero', 'me lo llevo', 'comprar'];
  if (compra.some(c => t.includes(c))) return 'compra_intencion';

  const acepta = ['si', 'sí', 'yes', 'dale', 'vale', 'ok', 'claro', 'vamos', 'de una'];
  if (acepta.some(a => t === a || (t.includes(a) && t.length < 15))) return 'aceptacion';

  const negocio = detectarNegocio(text);
  if (negocio) return { tipo: 'negocio_detectado', app: negocio.app, tipoNegocio: negocio.tipo };

  const app = findAppByKeyword(text);
  if (app) return { tipo: 'app_mencionada', app };

  for (const [key, obj] of Object.entries(OBJECIONES)) {
    if (obj.triggers.some(trigger => t.includes(normalize(trigger)))) {
      return { tipo: 'objecion', tipoObjecion: key };
    }
  }

  return 'no_identificado';
}

// ============================================================
// MOTOR PRINCIPAL
// ============================================================

async function procesarMensaje(msg) {
  const chatId = msg.from;
  const text = msg.body || '';

  // Filtrar PRIMERO — ignorar grupos, broadcasts y vacíos
  if (chatId.endsWith('@g.us')) return;
  if (chatId === 'status@broadcast') return;
  if (!chatId.endsWith('@c.us') && !chatId.endsWith('@lid')) return;
  if (!text.trim()) return;

  const phoneId = msg.from;
  log(`✉️  MENSAJE DIRECTO de ${maskPhone(phoneId)}: "${text.substring(0,40)}"`);
  const estado = getEstado(phoneId);

  estado.mensajesPrevios.push(text);
  if (estado.mensajesPrevios.length > 10) estado.mensajesPrevios.shift();
  actualizarEstado(phoneId);
  saveLog(`[${maskPhone(phoneId)}] ${text}`);

  const intencion = detectarIntencion(text);
  log(`🔍 [${maskPhone(phoneId)}] Intent: ${typeof intencion === 'string' ? intencion : intencion.tipo} | State: ${estado.paso}`);

  // Estados especiales primero
  if (estado.paso === ESTADOS.COMPROBANTE) { await handleComprobante(msg, estado, phoneId, text); return; }
  if (estado.paso === ESTADOS.DATOS_CLIENTE) { await handleDatosCliente(msg, estado, phoneId, text); return; }
  if (estado.paso === ESTADOS.BANCO) { await handleBanco(msg, estado, phoneId, text); return; }
  if (estado.paso === ESTADOS.DETALLE_APP) { await handleDetalleApp(msg, estado, phoneId, text, intencion); return; }
  if (estado.paso === ESTADOS.DETALLE_ZYNC) { await handleDetalleZync(msg, estado, phoneId, text, intencion); return; }

  // Comandos universales
  if (intencion === 'menu') { await reply(msg, buildMenuPrincipal()); estado.paso = ESTADOS.NUEVO; return; }
  if (intencion === 'despedida') { await reply(msg, randomChoice(DESPEDIDAS)); estado.paso = ESTADOS.NUEVO; return; }
  if (intencion === 'agradecimiento') { await reply(msg, randomChoice(GRACIAS)); return; }
  if (intencion === 'catalogo') { estado.paso = ESTADOS.MENU_CATALOGO; await reply(msg, buildCatalogo()); return; }
  if (intencion === 'precios') { await reply(msg, buildPrecios()); return; }
  if (intencion === 'demo') { await reply(msg, buildDemoGeneral()); return; }
  if (intencion === 'pagos') { await reply(msg, buildPagos()); return; }
  if (intencion === 'amazon_es') { await reply(msg, buildAmazonES()); return; }
  if (intencion === 'amazon_usa') { await reply(msg, buildAmazonUSA()); return; }
  if (intencion === 'amazon_general') { await reply(msg, `¿Amazon de cuál?\n\n🇪🇸 Escribe *amazon españa*\n🇺🇸 Escribe *amazon usa*`); return; }
  if (intencion === 'aliexpress') { await reply(msg, buildAliExpress()); return; }
  if (intencion === 'zync') { estado.paso = ESTADOS.MENU_ZYNC; await reply(msg, buildZync()); return; }
  if (intencion === 'bodega_especial') { await reply(msg, buildBodegaEspecial()); return; }
  if (intencion === 'contacto') { await reply(msg, buildContacto()); return; }

  if (typeof intencion === 'object' && intencion.tipo === 'objecion') { await handleObjecion(msg, estado, phoneId, intencion.tipoObjecion); return; }
  if (typeof intencion === 'object' && intencion.tipo === 'negocio_detectado') { await handleNegocioDetectado(msg, estado, phoneId, intencion.app, intencion.tipoNegocio); return; }
  if (typeof intencion === 'object' && intencion.tipo === 'app_mencionada') { await handleAppMencionada(msg, estado, phoneId, intencion.app); return; }
  if (intencion === 'compra_intencion') { await handleCompraIntencion(msg, estado, phoneId); return; }
  if (intencion === 'aceptacion' && (estado.paso === ESTADOS.PRESENTACION || estado.paso === ESTADOS.CIERRE)) { await handleAceptacion(msg, estado, phoneId); return; }
  if (intencion === 'saludo') { await handleSaludo(msg, estado, phoneId); return; }
  if (/^\d+$/.test(text.trim())) { await handleNumero(msg, estado, phoneId, text.trim()); return; }

  await handleNoIdentificado(msg, estado, phoneId, text);
}

// Helper reply con delay
async function reply(msg, texto) {
  await smartDelay(texto.length);
  await msg.reply(texto);
}

// ============================================================
// HANDLERS
// ============================================================

async function handleSaludo(msg, estado, phoneId) {
  const hora = horaDelDia();
  let respuesta;
  if (estado.retorno || estado.interacciones > 2) {
    respuesta = randomChoice(SALUDOS_RETORNO);
    if (estado.appRecomendada) respuesta += `\n\n¿Sigues viendo *${estado.appRecomendada.nombre}*? 😊`;
    estado.retorno = true;
  } else {
    respuesta = hora === 'tarde' ? '¡Buenas tardes! 🌅 ' + randomChoice(SALUDOS) :
      hora === 'noche' ? '¡Buenas noches! 🌙 ' + randomChoice(SALUDOS) : randomChoice(SALUDOS);
  }
  estado.paso = ESTADOS.DESCUBRIMIENTO;
  await reply(msg, respuesta);
}

async function handleNegocioDetectado(msg, estado, phoneId, app, tipoNegocio) {
  estado.appRecomendada = app;
  estado.negocioDetectado = tipoNegocio;
  estado.paso = ESTADOS.PRESENTACION;
  log(`🎯 Negocio: ${tipoNegocio} → ${app.nombre} [${maskPhone(phoneId)}]`);

  let respuesta = `¡Tengo justo lo que necesitas! 😊\n\n${app.icono} *${app.nombre}*\n\n${app.desc}\n\n`;
  respuesta += `💰 *$${app.precio} USD* (pago único, sin mensualidades)\n`;
  if (app.demo) respuesta += `🎮 *Demo gratis:* ${app.demo}\n\n`;
  respuesta += `✅ Escribe *SI* para comprar | 🎮 *demo* para probar | 📱 *catálogo* para ver todo`;
  await reply(msg, respuesta);
}

async function handleAppMencionada(msg, estado, phoneId, app) {
  estado.appRecomendada = app;
  estado.paso = ESTADOS.DETALLE_APP;
  await reply(msg, buildDetalleApp(app));
}

async function handleCompraIntencion(msg, estado, phoneId) {
  if (estado.appRecomendada) {
    await iniciarFlujoCompra(msg, estado, phoneId, estado.appRecomendada);
  } else {
    let respuesta = `¡Me alegra que quieras adquirir! 💪 ¿Cuál app te interesa?\n\n`;
    A2K_APPS.forEach((app, i) => { respuesta += `${i + 1}. ${app.icono} ${app.nombre}\n`; });
    await reply(msg, respuesta);
  }
}

async function handleAceptacion(msg, estado, phoneId) {
  if (estado.appRecomendada) {
    await iniciarFlujoCompra(msg, estado, phoneId, estado.appRecomendada);
  } else {
    await reply(msg, randomChoice(GRACIAS) + `\n\n¿Te muestro el catálogo? Escribe *catálogo* 💡`);
  }
}

async function handleObjecion(msg, estado, phoneId, tipoObjecion) {
  const objData = OBJECIONES[tipoObjecion];
  if (!objData) return;
  estado.objecionActual = tipoObjecion;
  estado.paso = ESTADOS.OBJECION;
  let respuesta = randomChoice(objData.respuestas);
  if (estado.appRecomendada && estado.appRecomendada.demo) {
    respuesta += `\n\n🎮 Demo gratis: ${estado.appRecomendada.demo}`;
  }
  log(`⚠️ Objeción: ${tipoObjecion} [${maskPhone(phoneId)}]`);
  await reply(msg, respuesta);
}

async function handleNoIdentificado(msg, estado, phoneId, text) {
  if (estado.paso === ESTADOS.DESCUBRIMIENTO || estado.paso === ESTADOS.NUEVO) {
    const negocio = detectarNegocio(text);
    if (negocio) { await handleNegocioDetectado(msg, estado, phoneId, negocio.app, negocio.tipo); return; }

    if (estado.interacciones > 2) {
      await reply(msg, randomChoice(NO_ENTIENDO) + `\n\n📱 *catálogo* → Apps\n🎧 *zync* → Gadgets\n💳 *pagos* → Métodos de pago\n📋 *menu* → Ver todo`);
    } else {
      await reply(msg, `Cuéntame, ¿qué tipo de negocio tienes? Así te recomiendo lo ideal 💡\n\nO si buscas gadgets (audífonos, smartwatch) escribe *zync* 🎧`);
      estado.paso = ESTADOS.DESCUBRIMIENTO;
    }
    return;
  }

  if (estado.paso === ESTADOS.PRESENTACION || estado.paso === ESTADOS.CIERRE) {
    for (const [key, obj] of Object.entries(OBJECIONES)) {
      if (obj.triggers.some(t => normalize(text).includes(normalize(t)))) {
        await handleObjecion(msg, estado, phoneId, key); return;
      }
    }
    const acepta = ['si', 'sí', 'dale', 'vale', 'ok', 'quiero', 'comprar'];
    if (acepta.some(a => normalize(text).includes(a))) {
      await handleAceptacion(msg, estado, phoneId); return;
    }
    estado.paso = ESTADOS.CIERRE;
    await reply(msg, randomChoice(CIERRES));
    return;
  }

  await reply(msg, randomChoice(NO_ENTIENDO) + `\n\nEscribe *menu* para ver las opciones 😊`);
}

// ============================================================
// FLUJO DE COMPRA
// ============================================================

async function iniciarFlujoCompra(msg, estado, phoneId, app) {
  log(`🛒 Compra iniciada: ${app.nombre} [${maskPhone(phoneId)}]`);
  estado.paso = ESTADOS.BANCO;
  await reply(msg, buildBancoSeleccion(app.nombre));
}

async function handleBanco(msg, estado, phoneId, text) {
  const num = parseInt(text.trim());
  let banco = null;
  let isNacional = false;

  if (!isNaN(num)) {
    if (num >= 1 && num <= BANCOS_NAC.length) { banco = BANCOS_NAC[num - 1]; isNacional = true; }
    else { const idx = num - BANCOS_NAC.length - 1; if (idx >= 0 && idx < BANCOS_INT.length) { banco = BANCOS_INT[idx]; isNacional = false; } }
  }

  if (!banco) {
    const t = normalize(text);
    for (const b of [...BANCOS_NAC.map(x => ({ ...x, _nac: true })), ...BANCOS_INT.map(x => ({ ...x, _nac: false }))]) {
      if (t.includes(normalize(b.n))) { banco = b; isNacional = b._nac; break; }
    }
  }

  if (banco) {
    estado.bancoSeleccionado = { banco, nacional: isNacional };
    estado.paso = ESTADOS.DATOS_CLIENTE;
    log(`🏦 Banco: ${banco.n} [${maskPhone(phoneId)}]`);
    await reply(msg, buildBancoData(banco, isNacional, estado.appRecomendada ? estado.appRecomendada.nombre : 'App'));
  } else {
    await reply(msg, `No encontré ese banco 🤔 Escribe el *número* del banco de la lista.\n\nO escribe *menu* para volver`);
  }
}

async function handleDatosCliente(msg, estado, phoneId, text) {
  if (msg.hasMedia) { await recibirComprobante(msg, estado, phoneId, '(imagen)'); return; }
  if (text.trim().length >= 20) { await recibirComprobante(msg, estado, phoneId, text); return; }
  await reply(msg, `¡Ya casi! Envía:\n\n1️⃣ *Tus datos:* Nombre, Cédula, Teléfono, Dirección\n2️⃣ *Comprobante* de pago (captura)\n\nPueden ir juntos o separados 💪`);
}

async function handleComprobante(msg, estado, phoneId, text) {
  if (msg.hasMedia) { await finalizarVenta(msg, estado, phoneId, '(imagen comprobante)'); return; }
  if (text.trim().length >= 20) { await finalizarVenta(msg, estado, phoneId, text); return; }
  await reply(msg, `¡Casi listo! Solo falta el *comprobante de pago* 📸\n\nEnvía una captura de la transferencia y te activamos de inmediato ⚡`);
}

async function recibirComprobante(msg, estado, phoneId, datos) {
  const appName = estado.appRecomendada ? estado.appRecomendada.nombre : 'App';
  const banco = estado.bancoSeleccionado ? estado.bancoSeleccionado.banco.n : 'N/A';
  saveSale('ventas-bodega.txt', `${maskPhone(phoneId)} | ${appName} | ${banco} | Negocio: ${estado.negocioDetectado || 'N/A'}`);
  log(`✅ Comprobante: ${appName} [${maskPhone(phoneId)}]`);
  estado.paso = ESTADOS.POST_VENTA;
  await reply(msg, `✅ *¡Recibido!*\n\n📦 App: *${appName}*\n🏦 Banco: ${banco}\n💰 $25 USD\n\nEstamos procesando tu licencia. ¡En breve te la enviamos! ⚡\n\n¡Gracias por confiar en A2K Digital Studio! 💎`);
}

async function finalizarVenta(msg, estado, phoneId, datos) {
  const appName = estado.appRecomendada ? estado.appRecomendada.nombre : 'App';
  const banco = estado.bancoSeleccionado ? estado.bancoSeleccionado.banco.n : 'N/A';
  saveSale('ventas-bodega.txt', `VENTA | ${maskPhone(phoneId)} | ${appName} | ${banco} | ${datos.substring(0, 100)}`);
  log(`🎉 VENTA: ${appName} [${maskPhone(phoneId)}]`);
  estado.paso = ESTADOS.POST_VENTA;
  await reply(msg, `🎉 *¡GRACIAS por tu compra!*\n\n📦 *${appName}*\n🏦 ${banco} | 💰 $25 USD\n\n━━━━━━━━━━━━━━━━━━━━━━━\n\nActivando tu licencia ahora ⚡\n\n✅ Soporte incluido\n✅ Actualizaciones gratis\n\n¡Bienvenido/a a la familia A2K! 💎💪`);
}

// ============================================================
// HANDLERS DE ESTADOS ESPECIALES
// ============================================================

async function handleDetalleApp(msg, estado, phoneId, text, intencion) {
  if (intencion === 'aceptacion' || intencion === 'compra_intencion') {
    if (estado.appRecomendada) { await iniciarFlujoCompra(msg, estado, phoneId, estado.appRecomendada); return; }
  }
  if (intencion === 'demo' && estado.appRecomendada) {
    const app = estado.appRecomendada;
    await reply(msg, app.demo ? `🎮 *Demo de ${app.nombre}*\n\nPrueba gratis aquí:\n${app.demo}\n\nSi te gusta, escribe *SI* para comprar 💪` : `La demo de *${app.nombre}* estará disponible pronto. ¿Te aviso cuando esté lista? 😊`);
    return;
  }
  if (typeof intencion === 'object' && intencion.tipo === 'objecion') { await handleObjecion(msg, estado, phoneId, intencion.tipoObjecion); return; }
  if (typeof intencion === 'object' && (intencion.tipo === 'app_mencionada' || intencion.tipo === 'negocio_detectado')) {
    await handleNegocioDetectado(msg, estado, phoneId, intencion.app, intencion.tipoNegocio || 'mencionado'); return;
  }
  if (intencion === 'catalogo') { await reply(msg, buildCatalogo()); return; }
  if (/^\d+$/.test(text.trim())) {
    const app = findAppByNumber(text.trim());
    if (app) { estado.appRecomendada = app; await reply(msg, buildDetalleApp(app)); return; }
  }
  const appName = estado.appRecomendada ? estado.appRecomendada.nombre : 'la app';
  await reply(msg, `✅ *SI* → Comprar *${appName}* | 🎮 *demo* → Probar | 📱 *catálogo* → Ver todo | 💬 Cuéntame tu duda 😊`);
}

async function handleDetalleZync(msg, estado, phoneId, text, intencion) {
  if (intencion === 'aceptacion' || intencion === 'compra_intencion') {
    if (estado.productoZync) {
      const p = estado.productoZync;
      saveSale('ventas.txt', `ZYNC | ${maskPhone(phoneId)} | ${p.nombre} | $${p.precio} USD`);
      log(`🛒 ZYNC: ${p.nombre} [${maskPhone(phoneId)}]`);
      estado.paso = ESTADOS.BANCO;
      await reply(msg, buildBancoSeleccion(p.nombre));
      return;
    }
  }
  estado.paso = ESTADOS.NUEVO;
  await procesarMensaje(msg);
}

async function handleNumero(msg, estado, phoneId, numStr) {
  const num = parseInt(numStr);
  if (estado.paso === ESTADOS.BANCO) { await handleBanco(msg, estado, phoneId, numStr); return; }
  if (estado.paso === ESTADOS.MENU_ZYNC) {
    const producto = ZYNC_PRODUCTS.find(p => p.id === num);
    if (producto) { estado.productoZync = producto; estado.paso = ESTADOS.DETALLE_ZYNC; await reply(msg, buildDetalleZync(producto)); return; }
  }
  if ([ESTADOS.MENU_CATALOGO, ESTADOS.DETALLE_APP, ESTADOS.NUEVO, ESTADOS.DESCUBRIMIENTO].includes(estado.paso)) {
    const app = findAppByNumber(numStr);
    if (app) { estado.appRecomendada = app; estado.paso = ESTADOS.DETALLE_APP; await reply(msg, buildDetalleApp(app)); return; }

    const menuMsg = handleMenuNumber(num);
    if (menuMsg) { await reply(msg, menuMsg); return; }
  }
  await reply(msg, `Escribe *menu* para ver las opciones disponibles 😊`);
}

function buildDemoGeneral() {
  let msg = `🎮 *DEMOS GRATUITAS*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  A2K_APPS.filter(app => app.demo).forEach(app => {
    msg += `${app.icono} *${app.nombre}*\n👉 ${app.demo}\n\n`;
  });
  msg += `100% gratis, sin registro, sin compromiso 🌟\n\nSi te gusta alguna, escríbeme para la licencia completa 💪`;
  return msg;
}

function buildDetalleZync(producto) {
  return `${producto.nombre}\n━━━━━━━━━━━━━━━━━━━━━━━\n\n💰 *$${producto.precio} USD*\n📝 ${producto.desc}\n\n📦 Entrega inmediata Venezuela\n\n✅ *SI* → Comprar | 💳 *pagos* → Ver métodos`;
}

function handleMenuNumber(num) {
  switch (num) {
    case 1: return buildCatalogo();
    case 2: { let m = `¿Cuál app?\n\n`; A2K_APPS.forEach((a, i) => { m += `${i + 1}. ${a.icono} ${a.nombre}\n`; }); return m; }
    case 3: return buildDemoGeneral();
    case 4: return `🎧 *Headphones K9* — $15 USD\n${ZYNC_PRODUCTS[0].desc}\n\n💳 Escribe *pagos* para pagar`;
    case 5: return `⌚ *Smartwatch* — $25 USD\n${ZYNC_PRODUCTS[1].desc}\n\n💳 Escribe *pagos* para pagar`;
    case 6: return `🎤 *Micrófono K9 Pro* — $15 USD\n${ZYNC_PRODUCTS[2].desc}\n\n💳 Escribe *pagos* para pagar`;
    case 7: return buildAmazonES();
    case 8: return buildAmazonUSA();
    case 9: return buildAliExpress();
    case 10: return buildPagos();
    case 11: return buildBodegaEspecial();
    case 12: return buildContacto();
    default: return null;
  }
}

// ============================================================
// CLIENTE WHATSAPP
// ============================================================

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, 'files', '.wwebjs_auth')
  }),
  puppeteer: {
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-sync',
      '--no-first-run',
      '--window-size=1280,720'
    ]
  }
});

client.on('qr', (qr) => {
  console.log('═══════════════════════════════════════════════');
  console.log('   📱 ESCANEA ESTE QR CON WHATSAPP');
  console.log('═══════════════════════════════════════════════');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('═══════════════════════════════════════════════');
  console.log('   ✅ ZYNC + A2K BOT v3.0 ACTIVO');
  console.log('   🤖 Vendedor Digital Experto');
  console.log('   📦 9 Apps + ZYNC + Amazon + AliExpress');
  console.log('   💳 19 Métodos de Pago');
  console.log('═══════════════════════════════════════════════');
});

client.on('message', async (msg) => {
  try {
    if (msg.fromMe) return;
    await procesarMensaje(msg);
  } catch (err) {
    log(`❌ Error: ${err.message}`);
    try { await msg.reply('Oops, tuve un problemita técnico 😅 ¿Repites tu mensaje? 🙏'); } catch (e) {}
  }
});

client.on('disconnected', (reason) => {
  console.log('⚠️ Desconectado:', reason);
  console.log('🔄 Reconectando...');
});

// ============================================================
// INICIAR
// ============================================================

console.log('═══════════════════════════════════════════════');
console.log('   🚀 ZYNC Electronics + A2K Digital Studio');
console.log('   🤖 WhatsApp Bot v3.0');
console.log('   📦 Conectando...');
console.log('═══════════════════════════════════════════════');

client.initialize().catch(err => {
  console.error('❌ Error al inicializar:', err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => { log(`❌ Exception: ${err.message}`); });
process.on('unhandledRejection', (reason) => { log(`❌ Rejection: ${reason}`); });
