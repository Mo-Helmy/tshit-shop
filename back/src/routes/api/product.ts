import express from 'express';
import { Collection, ObjectId } from 'mongodb';
import { dbConnect } from '../../../util/db-util';
import client from '../../../util/mongodb';
import { authorize, isDesignerAuth } from '../../middleware/authentication';

const productRoutes = express.Router();

// get all products
productRoutes.get('/', async (req, res) => {
  const designId = req.query.design_id as String;

  const page = req.query.page ? +req.query.page : 1;
  const pageSize = 5;

  const showmore = req.query.showmore ? +req.query.showmore : 1;

  const sort = req.query.sort;
  const colors = req.query.colors
    ? (req.query.colors as string).split(',')
    : null;
  const tags = req.query.tags ? (req.query.tags as string).split(',') : null;
  const types = req.query.types ? (req.query.types as string).split(',') : null;

  try {
    //by designId
    if (designId) {
      const result = await client
        .db()
        .collection('products')
        .find({ designId })
        .toArray();
      res.status(200).json({ products: result });

      return;
    }

    if (req.query.search) {
      const result = await client
        .db()
        .collection('products')
        .find({ $text: { $search: req.query.search as string } })
        .project({ score: { $meta: 'textScore' } })
        .toArray();

      res.status(200).json({ products: result });

      return;
    }

    if (sort || colors || tags || types || req.query.showmore) {
      let findQuery = {};
      colors
        ? (findQuery = Object.assign(findQuery, { colors: { $in: colors } }))
        : '';
      tags
        ? (findQuery = Object.assign(findQuery, { tags: { $in: tags } }))
        : '';
      types
        ? (findQuery = Object.assign(findQuery, { type: { $in: types } }))
        : '';

      const result = await client
        .db()
        .collection('products')
        .find(findQuery)
        .sort(
          sort ? (sort === 'recent' ? { _id: -1 } : { _id: 1 }) : { _id: -1 }
        )
        .limit((showmore + 1) * pageSize)
        .toArray();

      const productList = {
        products: result.slice(0, showmore * pageSize),
        nextProducts: result,
        productCount: await client.db().collection('products').count(findQuery),
      };

      res.status(200).json(productList);

      return;
    }

    //by page
    if (req.query.page) {
      const products = await client
        .db()
        .collection('products')
        .find()
        .sort({ _id: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

      const productCount = await client.db().collection('products').count({});

      const productList = {
        products,
        productCount,
        pageCount: Math.ceil(productCount / pageSize),
      };

      res.status(200).json(productList);

      return;
    }

    //get all products to array
    const products = await client
      .db()
      .collection('products')
      .find()
      .sort({ _id: -1 })
      .toArray();

    res.status(200).json({ products });
  } catch (error) {
    console.log('🚀 ~ file: product.ts:83 ~ productRoutes.get ~ error', error);
    res.status(400).json({ error: `${error}` });
  } finally {
    // client.close();
  }
});

// get all products data (titles, tags)
productRoutes.get('/data', async (req, res) => {
  try {
    const allTitles = await client
      .db()
      .collection('products')
      .distinct('title');
    const allTags = await client.db().collection('products').distinct('tags');

    res.status(200).json({ allTitles, allTags });
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
});

// get single products
productRoutes.get('/:productId', async (req, res) => {
  try {
    const result = await client
      .db()
      .collection('products')
      .findOne({ _id: new ObjectId(req.params.productId) });

    if (result) {
      const user = await client
        .db()
        .collection('users')
        .findOne(
          { _id: new ObjectId(result.userId) },
          { projection: { username: 1 } }
        );
      console.log('🚀 ~ file: product.ts:155 ~ productRoutes.get ~ user', user);

      result.designedBy = user?.username;

      res.status(200).json({ product: result });
    } else {
      res.status(400).json({ error: 'fetch products failed!' });
    }
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
});

// get all products with different ids
productRoutes.post('/all', async (req, res) => {
  const favorite = req.body.favorite;

  try {
    const favoriteObjectIdArr = favorite.map((el: string) => new ObjectId(el));

    const result = await client
      .db()
      .collection('products')
      .find({ _id: { $in: favoriteObjectIdArr } })
      .toArray();

    res.status(200).json({ productList: result });
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
});

//add new product
productRoutes.post('/', isDesignerAuth, async (req, res) => {
  const productDoc = {
    title: req.body.title,
    designId: req.body.designId,
    designSize: req.body.designSize,
    price: 160,
    discount: 120,
    colors: req.body.colors,
    imagesUrl: req.body.imagesUrl,
    userId: req.body.userId,
    tags: req.body.tags,
    type: req.body.type,
  };

  try {
    const result = await client
      .db()
      .collection('products')
      .insertOne(productDoc);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
});

export default productRoutes;
