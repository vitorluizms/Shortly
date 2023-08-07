import db from "../database/database.connection.js";

export const getUrlsUser = (user) => {
  const promise = db.query(
    `SELECT users.id, users.name, COALESCE(SUM(urls."visitCount"), 0) AS "visitCount",
        CASE 
        WHEN COUNT(urls) > 0 THEN JSON_AGG(JSON_BUILD_OBJECT(
            'id', urls.id,
            'shortUrl', urls."shortUrl",
            'url', urls.url,
            'visitCount', urls."visitCount"
          ) ORDER BY urls.id)
        ELSE '[]'::json
        END AS "shortenedUrls"
        FROM users
        LEFT JOIN urls ON urls."userId" = users.id
        WHERE users.id = $1
        GROUP BY users.id, users.name;`,
    [user.userId]
  );

  return promise;
};

export const getRank = () => {
  const promise = db.query(`
    SELECT users.id, users.name, 
      COUNT(urls."userId") AS "linksCount", COALESCE(SUM(urls."visitCount"), 0) AS "visitCount"
      FROM users
      LEFT JOIN urls ON urls."userId" = users.id
      GROUP BY users.id
      ORDER BY "visitCount" DESC
      LIMIT 10;`);

  return promise;
};
