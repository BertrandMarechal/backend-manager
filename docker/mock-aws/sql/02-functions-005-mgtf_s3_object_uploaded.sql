CREATE OR REPLACE FUNCTION mgtf_s3_object_uploaded(i_id INTEGER)
RETURNS integer
VOLATILE
AS $CODE$
BEGIN
        UPDATE mgtt_s3_objects_s3o
        SET s3o_uploaded = true
        WHERE pk_s3o_id = i_id;
        
        RETURN 1;
END
$CODE$ LANGUAGE plpgsql