export default defineEventHandler(async (event) => {
  const db = hubDatabase();

  const { results } = await db
    .prepare("SELECT * FROM tasks ORDER BY created_at DESC")
    .all();

  return results;
});
