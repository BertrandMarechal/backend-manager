CREATE OR REPLACE FUNCTION mgtf_get_repository_middle_tier_functions_data(i_file_id INTEGER)
RETURNS JSON
STABLE
AS $CODE$
BEGIN
    RETURN (
        select json_agg(
            json_build_object
            (
                'id', pk_mlf_id,
                'name', mlf_name,
                'fileName', mlf_file_name,
                'handlerName', mlf_handler_name,
                'events', (select mgtf_get_repository_middle_tier_function_event_data(pk_mlf_id))
            )
        )
        FROM mgtt_middle_tier_function_mlf
        WHERE fk_mtf_mlf_middle_tier_file_id = i_file_id
    );
END;
$CODE$ LANGUAGE plpgsql