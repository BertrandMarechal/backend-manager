CREATE OR REPLACE FUNCTION mgtf_update_settings(i_settings json)
RETURNS TABLE (
    "id" INTEGER,
    "name" TEXT,
    "value" TEXT,
    "environment" TEXT
)
VOLATILE
AS $CODE$
BEGIN
    UPDATE mgtt_setting_set
    SET
        set_value = t.value,
        fk_env_set_environment_id = (
            SELECT pk_env_id
            FROM mgtt_environment_env
            WHERE env_name = t.environment
        )
    FROM json_to_recordset(i_settings)
        t("id" INTEGER, "name" TEXT, "value" TEXT, "environment" TEXT)
    WHERE t.id = pk_set_id;

    RETURN QUERY
    SELECT * from mgtf_get_settings();
END;
$CODE$ LANGUAGE plpgsql