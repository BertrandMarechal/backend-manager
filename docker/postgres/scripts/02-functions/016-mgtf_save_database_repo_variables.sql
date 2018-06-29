CREATE OR REPLACE FUNCTION mgtf_save_database_repo_variables(i_repo_name TEXT, i_data json)
RETURNS INTEGER
VOLATILE
AS $CODE$
BEGIN
    --REMOVE THE OLD PARAMETERS
    DELETE FROM mgtt_database_parameter_dpa
    WHERE pk_dpa_id IN(
        SELECT pk_dpa_id
        FROM (
            SELECT pk_dpa_id, json_array_elements(i_data) parameter_name
            FROM mgtt_database_parameter_dpa
            INNER JOIN mgtt_repository_rep ON fk_rep_dpa_repository_id = pk_rep_id
            WHERE rep_folder_name = i_repo_name

        ) a
        WHERE parameter_name is null
    );

    --ADD THE NEW ONES
    INSERT INTO mgtt_database_parameter_dpa(fk_rep_dpa_repository_id, dpa_name)
    SELECT pk_rep_id, REPLACE(json_array_elements(i_data)::TEXT,'"','')
    FROM mgtt_repository_rep
    WHERE rep_folder_name = i_repo_name
    ON CONFLICT (dpa_name, fk_rep_dpa_repository_id) DO NOTHING;

    RETURN 1;
END;
$CODE$ LANGUAGE plpgsql