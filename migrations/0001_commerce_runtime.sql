-- Runtime migration. commerce/schema.sql remains a historical design, not an applied migration.
PRAGMA foreign_keys = ON;
CREATE TABLE organizations (id TEXT PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('active','inactive')));
CREATE TABLE brands (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL REFERENCES organizations(id), name TEXT NOT NULL, UNIQUE(id,organization_id));
CREATE TABLE storefronts (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, brand_id TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('active','inactive')), UNIQUE(id,organization_id,brand_id), FOREIGN KEY(brand_id,organization_id) REFERENCES brands(id,organization_id));
CREATE TABLE products (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, brand_id TEXT NOT NULL, slug TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, type TEXT NOT NULL CHECK(type IN ('digital','physical','service')), status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')), created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(brand_id,slug), UNIQUE(id,organization_id,brand_id), FOREIGN KEY(brand_id,organization_id) REFERENCES brands(id,organization_id));
CREATE TABLE product_variants (id TEXT PRIMARY KEY, product_id TEXT NOT NULL REFERENCES products(id), sku TEXT NOT NULL UNIQUE, name TEXT NOT NULL, stock INTEGER NOT NULL CHECK(stock >= 0), status TEXT NOT NULL CHECK(status IN ('active','inactive')), UNIQUE(id,product_id));
CREATE TABLE offers (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, brand_id TEXT NOT NULL, storefront_id TEXT NOT NULL, product_id TEXT NOT NULL, variant_id TEXT NOT NULL, price_idr INTEGER NOT NULL CHECK(price_idr BETWEEN 1 AND 100000000), status TEXT NOT NULL CHECK(status IN ('active','inactive')), UNIQUE(storefront_id,variant_id), FOREIGN KEY(storefront_id,organization_id,brand_id) REFERENCES storefronts(id,organization_id,brand_id), FOREIGN KEY(product_id,organization_id,brand_id) REFERENCES products(id,organization_id,brand_id), FOREIGN KEY(variant_id,product_id) REFERENCES product_variants(id,product_id));
CREATE TABLE carts (id TEXT PRIMARY KEY, storefront_id TEXT NOT NULL REFERENCES storefronts(id), access_hash TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN','CHECKED_OUT')), created_at TEXT NOT NULL, UNIQUE(id,storefront_id));
CREATE TABLE cart_items (cart_id TEXT NOT NULL, storefront_id TEXT NOT NULL, offer_id TEXT NOT NULL REFERENCES offers(id), quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 99), price_idr INTEGER NOT NULL, PRIMARY KEY(cart_id,offer_id), FOREIGN KEY(cart_id,storefront_id) REFERENCES carts(id,storefront_id));
CREATE TRIGGER cart_item_insert_guard BEFORE INSERT ON cart_items BEGIN
 SELECT RAISE(ABORT,'CART_UNAVAILABLE') WHERE NOT EXISTS(SELECT 1 FROM carts c JOIN offers o ON o.id=NEW.offer_id JOIN products p ON p.id=o.product_id JOIN product_variants v ON v.id=o.variant_id WHERE c.id=NEW.cart_id AND c.status='OPEN' AND c.storefront_id=NEW.storefront_id AND o.storefront_id=c.storefront_id AND o.status='active' AND p.status='published' AND v.status='active' AND v.stock>=NEW.quantity AND o.price_idr=NEW.price_idr);
END;
CREATE TRIGGER cart_item_update_guard BEFORE UPDATE ON cart_items BEGIN
 SELECT RAISE(ABORT,'CART_UNAVAILABLE') WHERE NEW.cart_id!=OLD.cart_id OR NEW.offer_id!=OLD.offer_id OR NEW.storefront_id!=OLD.storefront_id OR NOT EXISTS(SELECT 1 FROM carts c JOIN offers o ON o.id=NEW.offer_id JOIN products p ON p.id=o.product_id JOIN product_variants v ON v.id=o.variant_id WHERE c.id=NEW.cart_id AND c.status='OPEN' AND o.storefront_id=c.storefront_id AND o.status='active' AND p.status='published' AND v.status='active' AND v.stock>=NEW.quantity AND o.price_idr=NEW.price_idr);
END;
CREATE TRIGGER cart_item_delete_guard BEFORE DELETE ON cart_items WHEN (SELECT status FROM carts WHERE id=OLD.cart_id)!='OPEN' BEGIN SELECT RAISE(ABORT,'CART_CLOSED'); END;
CREATE TABLE customers (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL REFERENCES organizations(id), name TEXT NOT NULL, email TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE(id,organization_id));
CREATE TABLE orders (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, brand_id TEXT NOT NULL, storefront_id TEXT NOT NULL, cart_id TEXT NOT NULL UNIQUE, customer_id TEXT NOT NULL, access_hash TEXT NOT NULL, idempotency_key TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK(status IN ('PENDING_PAYMENT','PAID','PROCESSING','FULFILLED','COMPLETED','CANCELLED','EXPIRED','REFUNDED')), total_idr INTEGER NOT NULL CHECK(total_idr BETWEEN 1 AND 100000000), currency TEXT NOT NULL DEFAULT 'IDR' CHECK(currency='IDR'), release_commit TEXT NOT NULL, environment TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(storefront_id,idempotency_key), FOREIGN KEY(storefront_id,organization_id,brand_id) REFERENCES storefronts(id,organization_id,brand_id), FOREIGN KEY(cart_id,storefront_id) REFERENCES carts(id,storefront_id), FOREIGN KEY(customer_id,organization_id) REFERENCES customers(id,organization_id));
CREATE TABLE order_items (order_id TEXT NOT NULL REFERENCES orders(id), offer_id TEXT NOT NULL REFERENCES offers(id), variant_id TEXT NOT NULL REFERENCES product_variants(id), product_name TEXT NOT NULL, variant_name TEXT NOT NULL, sku TEXT NOT NULL, quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 99), unit_price_idr INTEGER NOT NULL CHECK(unit_price_idr>0), line_total_idr INTEGER NOT NULL CHECK(line_total_idr=quantity*unit_price_idr), PRIMARY KEY(order_id,offer_id));
CREATE TABLE payments (id TEXT PRIMARY KEY, order_id TEXT NOT NULL UNIQUE REFERENCES orders(id), provider TEXT NOT NULL CHECK(provider='duitku'), merchant_order_id TEXT NOT NULL UNIQUE, amount_idr INTEGER NOT NULL CHECK(amount_idr>0), provider_reference TEXT UNIQUE, payment_url TEXT, status TEXT NOT NULL CHECK(status IN ('CREATED','CREATING','PENDING','PAID','FAILED','UNKNOWN')), created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE payment_events (id TEXT PRIMARY KEY, payment_id TEXT NOT NULL REFERENCES payments(id), event_key TEXT NOT NULL UNIQUE, event_type TEXT NOT NULL, result_code TEXT NOT NULL, provider_reference TEXT NOT NULL, amount_idr INTEGER NOT NULL, verified INTEGER NOT NULL CHECK(verified=1), received_at TEXT NOT NULL);
CREATE TABLE commerce_events (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL REFERENCES organizations(id), storefront_id TEXT NOT NULL REFERENCES storefronts(id), order_id TEXT REFERENCES orders(id), event_type TEXT NOT NULL, detail TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE fulfillments (order_id TEXT PRIMARY KEY REFERENCES orders(id), status TEXT NOT NULL CHECK(status IN ('PROCESSING','FULFILLED','COMPLETED')), delivery_reference TEXT, updated_at TEXT NOT NULL);
-- This trigger is one serialized SQLite transaction: revalidate, snapshot, reserve, close, payment, event.
CREATE TRIGGER checkout_guard BEFORE INSERT ON orders BEGIN
 SELECT RAISE(ABORT,'CART_CLOSED') WHERE NOT EXISTS(SELECT 1 FROM carts WHERE id=NEW.cart_id AND storefront_id=NEW.storefront_id AND status='OPEN' AND access_hash=NEW.access_hash);
 SELECT RAISE(ABORT,'EMPTY_CART') WHERE NOT EXISTS(SELECT 1 FROM cart_items WHERE cart_id=NEW.cart_id);
 SELECT RAISE(ABORT,'CART_LIMIT') WHERE (SELECT count(*) FROM cart_items WHERE cart_id=NEW.cart_id)>20;
 SELECT RAISE(ABORT,'STALE_OR_UNAVAILABLE_CART') WHERE EXISTS(SELECT 1 FROM cart_items ci JOIN offers o ON o.id=ci.offer_id JOIN products p ON p.id=o.product_id JOIN product_variants v ON v.id=o.variant_id WHERE ci.cart_id=NEW.cart_id AND (o.storefront_id!=NEW.storefront_id OR o.status!='active' OR p.status!='published' OR v.status!='active' OR v.stock<ci.quantity OR o.price_idr!=ci.price_idr));
 SELECT RAISE(ABORT,'AMOUNT_MISMATCH') WHERE NEW.total_idr!=(SELECT SUM(quantity*price_idr) FROM cart_items WHERE cart_id=NEW.cart_id);
END;
CREATE TRIGGER checkout_commit AFTER INSERT ON orders BEGIN
 INSERT INTO order_items SELECT NEW.id,o.id,v.id,p.name,v.name,v.sku,ci.quantity,o.price_idr,ci.quantity*o.price_idr FROM cart_items ci JOIN offers o ON o.id=ci.offer_id JOIN products p ON p.id=o.product_id JOIN product_variants v ON v.id=o.variant_id WHERE ci.cart_id=NEW.cart_id;
 UPDATE product_variants SET stock=stock-(SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.order_id=NEW.id AND oi.variant_id=product_variants.id) WHERE id IN (SELECT variant_id FROM order_items WHERE order_id=NEW.id);
 UPDATE carts SET status='CHECKED_OUT' WHERE id=NEW.cart_id;
 INSERT INTO payments VALUES (NEW.id,NEW.id,'duitku','HB-'||NEW.id,NEW.total_idr,NULL,NULL,'CREATED',NEW.created_at,NEW.created_at);
 INSERT INTO commerce_events VALUES (lower(hex(randomblob(16))),NEW.organization_id,NEW.storefront_id,NEW.id,'ORDER_CREATED','Immutable snapshot and stock reservation',NEW.created_at);
END;
CREATE TRIGGER immutable_order BEFORE UPDATE OF organization_id,brand_id,storefront_id,cart_id,customer_id,access_hash,idempotency_key,total_idr,currency,release_commit,environment ON orders BEGIN SELECT RAISE(ABORT,'IMMUTABLE_ORDER'); END;
CREATE TRIGGER immutable_item_update BEFORE UPDATE ON order_items BEGIN SELECT RAISE(ABORT,'IMMUTABLE_ITEM'); END;
CREATE TRIGGER immutable_item_delete BEFORE DELETE ON order_items BEGIN SELECT RAISE(ABORT,'IMMUTABLE_ITEM'); END;
CREATE TRIGGER order_transition_guard BEFORE UPDATE OF status ON orders WHEN NEW.status!=OLD.status BEGIN
 SELECT RAISE(ABORT,'INVALID_TRANSITION') WHERE NOT ((OLD.status='PENDING_PAYMENT' AND NEW.status IN ('PAID','CANCELLED','EXPIRED')) OR (OLD.status='PAID' AND NEW.status='PROCESSING') OR (OLD.status='PROCESSING' AND NEW.status='FULFILLED') OR (OLD.status='FULFILLED' AND NEW.status='COMPLETED'));
 SELECT RAISE(ABORT,'PAYMENT_NOT_VERIFIED') WHERE NEW.status='PAID' AND NOT EXISTS(SELECT 1 FROM payments WHERE order_id=NEW.id AND status='PAID');
END;
CREATE TRIGGER order_transition_event AFTER UPDATE OF status ON orders WHEN NEW.status!=OLD.status BEGIN
 INSERT INTO commerce_events VALUES (lower(hex(randomblob(16))),NEW.organization_id,NEW.storefront_id,NEW.id,'ORDER_'||NEW.status,OLD.status||' -> '||NEW.status,NEW.updated_at);
 UPDATE product_variants SET stock=stock+(SELECT SUM(quantity) FROM order_items WHERE order_id=NEW.id AND variant_id=product_variants.id) WHERE NEW.status IN ('CANCELLED','EXPIRED') AND id IN (SELECT variant_id FROM order_items WHERE order_id=NEW.id);
END;
-- Signed callbacks are persisted first; their state application is atomic and replay-safe.
CREATE TRIGGER payment_event_guard BEFORE INSERT ON payment_events BEGIN
 SELECT RAISE(ABORT,'PAYMENT_MISMATCH') WHERE NOT EXISTS(SELECT 1 FROM payments p JOIN orders o ON o.id=p.order_id WHERE p.id=NEW.payment_id AND p.amount_idr=NEW.amount_idr AND o.total_idr=NEW.amount_idr AND p.provider_reference=NEW.provider_reference AND o.status IN ('PENDING_PAYMENT','PAID','PROCESSING','FULFILLED','COMPLETED') AND p.status IN ('PENDING','PAID','FAILED'));
END;
CREATE TRIGGER apply_payment_event AFTER INSERT ON payment_events WHEN NEW.event_type='CALLBACK' BEGIN
 UPDATE payments SET status='PAID',updated_at=NEW.received_at WHERE id=NEW.payment_id AND NEW.result_code='00';
 UPDATE payments SET status='FAILED',updated_at=NEW.received_at WHERE id=NEW.payment_id AND NEW.result_code='01' AND status!='PAID';
 UPDATE orders SET status='PAID',updated_at=NEW.received_at WHERE id=(SELECT order_id FROM payments WHERE id=NEW.payment_id) AND status='PENDING_PAYMENT' AND NEW.result_code='00';
 INSERT INTO commerce_events SELECT lower(hex(randomblob(16))),o.organization_id,o.storefront_id,o.id,'PAYMENT_CALLBACK',NEW.result_code,NEW.received_at FROM orders o JOIN payments p ON p.order_id=o.id WHERE p.id=NEW.payment_id;
END;
CREATE INDEX offers_storefront ON offers(storefront_id,status);
CREATE INDEX orders_tenant ON orders(storefront_id,created_at);
CREATE INDEX events_order ON commerce_events(order_id,created_at);
-- Actual parent identity only. No invented product, customer, payment, or sale.
INSERT INTO organizations VALUES ('holbery','HOLBERY','active');
INSERT INTO brands VALUES ('holbery','holbery','HOLBERY');
INSERT INTO storefronts VALUES ('holbery-direct','holbery','holbery','direct','HOLBERY Direct','active');
