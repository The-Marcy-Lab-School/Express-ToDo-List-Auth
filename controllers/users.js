const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createUser = (req, res) => {
  const { name, email, password } = req.body;

  const saltRounds = 8;
  bcrypt.hash(password, saltRounds)
    .then((hashedPassword) => {
      console.log('Hashed Password: ', hashedPassword);
      User.createUser(name, email, hashedPassword);
      jwt.sign({ email, password }, 'Do Not Open', (err, encryptedPayload) => {
        res.cookie('userToken', encryptedPayload, { httpOnly: true });
        res.status(201).send('Account created.');
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const verifyUser = async(req, res, next) => {
  if (!req.cookies.userToken) {
    return res.status(401).send('Only logged in users can access this page.');
  }
  const payload = jwt.verify(req.cookies.userToken, 'Do Not Open');
  const { userId, password } = payload;

  try {
    const user = await User.getUserById(userId);

    if (!user) {
      return res.status(403).send('Unauthorized User: User does not exist.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      return next();
    }

    return res.status(403).send('Unauthorized User: Password is incorrect.');
  }
  catch (err) {
    console.log(err);
    return res.send(err);
  }
};

module.exports = {
  createUser,
  verifyUser,
};
