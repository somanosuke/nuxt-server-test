export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.DB;
  const id = getRouterParam(event, "id");

  const result = await db
    .prepare("DELETE FROM tasks WHERE id = ? RETURNING *")
    .bind(id)
    .first();

  if (!result) {
    throw createError({
      statusCode: 404,
      message: "Task not found",
    });
  }

  return { success: true };
});
