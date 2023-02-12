import express from 'express';
import mediaRoute from './api/media';
import orderRoutes from './api/order';
import productRoutes from './api/product';
import userRoutes from './api/user';

const apiRoute = express.Router();

apiRoute.use('/media', mediaRoute);
apiRoute.use('/products', productRoutes);
apiRoute.use('/users', userRoutes);
apiRoute.use('/orders', orderRoutes);

apiRoute.get('/', (req, res) => {
  res.status(200).json({ message: 'Godzilla Backend' });
});

export default apiRoute;
