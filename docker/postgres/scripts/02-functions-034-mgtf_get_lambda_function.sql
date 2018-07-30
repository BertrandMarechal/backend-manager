CREATE OR REPLACE FUNCTION mgtf_get_lambda_function(i_service_name TEXT, i_function_name TEXT)
RETURNS json
STABLE
AS $CODE$
BEGIN
    RETURN '{"name": "bert"}';
END;
$CODE$ LANGUAGE plpgsql