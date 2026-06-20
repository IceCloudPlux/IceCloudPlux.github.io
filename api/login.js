const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./_lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body;
  const database = await db();
  const user = await database.collection('users').findOne({ username });
  if (!user) return res.status(401).json({ error: '用户名或密码错误' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: '用户名或密码错误' });
  const token = jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
};
