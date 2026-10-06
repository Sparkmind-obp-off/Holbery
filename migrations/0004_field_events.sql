-- Additive, separate utility evidence; never joins customer/order/payment identity.
CREATE TABLE IF NOT EXISTS holbery_field_events (
 event_id TEXT PRIMARY KEY,
 event_name TEXT NOT NULL,
 occurred_at TEXT NOT NULL,
 received_at TEXT NOT NULL,
 event_day TEXT NOT NULL,
 surface TEXT NOT NULL,
 tool_id TEXT NOT NULL DEFAULT '',
 product_id TEXT NOT NULL DEFAULT '',
 session_hash TEXT NOT NULL,
 source TEXT NOT NULL,
 referrer_class TEXT NOT NULL DEFAULT '',
 campaign_id TEXT NOT NULL DEFAULT '',
 field_id TEXT NOT NULL DEFAULT '',
 result_class TEXT NOT NULL DEFAULT '',
 next_tool_id TEXT NOT NULL DEFAULT '',
 template_id TEXT NOT NULL DEFAULT '',
 schema_version INTEGER NOT NULL CHECK(schema_version=1),
 traffic_class TEXT NOT NULL CHECK(traffic_class IN ('production','test'))
);
CREATE INDEX IF NOT EXISTS field_received_idx ON holbery_field_events(received_at);
CREATE INDEX IF NOT EXISTS field_session_idx ON holbery_field_events(session_hash,received_at);
CREATE TABLE IF NOT EXISTS holbery_field_daily (
 event_day TEXT NOT NULL,event_name TEXT NOT NULL,surface TEXT NOT NULL,tool_id TEXT NOT NULL,
 source TEXT NOT NULL,field_id TEXT NOT NULL,result_class TEXT NOT NULL,traffic_class TEXT NOT NULL,
 count INTEGER NOT NULL CHECK(count>0),
 PRIMARY KEY(event_day,event_name,surface,tool_id,source,field_id,result_class,traffic_class)
);
CREATE TRIGGER IF NOT EXISTS field_daily_insert AFTER INSERT ON holbery_field_events BEGIN
 INSERT INTO holbery_field_daily VALUES(NEW.event_day,NEW.event_name,NEW.surface,NEW.tool_id,NEW.source,NEW.field_id,NEW.result_class,NEW.traffic_class,1)
 ON CONFLICT(event_day,event_name,surface,tool_id,source,field_id,result_class,traffic_class) DO UPDATE SET count=count+1;
END;
CREATE TABLE IF NOT EXISTS holbery_field_rate (
 session_hash TEXT NOT NULL,window INTEGER NOT NULL,count INTEGER NOT NULL,
 PRIMARY KEY(session_hash,window)
);
