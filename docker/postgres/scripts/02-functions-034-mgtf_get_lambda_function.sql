CREATE OR REPLACE FUNCTION mgtf_get_lambda_function(i_service_name TEXT, i_function_name TEXT)
RETURNS json
STABLE
AS $CODE$
BEGIN
    RETURN
    (
        SELECT
            json_build_object(
                'functionName', mlf_name,
                'serviceName', mtf_service_name,
                'fileName', mtf_file_name || '/' || mlf_file_name,
                'handlerFunctionName', mlf_handler_name,
                'parameters', (
                    SELECT json_agg(
                        json_build_object(
                            'name', mtp_parameter_name,
                            'value', (SELECT mgtf_replace_parameter_variables(pk_mtp_id, 'local'))
                        )
                    )
                    FROM mgtt_middle_tier_parameter_mtp
                    where fk_mtf_mtp_middle_tier_file_id = pk_mtf_id
                )
            )
        FROM  mgtt_middle_tier_function_mlf
        INNER JOIN mgtt_middle_tier_file_mtf
            ON fk_mtf_mlf_middle_tier_file_id = pk_mtf_id
            AND i_service_name = mtf_service_name
        WHERE mlf_name = i_function_name
    );
END;
$CODE$ LANGUAGE plpgsql