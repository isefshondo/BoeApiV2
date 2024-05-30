const jsonwebtoken = require('jsonwebtoken');

require('dotenv').config();

function tokenValidated(request, response, next) {
  const [, token] = request.headers.authorization.split(' ') || [' ', ' '];

  if (!token)
    return response
      .status(401)
      .json({ message: 'Access denied. No token provided' });

  try {
    const decoded = jsonwebtoken.verify(token, process.env.PRIVATE_KEY);
    const userIdFromToken = typeof decoded !== 'string' && decoded.id;

    if (!userIdFromToken)
      return response.status(401).json({ message: 'Invalid token' });

    request.headers['userId'] = decoded.id;

    return next();
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: 'Invalid token' });
  }
}

module.exports = {
  tokenValidated,
};
