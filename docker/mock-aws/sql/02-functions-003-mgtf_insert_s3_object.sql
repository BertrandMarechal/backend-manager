CREATE OR REPLACE FUNCTION mgtf_insert_s3_object(
        i_bucket TEXT,
        i_key TEXT,
        i_content_type TEXT,
        i_acl TEXT,
        i_metadata json,
        i_tags json,
        i_uploaded BOOLEAN DEFAULT FALSE
)
RETURNS integer
VOLATILE
AS $CODE$
DECLARE
        v_return_id INTEGER;
BEGIN
        INSERT INTO mgtt_s3_objects_s3o (s3o_bucket, s3o_key, s3o_content_type, s3o_acl, s3o_metadata, s3o_tags, s3o_uploaded)
        VALUES (i_bucket, i_key, i_content_type, i_acl, i_metadata, i_tags, i_uploaded)
        RETURNING pk_s3o_id INTO v_return_id;
        
        RETURN v_return_id;
END
$CODE$ LANGUAGE plpgsql