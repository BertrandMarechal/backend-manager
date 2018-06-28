CREATE OR REPLACE FUNCTION mgtf_get_database_version_files(i_repo_name TEXT)
RETURNS TABLE
(
    "path" TEXT
)
STABLE
AS $CODE$
BEGIN
    RETURN QUERY
    SELECT
        rep_folder_name || '/release/' || dvf_file_name
    FROM mgtt_repository_rep
    INNER JOIN mgtt_database_version_dbv
        ON fk_rep_dbv_repo_id = pk_rep_id
    INNER JOIN mgtt_database_version_file_dvf 
        ON fk_dbv_dvf_database_version_id = pk_dbv_id
    WHERE rep_is_database
    AND rep_folder_name = i_repo_name;
END;
$CODE$ LANGUAGE plpgsql