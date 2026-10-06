'use strict';
// Private bearer capabilities are session-only, never URL query parameters or analytics.
const message = document.getElementById('commerce-message');
const say = value => { if (message) message.textContent = value; };
const key = 'holbery-private-checkout';
function readSession() { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; } }
async function api(path, method = 'GET', data, token, idempotency) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  if (idempotency) headers['Idempotency-Key'] = idempotency;
  const response = await fetch(path, { method, headers, body: data === undefined ? undefined : JSON.stringify(data) });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error?.code || 'REQUEST_FAILED');
  return body;
}
const purchase = document.getElementById('purchase-form');
if (purchase) purchase.addEventListener('submit', async event => {
  event.preventDefault();
  const button = purchase.querySelector('button'); button.disabled = true;
  try {
    const store = purchase.dataset.store;
    const prefix = '/api/commerce/stores/' + encodeURIComponent(store);
    let session = readSession();
    if (!session || session.store !== store || session.orderId) {
      const cart = await api(prefix + '/carts', 'POST');
      session = { store, cartId: cart.cartId, token: cart.accessToken, idempotency: crypto.randomUUID() };
      sessionStorage.setItem(key, JSON.stringify(session));
    }
    const form = new FormData(purchase);
    await api(prefix + '/carts/' + session.cartId + '/items', 'PUT', { offerId: form.get('offerId'), quantity: Number(form.get('quantity')) }, session.token);
    if (!document.getElementById('customer-checkout')) {
      const checkout = document.createElement('form'); checkout.id = 'customer-checkout';
      checkout.innerHTML = '<h2>Checkout</h2><p id="cart-summary"></p><label>Nama<input name="name" autocomplete="name" maxlength="100" required></label><label>Email<input name="email" type="email" autocomplete="email" maxlength="255" required></label><label><input name="consent" type="checkbox" required> Saya menyetujui <a href="/terms/commerce">ketentuan produk</a>, <a href="/refund/commerce">kebijakan review/refund</a>, dan <a href="/privacy">pemrosesan data</a>.</label><p>Download privat di halaman order setelah pembayaran terverifikasi. <a href="/support/commerce">Bantuan</a>.</p><button class="button">Buat order</button>';
      purchase.after(checkout);
      checkout.addEventListener('submit', async e => {
        e.preventDefault(); const submit = checkout.querySelector('button'); submit.disabled = true;
        try {
          const current = readSession(), data = new FormData(checkout);
          const result = await api(prefix + '/checkouts', 'POST', { cartId: current.cartId, name: data.get('name'), email: data.get('email'), consent: data.get('consent') === 'on' }, current.token, current.idempotency);
          sessionStorage.setItem(key, JSON.stringify({ ...current, orderId: result.orderId }));
          location.assign('/checkout/' + result.orderId);
        } catch (error) { say(error.message); submit.disabled = false; }
      });
    }
    const saved = await api(prefix + '/carts/' + session.cartId, 'GET', undefined, session.token);
    document.getElementById('cart-summary').textContent = saved.items.map(i => (i.product_name || 'Produk') + ': ' + i.quantity + ' × Rp ' + i.price_idr).join(' | ') + ' | Total cart: Rp ' + saved.items.reduce((sum,i) => sum + i.quantity * i.price_idr, 0);
    say('Cart tersimpan. Server memvalidasi ulang harga dan stok sebelum membuat order.');
  } catch (error) { say(error.message); }
  finally { button.disabled = false; }
});
const view = document.getElementById('order-view');
async function refreshOrder() {
  const session = readSession();
  if (!session || session.orderId !== view?.dataset.order) throw new Error('Private order access is not available in this browser session. Contact the approved support channel.');
  const prefix = '/api/commerce/stores/' + encodeURIComponent(session.store) + '/orders/' + encodeURIComponent(session.orderId);
  const order = await api(prefix, 'GET', undefined, session.token);
  view.textContent = order.items.map(i => i.product_name + ' — ' + i.variant_name + ' — ' + i.quantity + ' × Rp ' + i.unit_price_idr).join(' | ') + ' | Total Rp ' + order.totalIdr + ' | Order ' + order.status + ' | Pembayaran ' + order.payment.status;
  renderDelivery(order, session, prefix);
  return { session, prefix, order };
}
if (view) refreshOrder().catch(error => say(error.message));
const pay = document.getElementById('pay-order');
if (pay) pay.addEventListener('click', async () => {
  pay.disabled = true;
  try {
    const { session, prefix, order } = await refreshOrder();
    if (order.status !== 'PENDING_PAYMENT') throw new Error('ORDER_NOT_PAYABLE');
    const invoice = await api(prefix + '/payments', 'POST', undefined, session.token);
    if (!window.checkout) await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = view.dataset.popHost + '/lib/js/duitku.js';
      script.onload = resolve; script.onerror = () => reject(new Error('PAYMENT_UI_UNAVAILABLE'));
      document.head.append(script);
    });
    const update = () => { say('Checking verified server status. Browser notifications alone do not confirm payment.'); refreshOrder().catch(error => say(error.message)); };
    window.checkout.process(invoice.reference, { defaultLanguage: 'id', successEvent: update, pendingEvent: update, errorEvent: update, closeEvent: update });
    say('Payment opened. Authoritative status requires a verified server callback.');
  } catch (error) { say(error.message); }
  finally { pay.disabled = false; }
});
// Bounded refresh only; no browser request can mutate authoritative PAID state.
if (view) { let remaining = 24; const timer = setInterval(() => { if (--remaining <= 0) clearInterval(timer); refreshOrder().catch(() => clearInterval(timer)); }, 5000); }

function renderDelivery(order, session, prefix) {
  if (order.payment.status !== 'PAID' || !order.downloads?.length) return;
  let section = document.getElementById('digital-downloads');
  if (section) return;
  section = document.createElement('section'); section.id = 'digital-downloads';
  const heading = document.createElement('h2'); heading.textContent = 'Paket produk Anda'; section.append(heading);
  const link = document.createElement('a'); link.href = '/support/commerce'; link.textContent = 'Bantuan privat / review'; section.append(link);
  for (const asset of order.downloads) {
    const button = document.createElement('button'); button.className = 'button'; button.textContent = 'Unduh ' + asset.version;
    const confirm = document.createElement('button'); confirm.className = 'button'; confirm.textContent = 'Konfirmasi file tersimpan dan dapat dibuka'; confirm.disabled = true;
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        const response = await fetch(prefix + '/download/' + encodeURIComponent(asset.variant_id), { headers: { Authorization: 'Bearer ' + session.token } });
        if (!response.ok) throw new Error('DELIVERY_UNAVAILABLE');
        const buffer = await response.arrayBuffer();
        const sha = [...new Uint8Array(await crypto.subtle.digest('SHA-256', buffer))].map(v=>v.toString(16).padStart(2,'0')).join('');
        if (sha !== asset.sha256) throw new Error('DOWNLOAD_HASH_MISMATCH');
        const url = URL.createObjectURL(new Blob([buffer], { type: 'application/zip' }));
        const anchor = document.createElement('a'); anchor.href = url; anchor.download = asset.filename; anchor.click();
        setTimeout(()=>URL.revokeObjectURL(url),60000); confirm.disabled = false;
        say('Hash paket cocok. Simpan dan buka file, lalu konfirmasi penerimaan.'); await refreshOrder();
      } catch (error) { say(error.message); } finally { button.disabled = false; }
    });
    confirm.addEventListener('click', async () => {
      confirm.disabled = true;
      try { await api(prefix + '/delivery-confirmation', 'POST', { variantId: asset.variant_id, sha256: asset.sha256 }, session.token); say('Penerimaan produk tercatat.'); await refreshOrder(); }
      catch (error) { say(error.message); confirm.disabled = false; }
    });
    section.append(button, confirm);
  }
  view.after(section);
}
const supportForm = document.getElementById('support-form');
async function refreshSupport() {
  const session = readSession(); if (!session?.orderId) throw new Error('Akses order privat tidak tersedia di sesi ini. Jangan kirim data pelanggan ke kanal publik.');
  const prefix = '/api/commerce/stores/' + encodeURIComponent(session.store) + '/orders/' + encodeURIComponent(session.orderId);
  const response = await api(prefix + '/support', 'GET', undefined, session.token);
  document.getElementById('support-history').textContent = response.requests.map(r => r.category + ' | ' + r.status + ' | ' + r.message + (r.operator_reply ? ' | Balasan: ' + r.operator_reply : '')).join('\n');
  return { session, prefix };
}
if (supportForm) {
  refreshSupport().catch(error=>say(error.message));
  supportForm.addEventListener('submit',async event=>{
    event.preventDefault(); const button = supportForm.querySelector('button'); button.disabled = true;
    try { const { session, prefix } = await refreshSupport(); const data = new FormData(supportForm); await api(prefix + '/support','POST',{category:data.get('category'),message:data.get('message')},session.token); supportForm.reset(); await refreshSupport(); say('Tiket tersimpan privat untuk ditinjau operator.'); }
    catch(error){say(error.message);} finally { button.disabled=false; }
  });
}
