import express from 'express';
import { ObjectId } from 'mongodb';
import { dbConnect } from '../../../util/db-util';
import client from '../../../util/mongodb';
import { authorize } from '../../middleware/authentication';

const userRoutes = express.Router();

// const usersCollection = client.db().collection('users');

userRoutes.get('/:userId/data', authorize, async (req, res) => {
  // userRoutes.get('/:userId/data', async (req, res) => {
  try {
    const user = await client
      .db()
      .collection('users')
      .findOne({
        _id: new ObjectId(req.params.userId),
      });

    if (user) {
      const userData = {
        favorite: user.favorite,
        cart: user.cart,
        addresses: user.addresses,
      };

      res.status(200).json({ userData });
    } else {
      res.status(404).json({ error: 'user not found!' });
    }
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
});

userRoutes.post('/:userId/data', authorize, async (req, res) => {
  // userRoutes.post('/:userId/data', async (req, res) => {
  try {
    if (req.body.favorite) {
      const favProducts = await client
        .db()
        .collection('users')
        .findOneAndUpdate(
          {
            _id: new ObjectId(req.params.userId),
          },
          { $set: { favorite: req.body.favorite } }
        );
    }

    if (req.body.cart) {
      const cart = await client
        .db()
        .collection('users')
        .findOneAndUpdate(
          {
            _id: new ObjectId(req.params.userId),
          },
          { $set: { cart: req.body.cart } }
        );
    }

    if (req.body.addresses) {
      const addresses = await client
        .db()
        .collection('users')
        .findOneAndUpdate(
          {
            _id: new ObjectId(req.params.userId),
          },
          { $set: { addresses: req.body.addresses } }
        );
    }

    res.status(201).json({
      message: `user data updated!`,
      data: {
        favorite: req.body.favorite,
        cart: req.body.cart,
        addresses: req.body.addresses,
      },
    });
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
});

export default userRoutes;
