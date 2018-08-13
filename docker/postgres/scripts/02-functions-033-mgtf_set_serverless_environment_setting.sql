CREATE OR REPLACE FUNCTION mgtf_set_serverless_environment_setting(i_service_name TEXT, i_environment TEXT, i_variable_name TEXT, i_variable_value TEXT)
RETURNS INTEGER
VOLATILE
AS $CODE$
BEGIN
    INSERT INTO mgtt_middle_tier_variable_environment_mve (
        fk_env_mve_environment_id,
        fk_mtv_mve_middle_tier_variable_id,
        mve_value
    )
    SELECT
        pk_env_id,
        pk_mtv_id,
        i_variable_value
    FROM mgtt_middle_tier_file_mtf
    INNER JOIN mgtt_middle_tier_variable_mtv ON fk_mtf_mtv_middle_tier_file_id = pk_mtf_id AND mtv_variable_name = i_variable_name
    INNER JOIN mgtt_environment_env ON env_name = i_environment
    WHERE mtf_service_name = i_service_name
    ON CONFLICT (fk_env_mve_environment_id,fk_mtv_mve_middle_tier_variable_id)
    DO UPDATE SET mve_value = i_variable_value;

    RETURN 1;
END;
$CODE$ LANGUAGE plpgsql