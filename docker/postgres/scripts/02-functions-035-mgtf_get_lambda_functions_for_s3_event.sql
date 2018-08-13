CREATE OR REPLACE FUNCTION mgtf_get_lambda_functions_for_s3_event(i_event TEXT, i_file_name TEXT, i_bucket_name TEXT)
RETURNS json
STABLE
AS $CODE$
BEGIN
    RETURN
    (
        SELECT COALESCE(json_agg(
            mgtf_get_lambda_function(mtf_service_name, mlf_name)
        ), '[]'::json)
        FROM mgtt_lambda_function_event_lfe
        INNER JOIN mgtt_middle_tier_function_mlf
            ON fk_mlf_lfe_middle_tier_function_id = pk_mlf_id
        INNER JOIN mgtt_middle_tier_file_mtf
            ON fk_mtf_mlf_middle_tier_file_id = pk_mtf_id
        WHERE lfe_event_type = 's3'
        AND i_bucket_name = REPLACE((lfe_parameters->>'bucket')::TEXT,'${file(./variables.yml):stage}', 'local')
        AND i_event like REPLACE((lfe_parameters->>'event')::TEXT, '*', '') || '%'
        AND (
            (
                (((lfe_parameters->>'rules')::json->0)::json)->>'type' = 'prefix'
                AND i_file_name like REPLACE(((((lfe_parameters->>'rules')::json->0)::json)->>'value')::TEXT,'${file(./variables.yml):stage}', 'local') || '%'
            )
            OR
            (
                (((lfe_parameters->>'rules')::json->0)::json)->>'type' = 'suffix'
                AND i_file_name like '%' || ((((lfe_parameters->>'rules')::json->0)::json)->>'value')::TEXT
            )
        )
    );
END;
$CODE$ LANGUAGE plpgsql