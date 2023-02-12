import getCollection from '../../../util/mongodb';
import { hash } from 'bcrypt';
import sendgrid from '../../../util/sendgrid';
import JWT from 'jsonwebtoken';
import { clientUrl } from '../../../util/link-config';

export default async (req, res) => {
  if (req.method !== 'POST') return;

  const { firstname, lastname, username, email, password } = req.body;

  console.log({ firstname, lastname, username, email, password });

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,10})+$/g;
  const usernameRegex = /^[A-Za-z0-9][A-Za-z0-9.@_-]{3,30}$/g;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,}$/g;

  //server validation
  if (
    !(
      emailRegex.test(email.trim()) &&
      usernameRegex.test(username.trim()) &&
      passwordRegex.test(password.trim())
    )
  ) {
    res.status(422).json({ error: 'invalid email or password or username' });
    return;
  }

  const usersCollection = await getCollection('users');

  // const existingEmail = await usersCollection.findOne({ email: email });
  // const existingUsername = await usersCollection.findOne({
  //   username: username,
  // });

  // if (existingEmail) {
  //   res.status(422).json({ error: 'email already exist!' });
  //   return;
  // }
  // if (existingUsername) {
  //   res.status(422).json({ error: 'username already exist!' });
  //   return;
  // }

  try {
    const hashedPass = await hash(password + process.env.BCRYPT_SECRET, 12);

    const createdUser = await usersCollection.insertOne({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      username: username.trim(),
      email: email.trim(),
      password: hashedPass,
      role: 'user',
      provider: 'credentials',
      favorite: [],
      cart: { items: [], totalPrice: 0, totalQuantity: 0 },
      addresses: [],
      status: 'pending',
    });
    console.log('🚀 ~ file: signup.js:44 ~ createdUser', createdUser);

    const token = JWT.sign({ email }, process.env.NEXTAUTH_SECRET, {
      expiresIn: '1h',
    });

    sendgrid.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Godzilla email verification',
      html: `<p>Your account was created succeffully</p>
      <P>please click this<a href="${clientUrl}/api/auth/verify?token=${token}">link</a> to verify your email within 1 hour.</p>
      `,
    });

    res.status(201).json({ message: 'user created' });
  } catch (error) {
    res.status(422).json({ error });
  }
};
