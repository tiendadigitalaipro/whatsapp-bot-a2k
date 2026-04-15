// ????????????????????????????????????????????????????
// ?   ZYNC BOT ? handlers.js                        ?
// ?   L?gica de respuestas y flujo de mensajes       ?
// ????????????????????????????????????????????????????

const { ZYNC, AMAZON_ES, AMAZON_USA, ALIEXPRESS, BANCOS_NAC, BANCOS_INT, estados } = require('./config');

function registrarHandlers(client) {
// ==================== MENSAJES ====================

  client.on('message', async msg => {
  // ==================== FILTRO GRUPOS ====================
  // Ignorar TODOS los mensajes de grupos (@g.us). Solo responder chats privados (@c.us)
  if (msg.from.endsWith('@g.us')) return;
  // =======================================================

  const num = msg.from;
  const txt = msg.body.toLowerCase().trim();

  if (!estados[num]) estados[num] = { paso: 'inicio' };
  const est = estados[num];

  try {
    // ==================== MENÚ PRINCIPAL ====================
    if (txt === 'menu' || txt === 'inicio' ||
        txt.includes('hola') ||
        txt.includes('buenos dias') ||
        txt.includes('buenos días') ||
        txt.includes('buenas tardes') ||
        txt.includes('buenas noches') ||
        txt.includes('buenas') ||
        txt.includes('buen dia') ||
        txt.includes('buen día') ||
        txt.includes('hey') ||
        txt.includes('saludos') ||
        txt.includes('hi')) {
      await msg.reply(
        `🚀 *¡Bienvenido a ZYNC Electronics!*\n\n` +
        `Somos tu tienda de confianza en tecnología de calidad para los Valles del Tuy. ` +
        `También te conectamos con los mejores productos de Amazon y AliExpress.\n\n` +
        `📦 *NUESTROS SERVICIOS:*\n\n` +
        `*1.* 🎧 ZYNC Local - Entrega inmediata\n` +
        `*2.* 🇪🇸 Amazon España\n` +
        `*3.* 🇺🇸 Amazon USA\n` +
        `*4.* 🇨🇳 AliExpress\n` +
        `*5.* 💳 Métodos de Pago (19 opciones)\n` +
        `*6.* 👤 Hablar con Ingeniero Abigail\n` +
        `*7.* 🔥⭐ BODEGA PRO v2.0 ⭐🔥 - Sistema POS PREMIUM\n\n` +
        `Responde con el *número* 👇`
      );
      est.paso = 'menu';
      return;
    }

    // ==================== OPCIONES MENÚ ====================
    if (est.paso === 'menu') {
      
      // OPCIÓN 1: ZYNC LOCAL
      if (txt === '1') {
        let m = `🎧 *CATÁLOGO ZYNC ELECTRONICS*\n`;
        m += `_Tecnología de calidad para los Valles del Tuy_\n\n`;
        ZYNC.forEach((p, i) => {
          m += `*${i + 1}.* ${p.nombre}\n💰 $${p.precio} USD\n${p.desc}\n\n`;
        });
        m += `🚚 Envío GRATIS en Ocumare del Tuy\n`;
        m += `📦 Entrega 24-48 horas\n`;
        m += `✅ Garantía de calidad\n\n`;
        m += `¿Cuál te interesa? Responde el *número* 👇`;
        await msg.reply(m);
        est.paso = 'zync';
        return;
      }

      // OPCIÓN 2: AMAZON ESPAÑA
      if (txt === '2') {
        await msg.reply(
          `🇪🇸 *AMAZON ESPAÑA*\n\n` +
          `*Categorías disponibles:*\n\n` +
          `*1.* 📱 Tecnología\n` +
          `*2.* 💄 Belleza\n` +
          `*3.* 🏠 Hogar\n` +
          `*4.* 💪 Fitness\n` +
          `*5.* 🔙 Volver\n\n` +
          `Responde el *número*`
        );
        est.paso = 'amazon_es';
        return;
      }

      // OPCIÓN 3: AMAZON USA
      if (txt === '3') {
        await msg.reply(
          `🇺🇸 *AMAZON USA*\n\n` +
          `*Categorías:*\n\n` +
          `*1.* 📱 Tecnología\n` +
          `*2.* 🏠 Hogar\n` +
          `*3.* 💪 Fitness\n` +
          `*4.* 🍽️ Cocina\n` +
          `*5.* 💄 Belleza\n` +
          `*6.* 🔙 Volver\n\n` +
          `Responde el *número*`
        );
        est.paso = 'amazon_usa';
        return;
      }

      // OPCIÓN 4: ALIEXPRESS
      if (txt === '4') {
        let m = `🇨🇳 *ALIEXPRESS*\n\n`;
        ALIEXPRESS.forEach((p, i) => {
          m += `*${i + 1}.* ${p.nombre}\n${p.link}\n\n`;
        });
        m += `✅ Envío directo a Venezuela`;
        await msg.reply(m);
        return;
      }

      // OPCIÓN 5: MÉTODOS DE PAGO
      if (txt === '5') {
        let m = `💳 *MÉTODOS DE PAGO*\n\n`;
        m += `*🏦 NACIONALES (Bs):*\n\n`;
        BANCOS_NAC.forEach((b, i) => m += `${i + 1}. ${b.n}\n`);
        m += `\n*💵 INTERNACIONALES (USD):*\n\n`;
        BANCOS_INT.forEach((b, i) => m += `${BANCOS_NAC.length + i + 1}. ${b.n}\n`);
        m += `\n¿Cuál prefieres? *Número* 👇`;
        await msg.reply(m);
        est.paso = 'banco';
        return;
      }

      // OPCIÓN 6: INGENIERO
      if (txt === '6') {
        await msg.reply(
          `👤 *Ingeniero Abigail notificado*\n\n` +
          `Te atenderá personalmente en minutos.\n\n` +
          `Escribe *menu* para volver 🚀`
        );
        console.log(`📞 CONTACTO DIRECTO: ${num}`);
        return;
      }

      // OPCIÓN 7: BODEGA PRO
      if (txt === '7') {
        await msg.reply(
          `🛒 *BODEGA PRO v2.0*\n` +
          `_by A2K DIGITAL STUDIO_\n\n` +
          `*El Sistema POS que tu Negocio Necesitaba* 💎\n\n` +
          `⚡ *CARACTERÍSTICAS:*\n\n` +
          `🏪 Punto de Venta completo\n` +
          `💳 Todos los pagos de Venezuela\n` +
          `📦 Inventario inteligente\n` +
          `📊 Fórmula 50/30/20\n` +
          `👥 Gestión de fiados\n` +
          `💰 Control de caja\n` +
          `📈 Reportes profesionales\n` +
          `↩️ Devoluciones\n` +
          `📷 Escáner QR/Barras\n` +
          `🔐 Anti-reventa\n` +
          `🌙 Modo oscuro\n\n` +
          `💰 *$25 USD - Un solo pago*\n` +
          `✅ Plan PREMIUM\n` +
          `✅ Sin mensualidades\n\n` +
          `*1.* Ver info completa\n` +
          `*2.* Solicitar demo en vivo\n` +
          `*3.* Comprar ahora\n\n` +
          `Responde el *número* 👇`
        );
        est.paso = 'bodega_menu';
        return;
      }
    }

    // ==================== BODEGA PRO ====================
    if (est.paso === 'bodega_menu') {
      if (txt === '1') {
        await msg.reply(
          `💎 *BODEGA PRO v2.0 - INFO COMPLETA*\n\n` +
          `🎯 *Para quién es:*\n` +
          `Bodegas, Abastos, Tecnología, Farmacias, Ferreterías, Repuestos\n\n` +
          `💰 *Precio: $25 USD*\n` +
          `✅ Un solo pago\n` +
          `✅ Plan PREMIUM\n` +
          `✅ Actualizaciones gratis\n` +
          `✅ Soporte incluido\n\n` +
          `📱 *Entrega:*\n` +
          `Directa por WhatsApp\n` +
          `Instalación guiada\n\n` +
          `🎥 *Demo disponible:*\n` +
          `Video llamada en vivo\n\n` +
          `🚀 *Sin internet. Sin mensualidades.*\n\n` +
          `*1.* Solicitar demo\n` +
          `*2.* Comprar ahora\n` +
          `*3.* Volver\n\n` +
          `Responde el *número* 👇`
        );
        est.paso = 'bodega_info';
        return;
      }
      if (txt === '2') {
        await msg.reply(`🆓 *DEMO GRATIS — BODEGA PRO*\n\n✅ Prueba 7 días sin compromiso\n✅ Acceso completo al sistema\n\n👇 Solicita aquí:\nhttps://tiendadigitalaipro.github.io/bodega-demo/formulario-demo-bodega.html\n\n🖤 *A2K Digital Studio*`);
        console.log(`🎥 DEMO BODEGA PRO SOLICITADA: ${num}`);
        est.paso = 'inicio';
        return;
      }
      if (txt === '3') {
        await msg.reply(`📋 *LICENCIA PRO — BODEGA PRO*\n\n✅ Acceso completo al sistema\n✅ Soporte técnico prioritario\n✅ Actualizaciones incluidas\n\n💰 *Planes:*\n• 1 Terminal → $25\n• 5 Terminales → $45\n\n👇 Llena tu solicitud aquí:\nhttps://tiendadigitalaipro.github.io/bodega-demo/formulario-licencia-pro-bodega.html\n\n🖤 *A2K Digital Studio*`);
        est.paso = 'inicio';
        return;
      }
    }

    if (est.paso === 'bodega_info') {
      if (txt === '1') {
        await msg.reply(`🆓 *DEMO GRATIS — BODEGA PRO*\n\n✅ Prueba 7 días sin compromiso\n✅ Acceso completo al sistema\n\n👇 Solicita aquí:\nhttps://tiendadigitalaipro.github.io/bodega-demo/formulario-demo-bodega.html\n\n🖤 *A2K Digital Studio*`);
        console.log(`🎥 DEMO BODEGA: ${num}`);
        est.paso = 'inicio';
        return;
      }
      if (txt === '2') {
        let m = `💎 *COMPRAR BODEGA PRO*\n\n*MÉTODOS DE PAGO:*\n\n*🏦 NACIONALES (Bs):*\n`;
        BANCOS_NAC.forEach((b, i) => m += `${i + 1}. ${b.n}\n`);
        m += `\n*💵 INTERNACIONALES (USD):*\n`;
        BANCOS_INT.forEach((b, i) => m += `${BANCOS_NAC.length + i + 1}. ${b.n}\n`);
        m += `\n¿Cuál usarás? *Número* 👇`;
        await msg.reply(m);
        est.paso = 'bodega_pago';
        return;
      }
      if (txt === '3') {
        est.paso = 'inicio';
        await msg.reply('Escribe *menu* 🏠');
        return;
      }
    }

    if (est.paso === 'bodega_pago') {
      const idx = parseInt(txt) - 1;
      let b = null, esNac = false;
      
      if (idx >= 0 && idx < BANCOS_NAC.length) {
        b = BANCOS_NAC[idx];
        esNac = true;
      } else if (idx < BANCOS_NAC.length + BANCOS_INT.length) {
        b = BANCOS_INT[idx - BANCOS_NAC.length];
      }

      if (b) {
        let m = `✅ *${b.n}*\n\n💳 *DATOS DE PAGO:*\n\n`;
        
        if (esNac) {
          m += `🏦 Banco: ${b.n}\n`;
          m += `💳 Cuenta: ${b.c}\n`;
          m += `👤 Titular: ${b.t}\n`;
          m += `🆔 Cédula: ${b.ci}\n`;
          if (b.cod) m += `📱 Código: ${b.cod}\n`;
          m += `\n💰 *Monto: $25 USD en Bs* (a la tasa del día)\n\n`;
        } else {
          if (b.tipo === 'IBAN') m += `💳 IBAN: ${b.iban}\n🏦 BIC: ${b.bic}\n`;
          else if (b.tipo === 'Checking') m += `💳 Cuenta: ${b.d}\n🏦 ABA: ${b.aba}\n📡 SWIFT: ${b.swift}\n`;
          else if (b.routing) m += `💳 Cuenta: ${b.d}\n🔀 Routing: ${b.routing}\n`;
          else m += `📧 ${b.d}\n`;
          m += `\n💰 *Monto: $25 USD*\n\n`;
        }
        
        m += `📸 Envía tu comprobante de pago`;
        await msg.reply(m);
        est.paso = 'comprobante_bodega';
        return;
      }
    }

    if (msg.hasMedia && est.paso === 'comprobante_bodega') {
      await msg.reply(
        `📸 *¡Comprobante recibido!*\n\n` +
        `Validando pago...\n\n` +
        `Recibirás:\n` +
        `✅ Licencia PREMIUM\n` +
        `✅ Archivo de instalación\n` +
        `✅ Guía completa\n` +
        `✅ Soporte\n\n` +
        `¡Gracias por tu compra! 🎉`
      );
      fs.appendFileSync('ventas-bodega.txt', `${new Date().toLocaleString()} | ${num}\n`);
      console.log(`💰 VENTA BODEGA PRO: ${num}`);
      est.paso = 'inicio';
      return;
    }

    // ==================== PRODUCTOS ZYNC ====================
    if (est.paso === 'zync') {
      const idx = parseInt(txt) - 1;
      if (idx >= 0 && idx < ZYNC.length) {
        const p = ZYNC[idx];
        await msg.reply(
          `✨ *${p.nombre}*\n\n${p.desc}\n\n` +
          `💰 $${p.precio} USD\n\n` +
          `🚚 Envío GRATIS Ocumare\n` +
          `📦 Entrega 24-48h\n\n` +
          `¿Lo apartamos? *SI* para continuar 🛒`
        );
        est.producto = p;
        est.paso = 'confirmar';
        return;
      }
    }

    if (est.paso === 'confirmar' && txt === 'si') {
      let m = `🎉 *Excelente!*\n\n${est.producto.nombre} - $${est.producto.precio}\n\n`;
      m += `*PAGO:*\n\n*Nacionales:*\n`;
      BANCOS_NAC.forEach((b, i) => m += `${i + 1}. ${b.n}\n`);
      m += `\n*Internacionales:*\n`;
      BANCOS_INT.forEach((b, i) => m += `${BANCOS_NAC.length + i + 1}. ${b.n}\n`);
      m += `\n*Número* 👇`;
      await msg.reply(m);
      est.paso = 'banco';
      return;
    }

    // ==================== AMAZON ESPAÑA ====================
    if (est.paso === 'amazon_es') {
      const cats = { '1': 'tech', '2': 'belleza', '3': 'hogar', '4': 'fitness' };
      if (txt === '5') {
        est.paso = 'inicio';
        await msg.reply('Escribe *menu* 🏠');
        return;
      }
      if (cats[txt]) {
        const prods = AMAZON_ES.filter(p => p.cat === cats[txt]);
        let m = `🇪🇸 *PRODUCTOS:*\n\n`;
        prods.forEach(p => m += `${p.nombre}\n${p.link}\n\n`);
        await msg.reply(m);
        return;
      }
    }

    // ==================== AMAZON USA ====================
    if (est.paso === 'amazon_usa') {
      const cats = { '1': 'tech', '2': 'hogar', '3': 'fitness', '4': 'cocina', '5': 'belleza' };
      if (txt === '6') {
        est.paso = 'inicio';
        await msg.reply('Escribe *menu* 🏠');
        return;
      }
      if (cats[txt]) {
        const prods = AMAZON_USA.filter(p => p.cat === cats[txt]);
        let m = `🇺🇸 *PRODUCTOS:*\n\n`;
        prods.forEach(p => m += `${p.nombre}\n${p.link}\n\n`);
        await msg.reply(m);
        return;
      }
    }

    // ==================== BANCOS ====================
    if (est.paso === 'banco') {
      const idx = parseInt(txt) - 1;
      let b = null, esNac = false;
      
      if (idx >= 0 && idx < BANCOS_NAC.length) {
        b = BANCOS_NAC[idx];
        esNac = true;
      } else if (idx < BANCOS_NAC.length + BANCOS_INT.length) {
        b = BANCOS_INT[idx - BANCOS_NAC.length];
      }

      if (b) {
        let m = `✅ *${b.n}*\n\n💳 *DATOS:*\n\n`;
        if (esNac) {
          m += `🏦 ${b.n}\n💳 ${b.c}\n👤 ${b.t}\n🆔 ${b.ci}\n📱 ${b.cod}\n\n`;
        } else {
          if (b.tipo === 'IBAN') m += `💳 ${b.iban}\n🏦 ${b.bic}\n\n`;
          else if (b.tipo === 'Checking') m += `💳 ${b.d}\n🏦 ${b.aba}\n📡 ${b.swift}\n\n`;
          else if (b.routing) m += `💳 ${b.d}\n🔀 ${b.routing}\n\n`;
          else m += `📧 ${b.d}\n\n`;
        }
        m += `📝 *Envía tus datos:*\nNombre, Cédula, Teléfono, Dirección`;
        await msg.reply(m);
        est.paso = 'datos';
        return;
      }
    }

    // ==================== DATOS ====================
    if (est.paso === 'datos' && msg.body.length > 30) {
      fs.appendFileSync('ventas.txt', `${new Date().toLocaleString()} | ${num} | ${msg.body}\n`);
      await msg.reply(
        `✅ *Datos registrados*\n\n` +
        `📸 Realiza el pago y envía comprobante.\n\n` +
        `Gracias por confiar en ZYNC 🚀`
      );
      est.paso = 'comprobante';
      return;
    }

    // ==================== COMPROBANTE ====================
    if (msg.hasMedia && est.paso === 'comprobante') {
      await msg.reply(
        `📸 *Comprobante recibido*\n\n` +
        `Validando pago...\n\n` +
        `Tu pedido será procesado de inmediato. ¡Gracias! 🎉`
      );
      console.log(`💰 VENTA ZYNC: ${num}`);
      est.paso = 'inicio';
      return;
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
});

}

module.exports = { registrarHandlers };
