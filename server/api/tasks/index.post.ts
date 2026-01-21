export default defineEventHandler(async (event) => {
  const db = hubDatabase();
  const body = await readBody(event);

  if (!body.title) {
    throw createError({
      statusCode: 400,
      message: "Title is required",
    });
  }

  const result = await db
    .prepare("INSERT INTO tasks (title) VALUES (?) RETURNING *")
    .bind(body.title)
    .first();

  return result;
});
