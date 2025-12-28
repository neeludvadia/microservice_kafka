import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import db from '../config/db'
dotenv.config();

const router = express.Router();

const gereateToken = (user:{id:string,email:string}) => {
  return jwt.sign(user, process?.env?.JWT_SECRET as string, {
    // expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

router.post("/register", async (req:Request, res:Response) => {
  const { username, email, password } = req.body;

  const userExists = await db.query(`SELECT * FROM "user" WHERE email = $1`, [
    email,
  ]);

  if (userExists.rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.query(
    `INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [username, email, hashedPassword]
  );

  return res
    .status(201)
    .json({ message: "User created", user: newUser.rows[0] });
});

router.post("/login", async (req:Request, res:Response) => {
  const { email, password } = req.body;

  const user = await db.query(`SELECT * FROM "user" WHERE email = $1`, [email]);

  if (user.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = gereateToken({
    id: user.rows[0].id,
    email: user.rows[0].email,
  });

  return res.status(200).json({ message: "Login successful", token });
});

router.get("/validate", async (req:Request, res:Response) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tokenData = token.split(" ")[1];
    const user = jwt.verify(tokenData, process.env.JWT_SECRET as string);
    return res.status(200).json({ ...user as jwt.JwtPayload});
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

export = router;
