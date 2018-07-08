CREATE OR REPLACE FUNCTION mgtf_get_repository_middle_tier_function_event_data(i_function_id INTEGER)
RETURNS JSON
STABLE
AS $CODE$
BEGIN
    RETURN (
        select json_agg(
            json_build_object
            (
                'id', pk_lfe_id,
                'type', lfe_event_type,
                'parameters', lfe_parameters
            )
        )
        FROM mgtt_lambda_function_event_lfe
        WHERE fk_mlf_lfe_middle_tier_function_id = i_function_id
    );
END;
$CODE$ LANGUAGE plpgsql





