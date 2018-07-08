CREATE OR REPLACE FUNCTION mgtf_get_repositories()
RETURNS TABLE (
    "name" TEXT,
    "isDatabase" BOOLEAN,
    "isMiddleTier" BOOLEAN
)
STABLE
AS $CODE$
BEGIN
    RETURN QUERY
    SELECT
        rep_folder_name,
        rep_is_database,
        rep_is_middle_tier
    FROM mgtt_repository_rep;
END;
$CODE$ LANGUAGE plpgsql