import db from "../database/database.connection.js";

export async function getAllUrlsByUser(req, res) {
  const { user } = res.locals;
  try {
    const promise = await db.query(
      `SELECT users.id, users.name, SUM(urls."visitCount") AS "visitCount",
      JSON_AGG(JSON_BUILD_OBJECT(
        'id', urls.id,
        'shortUrl', urls."shortUrl",
        'url', urls.url,
        'visitCount', urls."visitCount"
      ) ORDER BY urls.id) AS "shortenedUrls"
      FROM users
      JOIN urls ON urls."userId" = users.id
      WHERE users.id = $1
      GROUP BY users.id`,
      [user.userId]
    );
    res.send(promise.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getUrlsRank(req, res) {}
