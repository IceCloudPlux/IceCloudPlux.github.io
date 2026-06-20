const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./_lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: '用户名和密码必填' });
  const database = await db();
  const users = database.collection('users');
  const exists = await users.findOne({ username });
  if (exists) return res.status(409).json({ error: '用户名已存在' });
  const hashed = await bcrypt.hash(password, 10);
  const result = await users.insertOne({
    username,
    password: hashed,
    realname: null,
    idcard: null,
    balance: 0,
    role: 'user',
    createdAt: new Date()
  });
  const token = jwt.sign({ userId: result.insertedId.toString(), role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token });
};
