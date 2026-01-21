export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.DB;
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const result = await db
    .prepare(
      "UPDATE tasks SET title = ?, completed = ? WHERE id = ? RETURNING *",
    )
    .bind(body.title, body.completed ? 1 : 0, id)
    .first();

  if (!result) {
    throw createError({
      statusCode: 404,
      message: "Task not found",
    });
  }

  return result;
});
