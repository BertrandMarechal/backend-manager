CREATE OR REPLACE FUNCTION mgtf_insert_database_files(
    i_files TEXT[]
)
RETURNS INTEGER
VOLATILE
AS $CODE$
BEGIN
    delete from mgtt_database_file_dbf;
    --INSERT NEW FILES
    INSERT INTO mgtt_database_file_dbf (dbf_file_path)
    SELECT *
    FROM unnest(i_files)
    WHERE NOT EXISTS (
        select 1
        FROM mgtt_database_file_dbf
        WHERE dbf_file_path = unnest.unnest
    );

    RETURN 1;
END;
$CODE$ LANGUAGE plpgsql