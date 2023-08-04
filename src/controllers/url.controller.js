import { nanoid } from "nanoid";
import db from "../database/database.connection.js";

export async function shortenUrl(req, res) {
  const { url } = req.body;
  const { userId } = res.locals.user;
  const id = nanoid(10);
  try {
    const urlValidate = await db.query(
      `SELECT * FROM urls WHERE url = $1 AND "userId" = $2;`,
      [url, userId]
    );
    if (urlValidate.rowCount > 0)
      return res.status(400).send("URL already shortened");

    const promise = await db.query(
      `INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3)
      RETURNING id, "shortUrl";`,
      [url, id, userId]
    );

    res.status(201).send(promise.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getUrlById(req, res) {
  const { id } = req.params;
  try {
    const url = await db.query(
      `SELECT id, "shortUrl", url FROM urls WHERE id = $1;`,
      [id]
    );
    if (url.rowCount === 0) return res.status(404).send("URL doesn't exists!");

    res.status(200).send(url.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function redirectUser(req, res) {
  const { shortUrl } = req.params;
  try {
    const url = await db.query(
      `SELECT url, id FROM urls WHERE "shortUrl" = $1;`,
      [shortUrl]
    );
    if (url.rowCount === 0)
      return res.status(404).send("URL shortened doesn't exists");

    await db.query(
      `UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE id = $1;`,
      [url.rows[0].id]
    );
    res.redirect(url.rows[0].url);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteUrl(req, res) {
  const { id } = req.params;
  const { userId } = res.locals.user;
  console.log(id);
  try {
    const urlValid = await db.query(`SELECT * FROM urls WHERE id = $1`, [id]);
    if (urlValid.rowCount === 0)
      return res.status(404).send("URL shortened doesn't exists!");
    if (urlValid.rows[0].userId !== userId) return res.sendStatus(401);

    await db.query(`DELETE FROM urls WHERE id = $1;`, [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  }
}
