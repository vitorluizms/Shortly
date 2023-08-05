import db from "../database/database.connection.js";

export const getEmail = (body) => {
  const { email } = body;
  const promise = db.query(`SELECT * FROM users WHERE email = $1;`, [email]);

  return promise;
};

export const createAccount = (body, password) => {
  const { name, email } = body;
  const promise = db.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
    [name, email, password]
  );
  return promise;
};

export const deleteSessions = (user) => {
  const promise = db.query(`DELETE FROM sessions WHERE "userId" = $1;`, [
    user.rows[0].id,
  ]);
  return promise;
};

export const createSessions = (user, token) => {
  const promise = db.query(
    `INSERT INTO sessions ("userId", token) VALUES ($1, $2);`,
    [user.rows[0].id, token]
  );
  return promise;
};
