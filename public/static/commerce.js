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
      checkout.innerHTML = '<h2>Checkout</h2><label>Name<input name="name" autocomplete="name" maxlength="100" required></label><label>Email<input name="email" type="email" autocomplete="email" maxlength="255" required></label><label><input name="consent" type="checkbox" required> I agree to the approved commercial terms and data processing described in <a href="/privacy">Privacy</a>.</label><button class="button">Create order</button>';
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
    say('Cart saved. The server validates price and stock again before creating your order.');
  } catch (error) { say(error.message); }
  finally { button.disabled = false; }
});
const view = document.getElementById('order-view');
async function refreshOrder() {
  const session = readSession();
  if (!session || session.orderId !== view?.dataset.order) throw new Error('Private order access is not available in this browser session. Contact the approved support channel.');
  const prefix = '/api/commerce/stores/' + encodeURIComponent(session.store) + '/orders/' + encodeURIComponent(session.orderId);
  const order = await api(prefix, 'GET', undefined, session.token);
  view.textContent = 'Order ' + order.orderId + ' | Rp ' + order.totalIdr + ' | ' + order.status + ' | Payment: ' + order.payment.status;
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
