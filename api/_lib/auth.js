const jwt = require('jsonwebtoken');
module.exports = (handler) => async (req, res) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: '未登录' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    return handler(req, res);
  } catch (e) {
    return res.status(401).json({ error: '登录已过期' });
  }
};
