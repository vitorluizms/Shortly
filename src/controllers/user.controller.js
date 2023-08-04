import db from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  try {
    const userValid = await db.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]);
    if (userValid.rowCount > 0)
      return res.status(409).send("Email already exists!");

    const hashPassword = bcrypt.hashSync(password, 10);
    await db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
      [name, email, hashPassword]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  try {
    const userValid = await db.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]);
    console.log(userValid.rows);
    if (
      userValid.rowCount === 0 ||
      !bcrypt.compareSync(password, userValid.rows[0].password)
    )
      return res.status(401).send(userValid.rows);

    const token = uuid();
    await db.query(`DELETE FROM sessions WHERE "userId" = $1;`, [
      userValid.rows[0].id,
    ]);
    await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2);`, [
      userValid.rows[0].id,
      token,
    ]);
    res.status(200).send({ token: token });
  } catch (err) {
    res.status(500).send(err);
  }
}
