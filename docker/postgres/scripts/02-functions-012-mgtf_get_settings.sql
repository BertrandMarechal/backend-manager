CREATE OR REPLACE FUNCTION mgtf_get_settings()
RETURNS TABLE (
    "id" INTEGER,
    "name" TEXT,
    "value" TEXT,
    "environment" TEXT
)
STABLE
AS $CODE$
BEGIN
    RETURN QUERY
    SELECT 
        pk_set_id,
        set_name,
        set_value,
        env_name
    FROM mgtt_setting_set
    LEFT JOIN mgtt_environment_env ON pk_env_id = fk_env_set_environment_id;
END;
$CODE$ LANGUAGE plpgsql