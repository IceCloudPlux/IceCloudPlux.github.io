const auth = require('./_lib/auth');
const db = require('./_lib/db');
module.exports = auth(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { realname, idcard } = req.body;
  if (!realname || !idcard) return res.status(400).json({ error: '姓名和身份证号必填' });
  const database = await db();
  await database.collection('users').updateOne(
    { _id: new require('mongodb').ObjectId(req.userId) },
    { $set: { realname, idcard } }
  );
  res.json({ message: '实名信息已提交' });
});
