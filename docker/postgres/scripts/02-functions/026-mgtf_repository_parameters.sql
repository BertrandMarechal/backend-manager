CREATE OR REPLACE FUNCTION mgtf_repository_parameters(i_repo_id INTEGER)
RETURNS JSON
STABLE
AS $CODE$
BEGIN
    RETURN (
        select json_object_agg(
            env_name, (
                select json_agg(
                    json_build_object
                    (
                        'id', pk_dpa_id,
                        'name', dpa_name,
                        'value', dpe_value
                    )
                )
                FROM mgtt_database_parameter_dpa
                LEFT JOIN mgtt_database_parameter_environment_dpe
                    ON fk_env_dpe_environment_id = pk_env_id
                    AND fk_dpa_dpe_database_parameter_id = pk_dpa_id
                WHERE fk_rep_dpa_repository_id = i_repo_id
            )
        )
        from mgtt_environment_env
    );
END;
$CODE$ LANGUAGE plpgsql