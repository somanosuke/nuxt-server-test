export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.DB;

  const { results } = await db
    .prepare("SELECT * FROM tasks ORDER BY created_at DESC")
    .all();

  return results;
});
