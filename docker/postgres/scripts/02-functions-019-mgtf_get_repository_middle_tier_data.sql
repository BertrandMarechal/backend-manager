CREATE OR REPLACE FUNCTION mgtf_get_repository_middle_tier_data(i_repository_id INTEGER)
RETURNS JSON
STABLE
AS $CODE$
BEGIN
    RETURN (
        select json_agg(
            json_build_object
            (
                'id', pk_mtf_id,
                'fileName', mtf_file_name,
                'serviceName', mtf_service_name,
                'functions', (select mgtf_get_repository_middle_tier_functions_data(pk_mtf_id)),
                'parameters', (select mgtf_get_repository_middle_tier_file_parameters(pk_mtf_id)),
                'variables', (select mgtf_get_repository_middle_tier_file_variables(pk_mtf_id))
            )
        )
        FROM mgtt_middle_tier_file_mtf
        WHERE fk_rep_mtf_repository_id = i_repository_id
    );
END;
$CODE$ LANGUAGE plpgsql