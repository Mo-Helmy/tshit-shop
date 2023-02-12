import JWT from 'jsonwebtoken';
import getCollection from '../../../util/mongodb';

export default async (req, res) => {
  console.log('🚀 ~ file: verify.js:3 ~ req.query.token', req.query.token);

  if (!req.query.token) return res.status(401).json({ error: 'invalid token' });

  try {
    const payload = JWT.verify(req.query.token, process.env.NEXTAUTH_SECRET);
    console.log('🚀 ~ file: verify.js:8 ~ payload', payload);

    const usersCollection = await getCollection('users');

    const existingUser = await usersCollection.findOne({
      email: payload.email,
    });

    if (!existingUser) return res.status(401).json({ error: 'user not found' });

    const userUpdate = await usersCollection.updateOne(
      { email: payload.email },
      { $set: { status: 'verified' } }
    );

    console.log('🚀 ~ file: verify.js:20 ~ userUpdate', userUpdate);

    res.redirect('/auth/login');
  } catch (error) {
    res.status(401).json({ error: 'authentication failed! ' + `${error}` });
  }
  //   res.send({ token: req.query.token });
};
