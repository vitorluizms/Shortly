import db from "../database/database.connection.js";

export default async function validateAuth(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    const user = await db.query(
      `SELECT "userId" FROM sessions WHERE token = $1`,
      [token]
    );
    if (user.rowCount === 0) return res.status(401).send("Invalid token");

    res.locals.user = user.rows[0];
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
