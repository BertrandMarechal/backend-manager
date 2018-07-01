CREATE OR REPLACE FUNCTION mgtf_get_database_version_data(i_file_id INTEGER)
RETURNS JSON
STABLE
AS $CODE$
BEGIN
    RETURN (
        select json_agg(
            json_build_object
            (
                'id', pk_dbv_id,
                'version', dbv_version_id,
                'databaseUserToUse', dbv_database_user_to_use,
                'databaseFiles', COALESCE(mgtf_get_database_version_files_data(pk_dbv_id), '[]'::JSON)
            )
        )
        FROM mgtt_database_version_dbv
        WHERE fk_dbf_dbv_database_file_id = i_file_id
    );
END;
$CODE$ LANGUAGE plpgsql