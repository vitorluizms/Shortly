import db from "../database/database.connection.js";

export const validateUrl = (url, userId) => {
  const promise = db.query(
    `SELECT * FROM urls WHERE url = $1 AND "userId" = $2;`,
    [url, userId]
  );

  return promise;
};

export const createUrl = (url, id, userId) => {
  const promise = db.query(
    `INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3)
        RETURNING id, "shortUrl";`,
    [url, id, userId]
  );

  return promise;
};

export const getUserUrl = (id) => {
  const promise = db.query(
    `SELECT id, "shortUrl", url FROM urls WHERE id = $1;`,
    [id]
  );

  return promise;
};

export const getUrl = (shortUrl) => {
  const promise = db.query(`SELECT url, id FROM urls WHERE "shortUrl" = $1;`, [
    shortUrl,
  ]);

  return promise;
};

export const updateUrlVisits = (url) => {
  const promise = db.query(
    `UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE id = $1;`,
    [url.rows[0].id]
  );
  return promise;
};

export const validateUrlById = (id) => {
  const promise = db.query(`SELECT * FROM urls WHERE id = $1`, [id]);

  return promise;
};

export const deleteUrlQuery = (id) => {
  const promise = db.query(`DELETE FROM urls WHERE id = $1;`, [id]);

  return promise;
};
