CREATE OR REPLACE FUNCTION mgtf_get_repository_middle_tier_file_variables(i_file_id INTEGER)
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
                        'id', pk_mtv_id,
                        'name', mtv_variable_name,
                        'declared', mtv_declared,
                        'value', mve_value
                    )
                )
                FROM mgtt_middle_tier_variable_mtv
                LEFT JOIN mgtt_middle_tier_variable_environment_mve
                    ON fk_mtv_mve_middle_tier_variable_id = pk_mtv_id
                AND fk_env_mve_environment_id = pk_env_id
                WHERE fk_mtf_mtv_middle_tier_file_id = i_file_id
            )
        )
        from mgtt_environment_env
        INNER JOIN mgtt_middle_tier_file_mtf ON pk_mtf_id = i_file_id
    );
END;
$CODE$ LANGUAGE plpgsql