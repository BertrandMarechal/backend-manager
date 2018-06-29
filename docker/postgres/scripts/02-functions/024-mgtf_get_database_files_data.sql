CREATE OR REPLACE FUNCTION mgtf_get_database_files_data(i_repo_id INTEGER)
RETURNS JSON
STABLE
AS $CODE$
BEGIN
    RETURN (
        select json_agg(
            json_build_object
            (
                'id', pk_dbf_id,
                'filePath', dbf_file_path,
                'version', (SELECT (regexp_matches(dbf_file_path, E'\\w+\\.\\w+\\.\\w+\\.\\w+'))[1] LIMIT 1),
                'databases', mgtf_get_database_version_data(pk_dbf_id)
            ) ORDER BY (SELECT (regexp_matches(dbf_file_path, E'\\w+\\.\\w+\\.\\w+\\.\\w+'))[1] LIMIT 1)
        )
        FROM mgtt_database_file_dbf
        WHERE fk_rep_dbf_repo_id = i_repo_id
    );
END;
$CODE$ LANGUAGE plpgsql