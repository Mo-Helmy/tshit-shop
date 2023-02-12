import { getToken } from 'next-auth/jwt';
import { authOptions } from './auth/[...nextauth]';

export default async (req, res) => {
  if (req.method !== 'GET') return;
  try {
    const user = await getToken({ req, decode: authOptions.jwt.decode });
    console.log('🚀 ~ file: get-token.js:5 ~ user', user);

    const jwt = await getToken({ req, raw: true });
    console.log('🚀 ~ file: get-token.js:10 ~ jwt', jwt);

    res.status(200).json({ user, jwt });
  } catch (error) {
    res.status(404).json({ message: 'user not found' });
  }

  //   if (token) {
  //     res.status(200).json({ token });
  //   } else {
  //     res.status(400).json({ token });
  //   }
};
