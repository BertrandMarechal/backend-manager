CREATE OR REPLACE FUNCTION mgtf_get_database_version_files_data(i_version_id INTEGER)
RETURNS JSON
STABLE
AS $CODE$
BEGIN
    RETURN (
        select json_agg(
            json_build_object
            (
                'id', pk_dvf_id,
                'filePath', dvf_file_name,
                'position', dvf_position
            )
        )
        FROM mgtt_database_version_file_dvf
        WHERE fk_dbv_dvf_database_version_id = i_version_id
    );
END;
$CODE$ LANGUAGE plpgsql