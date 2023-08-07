import { getRank, getUrlsUser } from "../repositories/rank.repository.js";

export async function getAllUrlsByUser(req, res) {
  const { user } = res.locals;
  try {
    const promise = await getUrlsUser(user);
    res.send(promise.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getUrlsRank(req, res) {
  try {
    const promise = await getRank();

    res.status(200).send(promise.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
