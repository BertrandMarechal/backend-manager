CREATE OR REPLACE FUNCTION mgtf_get_database_settings(i_repo_name TEXT, i_environment TEXT)
RETURNS JSON
STABLE
AS $CODE$
BEGIN
    RETURN (
        select json_agg(
            json_build_object
            (
                'key', dpa_name,
                'value', dpe_value
            )
        )
        FROM mgtt_database_parameter_dpa
        INNER JOIN mgtt_repository_rep
            ON rep_folder_name = i_repo_name
            AND fk_rep_dpa_repository_id = pk_rep_id
        INNER JOIN mgtt_database_parameter_environment_dpe
            ON fk_dpa_dpe_database_parameter_id = pk_dpa_id
        INNER JOIN mgtt_environment_env
            ON env_name = i_environment
            AND pk_env_id = fk_env_dpe_environment_id
    );
END;
$CODE$ LANGUAGE plpgsql