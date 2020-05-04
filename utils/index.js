const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role,
  }, process.env.JWT_SECRET, { expiresIn: '1h' });

};

const getAuthUser = (req) => {
  // Authorization: Bearer token
  const tokenWithBearer = req.headers.authorization || '';
  const token = tokenWithBearer.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  getAuthUser,
};
