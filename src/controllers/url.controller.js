import { nanoid } from "nanoid";
import db from "../database/database.connection.js";

export async function shortenUrl(req, res) {
  const { url } = req.body;
  const { userId } = res.locals.user;
  const id = nanoid(10);
  try {
    const urlValidate = await db.query(
      `SELECT * FROM urls WHERE url = $1 AND "userId" = $2`,
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

export async function getUrlById(req, res) {}

export async function redirectUser(req, res) {}

export async function deleteUrl(req, res) {}
