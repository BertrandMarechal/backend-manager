CREATE OR REPLACE FUNCTION mgtf_repository_parameters(i_repo_id INTEGER)
RETURNS JSON
STABLE
AS $CODE$
BEGIN
    RETURN (
        select json_agg(
            json_build_object
            (
                'id', pk_dpa_id,
                'name', dpa_name
            )
        )
        FROM mgtt_database_parameter_dpa
        WHERE fk_rep_dpa_repository_id = i_repo_id
    );
END;
$CODE$ LANGUAGE plpgsql