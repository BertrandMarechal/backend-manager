CREATE OR REPLACE FUNCTION mgtf_get_settings()
RETURNS TABLE (
    "id" INTEGER,
    "name" TEXT,
    "value" TEXT
)
STABLE
AS $CODE$
BEGIN
    RETURN QUERY
    SELECT 
        pk_set_id,
        set_name,
        set_value
    FROM mgtt_setting_set;
END;
$CODE$ LANGUAGE plpgsql