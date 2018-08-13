CREATE OR REPLACE FUNCTION mgtf_get_s3_object_data(i_id INTEGER DEFAULT NULL, i_bucket TEXT DEFAULT NULL, i_key TEXT DEFAULT NULL)
RETURNS json
STABLE
AS $CODE$
BEGIN
        RETURN (
                SELECT json_build_object(
                        'Bucket', s3o_bucket,
                        'Key', s3o_key,
                        'ContentType', s3o_content_type,
                        'ACL', s3o_acl,
                        'Metadata', s3o_metadata,
                        'Tags', s3o_tags,
                        'uploaded', s3o_uploaded
                )
                FROM mgtt_s3_objects_s3o
                WHERE (i_id IS NULL OR (i_id IS NOT NULL AND pk_s3o_id = i_id))
                AND (
                        (i_bucket IS NULL AND i_key IS NULL)
                        OR (i_bucket = s3o_bucket AND i_key = s3o_key)
                )
                ORDER BY created_at desc
                LIMIT 1
        );
END
$CODE$ LANGUAGE plpgsql