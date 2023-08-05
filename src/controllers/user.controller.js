import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import {
  createAccount,
  createSessions,
  deleteSessions,
  getEmail,
} from "../repositories/user.repository.js";

export async function signUp(req, res) {
  const { password } = req.body;
  try {
    const userValid = await getEmail(req.body);
    if (userValid.rowCount > 0)
      return res.status(409).send("Email already exists!");

    const hashPassword = bcrypt.hashSync(password, 10);
    await createAccount(req.body, hashPassword);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  try {
    const userValid = await getEmail(req.body);
    if (
      userValid.rowCount === 0 ||
      !bcrypt.compareSync(password, userValid.rows[0].password)
    )
      return res.status(401).send("email or password invalid");

    const token = uuid();
    await deleteSessions(userValid);
    await createSessions(userValid, token);

    res.status(200).send({ token: token });
  } catch (err) {
    res.status(500).send(err);
  }
}
