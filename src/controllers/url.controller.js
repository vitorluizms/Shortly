import { nanoid } from "nanoid";
import db from "../database/database.connection.js";
import {
  createUrl,
  deleteUrlQuery,
  getUrl,
  getUserUrl,
  updateUrlVisits,
  validateUrl,
  validateUrlById,
} from "../repositories/url.repository.js";

export async function shortenUrl(req, res) {
  const { url } = req.body;
  const { userId } = res.locals.user;
  const id = nanoid(10);
  try {
    const urlValidate = await validateUrl(url, userId);
    if (urlValidate.rowCount > 0)
      return res.status(400).send("URL already shortened");

    const promise = await createUrl(url, id, userId);

    res.status(201).send(promise.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getUrlById(req, res) {
  const { id } = req.params;
  try {
    const url = await getUserUrl(id);
    if (url.rowCount === 0) return res.status(404).send("URL doesn't exists!");

    res.status(200).send(url.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function redirectUser(req, res) {
  const { shortUrl } = req.params;
  try {
    const url = await getUrl(shortUrl);
    if (url.rowCount === 0)
      return res.status(404).send("URL shortened doesn't exists");

    await updateUrlVisits(url);
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
    const urlValid = await validateUrlById(id);
    if (urlValid.rowCount === 0)
      return res.status(404).send("URL shortened doesn't exists!");
    if (urlValid.rows[0].userId !== userId) return res.sendStatus(401);

    await deleteUrlQuery(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  }
}
