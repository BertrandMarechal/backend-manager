CREATE OR REPLACE FUNCTION mgtf_insert_database_files(
    i_files TEXT[]
)
RETURNS INTEGER
VOLATILE
AS $CODE$
BEGIN
    --INSERT NEW FILES
    INSERT INTO mgtt_database_files_dfb (dfb_file_path)
    SELECT *
    FROM unnest(i_files)
    WHERE NOT EXISTS (
        select 1
        FROM mgtt_database_files_dfb
        WHERE dfb_file_path = unnest.unnest
    );
    
    PERFORM mgtf_identify_repo();

    RETURN 1;
END;
$CODE$ LANGUAGE plpgsql