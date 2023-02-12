import express from 'express';
import { ObjectId } from 'mongodb';
import { dbConnect } from '../../../util/db-util';
import client from '../../../util/mongodb';
import { authorize } from '../../middleware/authentication';

const orderRoutes = express.Router();

// const ordersCollection = client.db().collection('orders');
// const usersCollection = client.db().collection('users');

orderRoutes.get('/:userId', authorize, async (req, res) => {
  // orderRoutes.get('/:userId', async (req, res) => {
  try {
    const orders = await client
      .db()
      .collection('orders')
      .find({ userId: req.params.userId })
      .sort({ _id: -1 })
      .toArray();
    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
});

orderRoutes.post('/:userId', authorize, async (req, res) => {
  // orderRoutes.post('/:userId', async (req, res) => {
  // let cart: { items: any; totalQuantity: any; totalPrice: any };

  try {
    const user = await client
      .db()
      .collection('users')
      .findOne({
        _id: new ObjectId(req.params.userId),
      });

    const cart = user?.cart;

    if (!cart || cart.items?.length === 0) {
      res.status(400).json({ error: 'cart is empety' });
      return;
    }

    const result = await client
      .db()
      .collection('orders')
      .insertOne({
        userId: req.params.userId,
        items: cart.items,
        totalQuantity: cart.totalQuantity,
        cartTotalPrice: cart.totalPrice,
        shippingPrice: 40,
        totalPrice: cart.totalPrice + 40,
        address: req.body.address,
        status: 'pending',
        iat: new Date(),
      });

    res.status(201).json(result);

    await client
      .db()
      .collection('users')
      .findOneAndUpdate(
        {
          _id: new ObjectId(req.params.userId),
        },
        { $set: { cart: { items: [], totalQuantity: 0, totalPrice: 0 } } }
      );
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
});

export default orderRoutes;
