-- Defense in depth: tenant availability, immutable payment identity, verified paid transitions.
CREATE TRIGGER checkout_tenant_active BEFORE INSERT ON orders BEGIN
 SELECT RAISE(ABORT,'CART_TENANT_UNAVAILABLE') WHERE NOT EXISTS(SELECT 1 FROM storefronts s JOIN organizations o ON o.id=s.organization_id WHERE s.id=NEW.storefront_id AND s.status='active' AND o.status='active');
 SELECT RAISE(ABORT,'CART_SHIPPING_NOT_CONFIGURED') WHERE EXISTS(SELECT 1 FROM cart_items ci JOIN offers f ON f.id=ci.offer_id JOIN products p ON p.id=f.product_id WHERE ci.cart_id=NEW.cart_id AND p.type='physical');
END;
CREATE TRIGGER immutable_payment BEFORE UPDATE OF id,order_id,provider,merchant_order_id,amount_idr ON payments BEGIN SELECT RAISE(ABORT,'IMMUTABLE_PAYMENT'); END;
CREATE TRIGGER payment_paid_guard BEFORE UPDATE OF status ON payments WHEN NEW.status='PAID' AND OLD.status!='PAID' BEGIN
 SELECT RAISE(ABORT,'PAYMENT_NOT_VERIFIED') WHERE NOT EXISTS(SELECT 1 FROM payment_events e WHERE e.payment_id=NEW.id AND e.verified=1 AND e.event_type='CALLBACK' AND e.result_code='00' AND e.amount_idr=NEW.amount_idr AND e.provider_reference=NEW.provider_reference);
END;
CREATE TRIGGER payment_no_downgrade BEFORE UPDATE OF status ON payments WHEN OLD.status='PAID' AND NEW.status!='PAID' BEGIN SELECT RAISE(ABORT,'PAYMENT_FINAL'); END;
CREATE TABLE commerce_rate_limits (key_hash TEXT PRIMARY KEY, window INTEGER NOT NULL, count INTEGER NOT NULL CHECK(count>0));
