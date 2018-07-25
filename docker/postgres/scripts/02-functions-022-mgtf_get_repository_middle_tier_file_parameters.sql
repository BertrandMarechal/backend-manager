CREATE OR REPLACE FUNCTION mgtf_get_repository_middle_tier_file_parameters(i_file_id INTEGER)
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
                        'id', pk_mtp_id,
                        'name', mtp_parameter_name,
                        'value', mpe_value
                    )
                )
                FROM mgtt_middle_tier_parameter_mtp
                LEFT JOIN mgtt_middle_tier_parameter_environment_mpe
                    ON fk_mtp_mpe_middle_tier_parameter_id = pk_mtp_id
                    AND fk_env_mpe_environment_id = pk_env_id
                WHERE fk_mtf_mtp_middle_tier_file_id = i_file_id
            )
        )
        from mgtt_environment_env
        INNER JOIN mgtt_middle_tier_file_mtf ON pk_mtf_id = i_file_id
    );
END;
$CODE$ LANGUAGE plpgsql