CREATE OR REPLACE FUNCTION mgtf_get_repository_middle_tier_file_parameters(i_file_id INTEGER)
RETURNS JSON
STABLE
AS $CODE$
BEGIN
    RETURN (
        select json_agg(
            json_build_object
            (
                'id', pk_mtp_id,
                'name', mtp_parameter_name,
                'value', mtp_parameter_value
            )
        )
        FROM mgtt_middle_tier_parameter_mtp
        WHERE fk_mtf_mtp_middle_tier_file_id = i_file_id
    );
END;
$CODE$ LANGUAGE plpgsql