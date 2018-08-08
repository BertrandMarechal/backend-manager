CREATE TABLE mgtt_s3_objects_s3o (
    pk_s3o_id SERIAL PRIMARY KEY,
    s3o_bucket TEXT NOT NULL,
    s3o_key TEXT NOT NULL,
    s3o_content_type TEXT,
    s3o_acl TEXT NULL,
    s3o_metadata json NULL,
    s3o_tags json NULL,
    s3o_uploaded boolean default false,
    created_at timestampTZ default CURRENT_TIMESTAMP
);