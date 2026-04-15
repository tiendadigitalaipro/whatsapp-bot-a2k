#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A2K Digital Studio - Telegram Bot v5.0 - Marketing Expert"""

import telebot
from telebot import types
import time, random, logging, urllib.parse
from datetime import datetime

BOT_TOKEN = '8351227479:AAG66TOA8LosFHwmKwPsC3wZA0Tn8v_HhB0'
bot = telebot.TeleBot(BOT_TOKEN)
logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

STORE_URL = 'https://tiendadigitalaipro.github.io/a2k-digital-studio/'
WHATSAPP = '584164117331'
BODEGA_DEMO = 'https://tiendadigitalaipro.github.io/bodega-demo/formulario-demo-bodega.html'
BODEGA_LIC = 'https://tiendadigitalaipro.github.io/bodega-demo/formulario-licencia-pro-bodega.html'

user_states = {}
user_counts = {}

def get_state(uid):
    return user_states.get(uid, {'flow':'nuevo','app':None,'negocio':None,'pitch':{}})

def set_state(uid, flow, app=None):
    s = get_state(uid)
    s['flow'] = flow
    if app: s['app'] = app
    user_states[uid] = s

def track(uid):
    user_counts[uid] = user_counts.get(uid, 0) + 1
    return user_counts[uid]

def returning(uid): return user_counts.get(uid, 0) > 1

def pitch_count(uid, aid):
    return get_state(uid).get('pitch', {}).get(aid, 0)

def mark_pitch(uid, aid):
    s = get_state(uid)
    s.setdefault('pitch', {})[aid] = s['pitch'].get(aid, 0) + 1
    user_states[uid] = s

def log_lead(username, uid, app, msg, fase='descubrimiento'):
    try:
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open('ventas_telegram.txt', 'a', encoding='utf-8') as f:
            f.write(f"[{ts}] @{username} | {uid} | {app} | {fase} | {msg}\n")
    except: pass

APPS = [
    {'id':'barberia','nombre':'Barbería Pro','icono':'💈','precio':25,'desc':'Sistema POS para barberías. Turnos, clientes, caja, reportes y facturas.','car':['📅 Turnos','💇 Servicios','👥 Clientes','💰 Caja','📊 Reportes','🧾 Facturas'],'demo':'https://tiendadigitalaipro.github.io/barberia-pro/','kw':['barberia','barbero','corte','peluqueria']},
    {'id':'nail','nombre':'Nail Studio Pro','icono':'💅','precio':25,'desc':'Sistema para nail studios. Agenda, servicios, materiales, caja dual $/Bs.','car':['📅 Agenda','👩 Clientas','💅 Servicios','📦 Materiales','💵 Caja $/Bs','📊 Reportes'],'demo':'https://tiendadigitalaipro.github.io/nail-studio-pro/','kw':['nail','uñas','manicura','pedicura','belleza','estetica']},
    {'id':'repuestos','nombre':'Repuestos de Motos Pro','icono':'🏍️','precio':25,'desc':'Sistema para tiendas de repuestos. Catálogo, inventario, ventas y reportes.','car':['🔍 Catálogo','📦 Inventario','🛒 Ventas','📊 Reportes','🏷️ Precios','👥 Clientes'],'demo':'https://tiendadigitalaipro.github.io/Repuestos-de-motos-pro-/','kw':['repuestos','motos','motocicleta','taller','mecanica']},
    {'id':'ferreteria','nombre':'Ferretería A2K Pro','icono':'🔧','precio':25,'desc':'Sistema para ferreterías. Inventario, ventas, facturación y proveedores.','car':['📦 Inventario','🛒 POS','🧾 Facturas','🚚 Proveedores','📊 Reportes','👥 Clientes'],'demo':'https://tiendadigitalaipro.github.io/ferreteriaa2kDiitalStudioPro/','kw':['ferreteria','herramientas','construccion','tornillos']},
    {'id':'bodega','nombre':'Bodega Descarga Pro','icono':'📦','precio':25,'desc':'Sistema para bodegas. ¡Funciona SIN internet! Inventario, ventas, fiados y escáner QR.','car':['📦 Inventario','🛒 POS','🧾 Facturas','📴 OFFLINE','💳 Todos los pagos VE','👥 Fiados','📷 Escáner QR'],'demo':'https://tiendadigitalaipro.github.io/bodega-pro-descarga.html/','kw':['bodega','abasto','descarga','almacen','mayorista']},
    {'id':'mercado','nombre':'MERCADO LOGIC PRO','icono':'🛒','precio':25,'desc':'Sistema POS industrial. IRON LOCK v2, multi-almacén, multi-usuario, analíticas.','car':['🔒 IRON LOCK v2','🛒 POS industrial','📦 Multi-almacén','👥 Multi-usuario','📊 Analíticas'],'demo':'https://tiendadigitalaipro.github.io/mercado-logic-pro/','kw':['mercado','supermercado','industrial','logic']},
    {'id':'farmacia','nombre':'Farmacia Pro Plus','icono':'💊','precio':25,'desc':'Sistema para farmacias. Control por lote, alertas de vencimiento y POS.','car':['💊 Control lotes','📅 Alertas vencimiento','🛒 POS','👥 Historial','📊 Reportes'],'demo':None,'kw':['farmacia','medicamentos','drogueria','salud']},
    {'id':'fruteria','nombre':'Frutería Pro','icono':'🍎','precio':25,'desc':'Sistema POS con 74 productos pre-cargados. Inventario, ventas y control total.','car':['🍎 74 productos pre-cargados','📦 Inventario','🛒 Ventas','📊 Reportes','🏷️ Precios'],'demo':None,'kw':['fruteria','frutas','verdura','hortaliza']},
    {'id':'cloud','nombre':'Bodega Pro Cloud','icono':'☁️','precio':25,'desc':'Bodega Pro con sincronización en la nube. Multi-dispositivo y respaldo automático.','car':['☁️ Sincronización nube','📱 Multi-dispositivo','🔒 Respaldo auto','👥 Colaboración','📊 Reportes online'],'demo':None,'kw':['cloud','nube','sincronizar','online']},
]

BANCOS_NAC = [
    {'n':'Mercantil','c':'0105-0191-1981-9100-5433','t':'Abigail Jose Rojas','ci':'V-11558392'},
    {'n':'Provincial','c':'0108-0134-6101-0008-0442','t':'Abigail Jose Rojas','ci':'V-11558392'},
    {'n':'Venezuela','c':'0102-0456-9500-0001-9004','t':'Abigail Rojas','ci':'V-11558392'},
    {'n':'Banesco','c':'0134-0059-8105-9304-0991','t':'Abigail Jose Rojas','ci':'V-11558392'},
    {'n':'Tesoro Personal','c':'0163-0209-1020-9500-6416','t':'Abigail Jose Rojas','ci':'V-11558392'},
    {'n':'Tesoro Jurídica','c':'0163-0209-1120-9300-9911','t':'Inversiones 2k 3112 C.A','ci':'J-40632338-1'},
    {'n':'BDT','c':'0175-0525-4000-7219-9833','t':'Abigail Jose Rojas','ci':'V-11558392'},
    {'n':'Exterior','c':'0115-0034-0110-0617-7575','t':'Abigail Jose Rojas','ci':'V-11558392'},
    {'n':'R4','c':'0169-0001-0110-0146-4751','t':'Abigail Jose Rojas','ci':'V-11558392'},
]
BANCOS_INT = [
    {'n':'Zinli','d':'abijose1158@gmail.com'},{'n':'Wally Tech','d':'+584126148666'},
    {'n':'Payoneer','d':'inversiones2k3112@hotmail.com'},{'n':'Binance','d':'abijose1158@hotmail.com'},
    {'n':'Global66','d':'ABIROJ4'},{'n':'Facebank','d':'56110079352','routing':'021502189'},
    {'n':'Pipol Pay','d':'servirefri2k@gmail.com'},{'n':'Citibank','d':'70588270001777164','aba':'031100209','swift':'CITIUS33'},
    {'n':'Mercantil Panamá','d':'639897225'},{'n':'Barking Circles','iban':'LU194080000056238058','bic':'BICIRLULL'},
]

AMAZON_ES = [{'n':'💨 Limpiador PC','l':'https://amzn.to/4cCQkHF'},{'n':'💇 Cepillo Secador','l':'https://amzn.to/4cE3e8b'},{'n':'🌟 Proyector Astronauta','l':'https://amzn.to/3OnMw2Z'},{'n':'💪 Pistola Masajes','l':'https://amzn.to/4b27qOi'}]
AMAZON_USA = [{'n':'📱 Gimbal COMITOK','l':'https://amzn.to/3ZOIX8w'},{'n':'💧 Filtro Brita','l':'https://amzn.to/40kesHG'},{'n':'🏃 Walking Pad','l':'https://amzn.to/4aLiGNx'},{'n':'🔪 Picador','l':'https://amzn.to/40kFa2T'}]
ALIEXPRESS = [{'n':'📽️ Proyector 4K','l':'https://s.click.aliexpress.com/e/_c3IG0O6R'},{'n':'🎧 Lenovo GM2','l':'https://s.click.aliexpress.com/e/_c3VeH5PH'},{'n':'🎮 Game Stick','l':'https://s.click.aliexpress.com/e/_c4461eEX'},{'n':'🎮 Consola M8','l':'https://s.click.aliexpress.com/e/_c3QeEMWn'}]

PITCHES = {
    'barberia': ['¡Perfecto! 💈 *Barbería Pro* es exactamente lo que necesitas:\n\n✅ Turnos organizados\n✅ Historial de clientes\n✅ Caja y reportes diarios\n✅ Facturas profesionales\n✅ Modo oscuro\n\n50+ barberos ya lo usan en Venezuela. *$25 USD* pago único 💪'],
    'nail': ['¡Genial! 💅 *Nail Studio Pro* tiene todo lo que necesitas:\n\n📅 Agenda de clientas\n💅 Catálogo de servicios\n📦 Control de materiales\n💵 Caja dual $/Bs\n📊 Reportes\n\n50+ estudios de belleza ya lo usan. *$25 USD* pago único 💪'],
    'repuestos': ['¡Excelente! 🏍️ *Repuestos de Motos Pro*:\n\n🔍 Catálogo digital completo\n📦 Inventario en tiempo real\n🛒 Ventas rápidas\n📊 Reportes de movimiento\n\n50+ tiendas ya lo usan. *$25 USD* pago único 💪'],
    'ferreteria': ['¡Genial! 🔧 *Ferretería A2K Pro*:\n\n📦 Inventario completo\n🛒 Punto de venta rápido\n🧾 Facturación profesional\n🚚 Control proveedores\n📊 Reportes\n\n50+ ferreterías ya lo usan. *$25 USD* pago único 💪'],
    'bodega': ['¡Ahora sí! 📦 *Bodega Descarga Pro* tiene algo único: *funciona SIN internet* 📴\n\n✅ Funciona OFFLINE\n✅ Todos los métodos de pago VE\n✅ Fiados organizados\n✅ Escáner QR\n✅ Reportes completos\n\n50+ bodegas ya lo usan. *$25 USD* pago único 💪', '¡Una bodega sin sistema es dinero perdido! 📦\n\n*Bodega Descarga Pro*: funciona sin internet, vende en 10 segundos, controla fiados y reportes automáticos.\n\n90% de clientes recuperaron inversión en la primera semana 📈\n*$25 USD* una sola vez.'],
    'mercado': ['¡Para negocios grandes, herramientas grandes! 🛒\n\n*MERCADO LOGIC PRO*:\n\n🔒 IRON LOCK v2\n📦 Multi-almacén\n👥 Multi-usuario\n📊 Analíticas avanzadas\n\nTodo por *$25 USD* pago único 💎'],
    'farmacia': ['¡Las farmacias necesitan control exacto! 💊\n\n*Farmacia Pro Plus*:\n\n💊 Control por lote\n📅 Alertas vencimiento\n🛒 POS rápido\n👥 Historial clientes\n\n*$25 USD* pago único 💪'],
    'fruteria': ['¡Fruterías siempre en movimiento! 🍎\n\n*Frutería Pro* con *74 productos pre-cargados*. Listo para vender desde el día 1:\n\n📦 Inventario\n🛒 Ventas rápidas\n📊 Reportes\n\n*$25 USD* pago único 💪'],
    'cloud': ['¡La nube es el futuro! ☁️\n\n*Bodega Pro Cloud*:\n\n☁️ Accede desde cualquier lugar\n📱 Multi-dispositivo\n🔒 Respaldo automático\n👥 Colaboración en equipo\n\n*$25 USD* pago único 💪'],
}

OBJECIONES = {
    'caro': {'triggers':['caro','mucha plata','no tengo','costoso','no puedo pagar','mucho dinero','no alcanza'],'resp':['Te entiendo 💛 Pero son *$25 USD*, un solo pago. Para siempre.\n\nOtros cobran $30-100 al MES. Nosotros: UNA VEZ.\n\n¿Cuánto pierdes al mes sin sistema? Seguro más de $25 💰\n\n¿Pruebas la demo gratis? 🎥','$25 USD = 2 pizzas grandes. Pero la app genera dinero todos los días 📈\n\n50+ negocios recuperaron inversión en la primera semana. *$25 USD* una vez. ¿La ves? 🎥']},
    'dudar': {'triggers':['no se','dudo','estafa','mentira','no creo','sera cierto'],'resp':['¡Entiendo! La desconfianza es inteligente 💡\n\n✅ Empresa: Inversiones 2K 3112 C.A (J-40632338-1)\n✅ 50+ negocios confían en nosotros\n✅ Demo GRATIS antes de pagar\n✅ Soporte directo por WhatsApp\n\n¿Pruebas la demo sin compromiso? 🎥']},
    'pensar': {'triggers':['voy a pensar','lo pienso','después','luego','te aviso','ahora no'],'resp':[f'Claro, sin apuro 💛\n\nCada día sin sistema es un día perdiendo control de tu negocio.\n\n🛒 Tienda: [A2K Digital Studio]({STORE_URL})\n\nCuando estés listo, aquí estoy 😊']},
    'gratis': {'triggers':['gratis','free','no quiero pagar','pirata','crack'],'resp':['¡La DEMO es 100% gratis! 🎥\n\nLa licencia son $25 USD porque hay ingenieros reales detrás 💪\n\nPero primero prueba gratis. ¿Te parece? 😊']},
}

SALUDOS = ['¡Hola! 😊 Soy Abi de *A2K Digital Studio*. ¿Tienes un negocio? ¡Cuéntame y te recomiendo la app perfecta! 💡','¡Buenas! 👋 Soy Abi. ¿Qué tipo de negocio tienes? ¡Tenemos la solución ideal! 🎯','¡Hey! 😄 Aquí Abi de A2K. Si tienes un negocio, dime cuál y te asesoro gratis 💪']
SALUDOS_RETORNO = ['¡Qué gusto verte de vuelta! 😊 ¿En qué te ayudo hoy?','¡Hola de nuevo! 👋 ¿Qué necesitas?']
PREGUNTAS = ['¿Qué tipo de negocio tienes? Así te recomiendo la app perfecta 💪','¿A qué te dedicas? Quiero recomendarte algo que realmente te sirva 🎯','¿Tienes un negocio propio? Dime el rubro y te asesoro gratis 🚀']
GRACIAS = ['¡De nada! 😊 ¿Algo más?','¡Con gusto! 💪 ¿Puedo ayudarte con algo más?']
DESPEDIDAS = [f'¡Hasta luego! 👋 ¡Éxitos!\n\n🛒 [A2K Digital Studio]({STORE_URL})',f'¡Que te vaya súper! ✨\n\n🛒 [A2K Digital Studio]({STORE_URL})']
NO_ENTIENDO = [f'No entendí bien 🤔 ¿Tienes un negocio? Cuéntame el tipo y te asesoro 😊\n\n🛒 [A2K]({STORE_URL})',f'¿Podrías explicarme más? 😅 O escribe /catalogo\n\n🛒 [A2K]({STORE_URL})']
CIERRES = ['¡Excelente decisión! 🎉\n\n1️⃣ Haz clic en "Comprar por WhatsApp"\n2️⃣ El ingeniero te atiende al momento\n3️⃣ Pagas y recibes tu licencia\n\n¡Todo en menos de 30 minutos! ⚡','¡Vamos! 🔥 Tu negocio va a dar un salto gigante.\n\nEscribe al ingeniero, elige método de pago, y en minutos tienes tu sistema 🚀']

def wa_url(nombre, tipo='buy'):
    msg = f'Quiero {"comprar" if tipo=="buy" else "ver la demo de"} {nombre} - A2K Digital Studio'
    return f'https://wa.me/{WHATSAPP}?text={urllib.parse.quote(msg)}'

def typing(cid, t=None):
    try:
        bot.send_chat_action(cid, 'typing')
        time.sleep(t or random.uniform(0.8, 1.8))
    except: pass

def find_app_kw(text):
    tl = text.lower()
    best, score = None, 0
    for app in APPS:
        s = sum(len(k) for k in app['kw'] if k in tl)
        if s > score: score, best = s, app
    return best if score >= 3 else None

def recommend_app(text):
    tl = text.lower()
    bmap = {
        'barbería':{'id':'barberia','kw':['barbería','barberia','barbero','corte de cabello','peluqueria']},
        'nail studio':{'id':'nail','kw':['nail','uñas','manicura','pedicura','estética','estetica','salón de belleza']},
        'repuestos de motos':{'id':'repuestos','kw':['motos','repuestos','taller mecánico','motocicleta']},
        'ferretería':{'id':'ferreteria','kw':['ferretería','ferreteria','herramientas','construcción']},
        'bodega':{'id':'bodega','kw':['bodega','abasto','despensa','almacén','mayorista']},
        'supermercado':{'id':'mercado','kw':['supermercado','mercado','industrial']},
        'farmacia':{'id':'farmacia','kw':['farmacia','droguería','medicamentos']},
        'frutería':{'id':'fruteria','kw':['frutería','fruteria','frutas','verdulería']},
        'nube':{'id':'cloud','kw':['cloud','nube','sincronizar','online']},
    }
    best, tipo, score = None, None, 0
    for t, info in bmap.items():
        for k in info['kw']:
            if k in tl and len(k) > score:
                score, best, tipo = len(k), info['id'], t
    if best:
        app = next((a for a in APPS if a['id'] == best), None)
        return app, tipo
    return None, None

def detect_obj(text):
    tl = text.lower()
    for cat, data in OBJECIONES.items():
        if any(t in tl for t in data['triggers']): return cat
    return None

def is_greeting(t): return any(g in t.lower() for g in ['hola','buenas','hey','buenos dias','saludos','epa','hello','hi']) and len(t) < 40
def is_price(t): return any(k in t.lower() for k in ['precio','cuanto cuesta','cuánto cuesta','costo','cuanto vale'])
def is_buy(t): return any(k in t.lower() for k in ['comprar','quiero comprar','adquirir','lo quiero','me interesa comprar'])
def is_thanks(t): return any(k in t.lower() for k in ['gracias','muchas gracias','thanks']) and len(t) < 40
def is_bye(t): return any(k in t.lower() for k in ['adios','chao','bye','hasta luego','nos vemos']) and len(t) < 40
def is_payment(t): return any(k in t.lower() for k in ['pago','pagar','banco','transferencia','metodo de pago','como pago'])
def is_demo(t): return any(k in t.lower() for k in ['demo','probar','prueba','ver como funciona'])
def is_contact(t): return any(k in t.lower() for k in ['contacto','whatsapp','ingeniero','abigail'])

def app_detail(app):
    cars = "\n".join(f"   {c}" for c in app['car'])
    demo = f"\n🎥 *Demo:* [Ver]({app['demo']})" if app.get('demo') else ""
    bod = f"\n📋 *Demo Bodega:* [Solicitar]({BODEGA_DEMO})\n📄 *Licencia:* [Obtener]({BODEGA_LIC})" if app['id'] in ('bodega','mercado') else ""
    return f"━━━━━━━━━━━━━━━━━━━━━━━\n{app['icono']} *{app['nombre']}*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n{app['desc']}\n\n✨ *Características:*\n{cars}\n━━━━━━━━━━━━━━━━━━━━━━━\n💰 *Precio: ${app['precio']} USD* | ➕ Terminal: +$5\n✅ Pago único | Soporte incluido{demo}{bod}\n\n🛒 *Tienda:* [A2K Digital Studio]({STORE_URL})"

def catalog_msg():
    rows = "".join(f"\n{i}. {a['icono']} *{a['nombre']}*\n   _{a['desc'][:60]}..._\n" for i,a in enumerate(APPS,1))
    return f"🛒 *CATÁLOGO - A2K Digital Studio*\n━━━━━━━━━━━━━━━━━━━━━━━\n{rows}\n━━━━━━━━━━━━━━━━━━━━━━━\n💰 *$25 USD* por app (pago único)\n🛒 *Tienda:* [A2K Digital Studio]({STORE_URL})\n\n👇 Toca cualquier app:"

def payment_msg():
    n = "\n".join(f"   • {b['n']}" for b in BANCOS_NAC)
    i = "\n".join(f"   • {b['n']}" for b in BANCOS_INT)
    return f"💳 *MÉTODOS DE PAGO*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n🏦 *Nacionales (Bs):*\n{n}\n\n💵 *Internacionales (USD):*\n{i}\n\n📲 Datos completos por WhatsApp\n🛒 [A2K Digital Studio]({STORE_URL})"

def payment_full_msg():
    nac = "".join(f"\n🏦 *{b['n']}*\n   Cta: `{b['c']}`\n   Titular: {b['t']}\n   CI: {b['ci']}\n" for b in BANCOS_NAC)
    intl = ""
    for b in BANCOS_INT:
        intl += f"\n💳 *{b['n']}*\n"
        if 'd' in b: intl += f"   Datos: `{b['d']}`\n"
        if 'routing' in b: intl += f"   Routing: `{b['routing']}`\n"
        if 'aba' in b: intl += f"   ABA: `{b['aba']}`\n"
        if 'iban' in b: intl += f"   IBAN: `{b['iban']}`\n"
        if 'bic' in b: intl += f"   BIC: `{b['bic']}`\n"
    return f"💳 *DATOS BANCARIOS COMPLETOS*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n🏦 *NACIONALES (Bs):*{nac}\n━━━━━━━━━━━━━━━━━━━━━━━\n\n💵 *INTERNACIONALES (USD):*{intl}\n\n📱 WhatsApp: +58 416-4117331\n🛒 [A2K Digital Studio]({STORE_URL})"

def contact_msg():
    return f"👤 *CONTACTO*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n👨‍💻 *Ing. Abigail Rojas*\n📲 WhatsApp: +58 416-4117331\n📧 abijose1158@gmail.com\n🏢 Inversiones 2K 3112 C.A (J-40632338-1)\n\n🛒 [A2K Digital Studio]({STORE_URL})\n⏰ Lun-Sáb: 8:00 AM - 6:00 PM"

def main_kb():
    m = types.ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    m.add(types.KeyboardButton('📋 Catálogo A2K'), types.KeyboardButton('🛒 Tienda Online'))
    m.add(types.KeyboardButton('💰 Precios'), types.KeyboardButton('💳 Métodos de Pago'))
    m.add(types.KeyboardButton('🎥 Ver Demo'), types.KeyboardButton('🛒 Otros Productos'))
    m.add(types.KeyboardButton('👤 Contacto'))
    return m

def catalog_kb():
    m = types.InlineKeyboardMarkup(row_width=3)
    for app in APPS: m.add(types.InlineKeyboardButton(f"{app['icono']} {app['nombre']}", callback_data=f"app_{app['id']}"))
    m.add(types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL), types.InlineKeyboardButton('💳 Pagos', callback_data='pagos'))
    m.add(types.InlineKeyboardButton('🔙 Menú', callback_data='menu'))
    return m

def app_kb(app):
    m = types.InlineKeyboardMarkup(row_width=2)
    if app.get('demo'): m.add(types.InlineKeyboardButton('🎥 Ver Demo Online', url=app['demo']))
    if app['id'] in ('bodega','mercado'): m.add(types.InlineKeyboardButton('📋 Demo Bodega', url=BODEGA_DEMO), types.InlineKeyboardButton('📄 Licencia', url=BODEGA_LIC))
    m.add(types.InlineKeyboardButton('💬 Comprar WhatsApp', url=wa_url(app['nombre'])), types.InlineKeyboardButton('🎬 Solicitar Demo', url=wa_url(app['nombre'],'demo')))
    m.add(types.InlineKeyboardButton('🛒 Ver en Tienda', url=STORE_URL))
    m.add(types.InlineKeyboardButton('📋 Catálogo', callback_data='catalog'), types.InlineKeyboardButton('🔙 Menú', callback_data='menu'))
    return m

def buy_kb(app=None):
    m = types.InlineKeyboardMarkup(row_width=2)
    if app: m.add(types.InlineKeyboardButton(f'💬 Comprar {app["nombre"]}', url=wa_url(app['nombre'])))
    else: m.add(types.InlineKeyboardButton('💬 Comprar WhatsApp', url=f'https://wa.me/{WHATSAPP}?text=Quiero%20comprar%20A2K'))
    m.add(types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
    m.add(types.InlineKeyboardButton('📋 Catálogo', callback_data='catalog'))
    return m

@bot.message_handler(commands=['start','menu'])
def cmd_start(msg):
    cid, uid = msg.chat.id, msg.from_user.id
    fn = msg.from_user.first_name or 'amigo'
    set_state(uid, 'descubrimiento')
    track(uid)
    typing(cid, 1.5)
    m = types.InlineKeyboardMarkup(row_width=2)
    m.add(types.InlineKeyboardButton('🛒 Tienda Online', url=STORE_URL), types.InlineKeyboardButton('📋 Catálogo', callback_data='catalog'))
    m.add(types.InlineKeyboardButton('🎥 Demo Gratis', callback_data='demo'), types.InlineKeyboardButton('💳 Pagos', callback_data='pagos'))
    m.add(types.InlineKeyboardButton('💰 Precios', callback_data='precios'), types.InlineKeyboardButton('👤 Contacto', callback_data='contacto'))
    welcome = f"✨ *A2K Digital Studio*\n━ *Soluciones para tu Negocio*\n\n¡Hola {fn}! 👋 Soy *Abi*. Creo sistemas que hacen que tu negocio trabaje solo 😊\n\n📌 *9 apps profesionales* — $25 USD cada una (pago único)\n✅ Sin mensualidades | Soporte incluido | Demo gratis\n\n🛒 *Tienda:* [A2K Digital Studio]({STORE_URL})\n\n¿Qué tipo de negocio tienes? ¡Cuéntame! 💡"
    bot.send_message(cid, welcome, parse_mode='Markdown', reply_markup=m, disable_web_page_preview=True)
    bot.send_message(cid, "📱 Menú rápido:", reply_markup=main_kb())

@bot.message_handler(commands=['catalogo'])
def cmd_cat(msg):
    typing(msg.chat.id)
    bot.send_message(msg.chat.id, catalog_msg(), parse_mode='Markdown', reply_markup=catalog_kb(), disable_web_page_preview=True)

@bot.message_handler(commands=['precios'])
def cmd_precios(msg):
    typing(msg.chat.id)
    m = types.InlineKeyboardMarkup()
    m.add(types.InlineKeyboardButton('📋 Catálogo', callback_data='catalog'), types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
    bot.send_message(msg.chat.id, f"💰 *PRECIOS*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n🏷️ Cada app: *$25 USD* (pago único)\n➕ Terminal: *+$5 USD*\n\n✅ Sin mensualidades | Soporte | Actualizaciones gratis\n\n🛒 [A2K Digital Studio]({STORE_URL})", parse_mode='Markdown', reply_markup=m, disable_web_page_preview=True)

@bot.message_handler(commands=['pagos'])
def cmd_pagos(msg):
    typing(msg.chat.id)
    m = types.InlineKeyboardMarkup()
    m.add(types.InlineKeyboardButton('📋 Datos Completos', callback_data='pagos_full'), types.InlineKeyboardButton('💬 WhatsApp', url=f'https://wa.me/{WHATSAPP}'))
    m.add(types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
    bot.send_message(msg.chat.id, payment_msg(), parse_mode='Markdown', reply_markup=m)

@bot.message_handler(commands=['contacto'])
def cmd_contacto(msg):
    typing(msg.chat.id)
    m = types.InlineKeyboardMarkup()
    m.add(types.InlineKeyboardButton('💬 WhatsApp', url=f'https://wa.me/{WHATSAPP}'), types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
    bot.send_message(msg.chat.id, contact_msg(), parse_mode='Markdown', reply_markup=m, disable_web_page_preview=True)

@bot.message_handler(commands=['bodegapro'])
def cmd_bodega(msg):
    app = next((a for a in APPS if a['id'] == 'bodega'), None)
    if app:
        typing(msg.chat.id, 1.5)
        bot.send_message(msg.chat.id, app_detail(app), parse_mode='Markdown', reply_markup=app_kb(app), disable_web_page_preview=True)

@bot.callback_query_handler(func=lambda c: True)
def cb(call):
    cid, uid, data = call.message.chat.id, call.from_user.id, call.data
    bot.answer_callback_query(call.id)
    if data == 'menu':
        typing(cid, 0.5)
        bot.send_message(cid, f"📂 *Menú Principal*\n\n¿En qué te ayudo? 😊\n\n🛒 [A2K]({STORE_URL})", parse_mode='Markdown', reply_markup=main_kb(), disable_web_page_preview=True)
    elif data == 'catalog':
        typing(cid, 0.5)
        bot.send_message(cid, catalog_msg(), parse_mode='Markdown', reply_markup=catalog_kb(), disable_web_page_preview=True)
    elif data.startswith('app_'):
        app = next((a for a in APPS if a['id'] == data[4:]), None)
        if app:
            typing(cid, 1.0)
            bot.send_message(cid, app_detail(app), parse_mode='Markdown', reply_markup=app_kb(app), disable_web_page_preview=True)
            set_state(uid, 'presentacion', app=app['id'])
    elif data == 'precios':
        typing(cid, 0.5)
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('📋 Catálogo', callback_data='catalog'), types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
        bot.send_message(cid, f"💰 *Precio: $25 USD* por app (pago único)\n➕ Terminal: +$5 USD\n\n✅ Sin mensualidades | Soporte incluido\n\n🛒 [A2K]({STORE_URL})", parse_mode='Markdown', reply_markup=m, disable_web_page_preview=True)
    elif data == 'pagos':
        typing(cid, 0.5)
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('📋 Datos Completos', callback_data='pagos_full'), types.InlineKeyboardButton('💬 WA', url=f'https://wa.me/{WHATSAPP}'))
        m.add(types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
        bot.send_message(cid, payment_msg(), parse_mode='Markdown', reply_markup=m)
    elif data == 'pagos_full':
        typing(cid, 0.5)
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('🔙 Volver', callback_data='pagos'))
        bot.send_message(cid, payment_full_msg(), parse_mode='Markdown', reply_markup=m)
    elif data == 'demo':
        typing(cid, 0.5)
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('🎬 Demo WhatsApp', url=f'https://wa.me/{WHATSAPP}?text=Quiero%20demo%20A2K'))
        m.add(types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
        bot.send_message(cid, "¡Ver antes de comprar es lo más inteligente! 🧪\n\nSolicita tu demo gratis aquí:", reply_markup=m)
    elif data == 'contacto':
        typing(cid, 0.5)
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('💬 WhatsApp', url=f'https://wa.me/{WHATSAPP}'), types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
        bot.send_message(cid, contact_msg(), parse_mode='Markdown', reply_markup=m, disable_web_page_preview=True)

@bot.message_handler(func=lambda m: True, content_types=['text'])
def handle_text(msg):
    cid, uid, text = msg.chat.id, msg.from_user.id, msg.text.strip()
    username = msg.from_user.username or 'unknown'
    state = get_state(uid)
    track(uid)
    typing(cid, random.uniform(0.8, 2.0))

    # Botones del teclado
    if text == '🛒 Tienda Online':
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('🛒 Abrir Tienda', url=STORE_URL))
        bot.send_message(cid, f"🛒 *Tienda:* [A2K Digital Studio]({STORE_URL})", parse_mode='Markdown', reply_markup=m, disable_web_page_preview=True); return
    if text == '📋 Catálogo A2K':
        bot.send_message(cid, catalog_msg(), parse_mode='Markdown', reply_markup=catalog_kb(), disable_web_page_preview=True); return
    if text == '💰 Precios':
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('📋 Catálogo', callback_data='catalog'), types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
        bot.send_message(cid, f"💰 *$25 USD* por app (pago único)\n➕ Terminal: +$5\n\n✅ Sin mensualidades\n\n🛒 [A2K]({STORE_URL})", parse_mode='Markdown', reply_markup=m, disable_web_page_preview=True); return
    if text == '💳 Métodos de Pago':
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('📋 Datos Completos', callback_data='pagos_full'), types.InlineKeyboardButton('💬 WA', url=f'https://wa.me/{WHATSAPP}'))
        bot.send_message(cid, payment_msg(), parse_mode='Markdown', reply_markup=m); return
    if text == '🎥 Ver Demo':
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('🎬 Demo WhatsApp', url=f'https://wa.me/{WHATSAPP}?text=Quiero%20demo%20A2K'))
        m.add(types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
        bot.send_message(cid, "¡Ver antes de comprar es lo más inteligente! 🧪\n\nSolicita tu demo gratis:", reply_markup=m); return
    if text == '👤 Contacto':
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('💬 WA', url=f'https://wa.me/{WHATSAPP}'), types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
        bot.send_message(cid, contact_msg(), parse_mode='Markdown', reply_markup=m, disable_web_page_preview=True); return
    if text == '🛒 Otros Productos':
        otros = f"🛒 *OTROS PRODUCTOS*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n🇪🇸 *Amazon España:*\n"
        for p in AMAZON_ES: otros += f"   {p['n']} — [Ver]({p['l']})\n"
        otros += "\n🇺🇸 *Amazon USA:*\n"
        for p in AMAZON_USA: otros += f"   {p['n']} — [Ver]({p['l']})\n"
        otros += "\n🌍 *AliExpress:*\n"
        for p in ALIEXPRESS: otros += f"   {p['n']} — [Ver]({p['l']})\n"
        otros += f"\n🛒 [A2K Digital Studio]({STORE_URL})"
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('🛒 Tienda A2K', url=STORE_URL))
        m.add(types.InlineKeyboardButton('📋 Catálogo Apps', callback_data='catalog'))
        bot.send_message(cid, otros, parse_mode='Markdown', reply_markup=m, disable_web_page_preview=True); return

    # Intención de compra
    if is_buy(text):
        app_id = state.get('app')
        app = next((a for a in APPS if a['id'] == app_id), None) if app_id else None
        bot.send_message(cid, random.choice(CIERRES), parse_mode='Markdown')
        typing(cid, 0.5)
        bot.send_message(cid, "👇 Elige tu opción:", reply_markup=buy_kb(app)); return

    # Objeciones
    obj = detect_obj(text)
    if obj:
        resp = random.choice(OBJECIONES[obj]['resp'])
        bot.send_message(cid, resp, parse_mode='Markdown')
        typing(cid, 0.5)
        app_id = state.get('app')
        app = next((a for a in APPS if a['id'] == app_id), None) if app_id else None
        m = types.InlineKeyboardMarkup()
        if app: m.add(types.InlineKeyboardButton('🎬 Ver Demo', url=wa_url(app['nombre'],'demo')))
        m.add(types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL), types.InlineKeyboardButton('📋 Catálogo', callback_data='catalog'))
        bot.send_message(cid, "👇 ¿Qué prefieres?", reply_markup=m); return

    if is_bye(text): bot.send_message(cid, random.choice(DESPEDIDAS), parse_mode='Markdown', disable_web_page_preview=True); return
    if is_thanks(text): bot.send_message(cid, random.choice(GRACIAS), parse_mode='Markdown'); return
    if is_payment(text):
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('📋 Datos Completos', callback_data='pagos_full'), types.InlineKeyboardButton('💬 WA', url=f'https://wa.me/{WHATSAPP}'))
        bot.send_message(cid, payment_msg(), parse_mode='Markdown', reply_markup=m); return
    if is_price(text):
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('📋 Catálogo', callback_data='catalog'), types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
        bot.send_message(cid, f"💰 *$25 USD* por app (pago único)\n➕ Terminal: +$5\n\n🛒 [A2K]({STORE_URL})", parse_mode='Markdown', reply_markup=m, disable_web_page_preview=True); return
    if is_demo(text):
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('🎬 Demo WA', url=f'https://wa.me/{WHATSAPP}?text=Quiero%20demo%20A2K'))
        m.add(types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
        bot.send_message(cid, "¡Genial! Solicita tu demo gratis 🎥", reply_markup=m); return
    if is_contact(text):
        m = types.InlineKeyboardMarkup()
        m.add(types.InlineKeyboardButton('💬 WA', url=f'https://wa.me/{WHATSAPP}'), types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
        bot.send_message(cid, contact_msg(), parse_mode='Markdown', reply_markup=m, disable_web_page_preview=True); return

    # Detección de negocio
    app, tipo = recommend_app(text)
    if app:
        log_lead(username, uid, app['nombre'], text, 'descubrimiento')
        set_state(uid, 'presentacion', app=app['id'])
        pitches = PITCHES.get(app['id'], [])
        pc = pitch_count(uid, app['id'])
        pitch = pitches[pc % len(pitches)] if pitches else app_detail(app)
        mark_pitch(uid, app['id'])
        bot.send_message(cid, f"¡Un negocio de *{tipo}*! Tengo justo lo que necesitas 😊\n\n{pitch}", parse_mode='Markdown')
        typing(cid, 1.0)
        bot.send_message(cid, app_detail(app), parse_mode='Markdown', reply_markup=app_kb(app), disable_web_page_preview=True); return

    # App por keyword
    app = find_app_kw(text)
    if app:
        set_state(uid, 'presentacion', app=app['id'])
        bot.send_message(cid, f"¡Creo que buscas *{app['icono']} {app['nombre']}*! 🎯", parse_mode='Markdown')
        typing(cid, 1.0)
        bot.send_message(cid, app_detail(app), parse_mode='Markdown', reply_markup=app_kb(app), disable_web_page_preview=True); return

    # Saludo
    if is_greeting(text):
        greet = random.choice(SALUDOS_RETORNO) if returning(uid) else random.choice(SALUDOS)
        bot.send_message(cid, greet, parse_mode='Markdown')
        typing(cid, 1.5)
        bot.send_message(cid, random.choice(PREGUNTAS) + f"\n\n🛒 [A2K Digital Studio]({STORE_URL})", parse_mode='Markdown', reply_markup=main_kb(), disable_web_page_preview=True)
        set_state(uid, 'descubrimiento'); return

    # Fallback
    bot.send_message(cid, random.choice(NO_ENTIENDO), parse_mode='Markdown', disable_web_page_preview=True)
    m = types.InlineKeyboardMarkup(row_width=2)
    m.add(types.InlineKeyboardButton('📋 Catálogo', callback_data='catalog'), types.InlineKeyboardButton('🛒 Tienda', url=STORE_URL))
    bot.send_message(cid, "👇 ¿Qué te gustaría ver?", reply_markup=m)

@bot.message_handler(func=lambda m: True, content_types=['photo','document','sticker','voice','video'])
def no_text(msg):
    typing(msg.chat.id)
    bot.send_message(msg.chat.id, f"¡Gracias! 😄 Pero soy mejor con texto. ¿Tienes un negocio? Cuéntame 💪\n\n🛒 [A2K]({STORE_URL})", parse_mode='Markdown', disable_web_page_preview=True)

if __name__ == '__main__':
    print("=" * 50)
    print("✅ A2K Digital Studio - Telegram Bot v5.0")
    print("📦 Marketing Expert - En línea")
    print("=" * 50)
    try:
        bot.infinity_polling(timeout=60, long_polling_timeout=60)
    except Exception as e:
        logger.error(f"Error: {e}")
        time.sleep(5)
        bot.infinity_polling(timeout=60, long_polling_timeout=60)
