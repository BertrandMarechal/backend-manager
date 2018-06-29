CREATE OR REPLACE FUNCTION mgtf_get_repositories_data()
RETURNS TABLE (
    "name" TEXT,
    "databases" json,
    "isDatabase" boolean,
    "middleTiers" json,
    "isMiddleTier" boolean,
    "parameters" json
)
STABLE
AS $CODE$
BEGIN
    RETURN QUERY
    SELECT
        rep_folder_name,
        CASE
            WHEN rep_is_database THEN COALESCE(mgtf_get_database_files_data(pk_rep_id), '[]'::JSON)
            ELSE '[]'::json
        END,
        rep_is_database,
        CASE
            WHEN rep_is_middle_tier THEN COALESCE(mgtf_get_repository_middle_tier_data(pk_rep_id), '[]'::JSON)
            ELSE '[]'::json
        END,
        rep_is_middle_tier,
        mgtf_repository_parameters(pk_rep_id)
    FROM mgtt_repository_rep;
END;
$CODE$ LANGUAGE plpgsql