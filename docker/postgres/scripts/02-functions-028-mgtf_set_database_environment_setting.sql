CREATE OR REPLACE FUNCTION mgtf_set_database_environment_setting(i_repo_name TEXT, i_environment TEXT, i_variable_name TEXT, i_variable_value TEXT)
RETURNS INTEGER
VOLATILE
AS $CODE$
BEGIN
    INSERT INTO mgtt_database_parameter_environment_dpe (fk_env_dpe_environment_id, fk_dpa_dpe_database_parameter_id, dpe_value)
    SELECT pk_env_id, pk_dpa_id, i_variable_value
    FROM mgtt_database_parameter_dpa
    INNER JOIN mgtt_repository_rep
        ON rep_folder_name = i_repo_name
        AND fk_rep_dpa_repository_id = pk_rep_id
    INNER JOIN mgtt_environment_env
        ON env_name = i_environment
    WHERE dpa_name = i_variable_name
    ON CONFLICT (fk_env_dpe_environment_id,fk_dpa_dpe_database_parameter_id)
    DO UPDATE SET dpe_value = i_variable_value;
    
    RETURN 1;
END;
$CODE$ LANGUAGE plpgsql