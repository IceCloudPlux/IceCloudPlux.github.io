const auth = require('./_lib/auth');
const db = require('./_lib/db');
module.exports = auth(async (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ error: '无权限' });
  if (req.method !== 'POST') return res.status(405).end();
  const { username, amount } = req.body;
  if (!username || !amount) return res.status(400).json({ error: '缺少参数' });
  const database = await db();
  const result = await database.collection('users').updateOne(
    { username },
    { $inc: { balance: parseFloat(amount) } }
  );
  if (result.matchedCount === 0) return res.status(404).json({ error: '用户不存在' });
  res.json({ message: '充值成功' });
});
