-- Versioned private product delivery, pinned at checkout. No product/customer fixtures.
CREATE TABLE product_delivery_assets (
 variant_id TEXT PRIMARY KEY REFERENCES product_variants(id),
 version TEXT NOT NULL, object_key TEXT NOT NULL UNIQUE, sha256 TEXT NOT NULL CHECK(length(sha256)=64),
 bytes INTEGER NOT NULL CHECK(bytes>0 AND bytes<=5000000), filename TEXT NOT NULL,
 support_path TEXT NOT NULL, terms_version TEXT NOT NULL, refund_version TEXT NOT NULL, privacy_version TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE TABLE order_delivery_assets (
 order_id TEXT NOT NULL REFERENCES orders(id),variant_id TEXT NOT NULL REFERENCES product_variants(id),
 version TEXT NOT NULL,object_key TEXT NOT NULL,sha256 TEXT NOT NULL,bytes INTEGER NOT NULL,filename TEXT NOT NULL,
 terms_version TEXT NOT NULL,refund_version TEXT NOT NULL,privacy_version TEXT NOT NULL,
 PRIMARY KEY(order_id,variant_id)
);
CREATE TRIGGER pin_digital_delivery AFTER INSERT ON order_items BEGIN
 INSERT INTO order_delivery_assets SELECT NEW.order_id,NEW.variant_id,a.version,a.object_key,a.sha256,a.bytes,a.filename,a.terms_version,a.refund_version,a.privacy_version FROM product_delivery_assets a WHERE a.variant_id=NEW.variant_id;
END;
CREATE TRIGGER immutable_delivery_snapshot BEFORE UPDATE ON order_delivery_assets BEGIN SELECT RAISE(ABORT,'IMMUTABLE_DELIVERY'); END;
CREATE TRIGGER immutable_delivery_snapshot_delete BEFORE DELETE ON order_delivery_assets BEGIN SELECT RAISE(ABORT,'IMMUTABLE_DELIVERY'); END;
CREATE TRIGGER production_checkout_asset_guard BEFORE INSERT ON orders WHEN NEW.environment='production' BEGIN
 SELECT RAISE(ABORT,'CART_DELIVERY_NOT_CONFIGURED') WHERE EXISTS(SELECT 1 FROM cart_items ci JOIN offers o ON o.id=ci.offer_id LEFT JOIN product_delivery_assets a ON a.variant_id=o.variant_id WHERE ci.cart_id=NEW.cart_id AND a.variant_id IS NULL);
END;
CREATE TABLE download_receipts (order_id TEXT NOT NULL REFERENCES orders(id),variant_id TEXT NOT NULL REFERENCES product_variants(id),offered_at TEXT NOT NULL,confirmed_at TEXT,PRIMARY KEY(order_id,variant_id));
CREATE TABLE support_requests (
 id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id),storefront_id TEXT NOT NULL REFERENCES storefronts(id),
 category TEXT NOT NULL CHECK(category IN ('download','billing','refund','other')), message TEXT NOT NULL CHECK(length(message)<=2000),
 operator_reply TEXT, status TEXT NOT NULL CHECK(status IN ('OPEN','REPLIED','CLOSED')),created_at TEXT NOT NULL,updated_at TEXT NOT NULL
);
CREATE INDEX support_store ON support_requests(storefront_id,status,created_at);
