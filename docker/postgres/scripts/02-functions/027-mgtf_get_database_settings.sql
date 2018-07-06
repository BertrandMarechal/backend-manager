CREATE OR REPLACE FUNCTION mgtf_get_database_settings(i_repo_name TEXT, i_environment TEXT)
RETURNS TABLE (
        key TEXT,
        value TEXT,
        "repoName" TEXT
)
STABLE
AS $CODE$
BEGIN
        RETURN QUERY
        SELECT
                dpa_name,
                dpe_value,
                rep_folder_name
        FROM mgtt_database_parameter_dpa
        INNER JOIN mgtt_repository_rep
                ON (i_repo_name is null or rep_folder_name = i_repo_name)
                AND fk_rep_dpa_repository_id = pk_rep_id
        INNER JOIN mgtt_environment_env
                ON (i_environment is null or env_name = i_environment)
        LEFT JOIN mgtt_database_parameter_environment_dpe
                ON fk_dpa_dpe_database_parameter_id = pk_dpa_id
                AND pk_env_id = fk_env_dpe_environment_id;
END;
$CODE$ LANGUAGE plpgsql