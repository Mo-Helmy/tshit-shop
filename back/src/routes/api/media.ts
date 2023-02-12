import express, { Router } from 'express';
import fs from 'fs/promises';
import { JwtPayload, verify } from 'jsonwebtoken';
import { ObjectId, WithId } from 'mongodb';
import path from 'path';
import { dbConnect } from '../../../util/db-util';
import {
  checkMediaDir,
  createFinalProductImages,
  designData,
  imageProcessing,
  isDesignAvalible,
  isImageAvalible,
} from '../../../util/media-util';
import client from '../../../util/mongodb';
import {
  authenticate,
  authorize,
  isDesignerAuth,
} from '../../middleware/authentication';
import { uploadDesign } from '../../middleware/multer';

const mediaRoute = express.Router();

const designsCollection1 = client.db().collection('designs');
const productsCollection1 = client.db().collection('products');

export interface ImageQueries {
  design: String;
  type?: String;
  color?: String | String[];
  preview?: String;
  size?: number;
}

mediaRoute.post(
  '/',
  async (
    req: express.Request,
    res: express.Response
  ): Promise<void | express.Response> => {
    const imageQueries: ImageQueries = {
      design: req.body.design as String,
      type: req.body.type as String,
      color: req.body.color as String | String[],
      size: +(req.body.size as String),
    };
    try {
      const { design, type, color, size = 100 } = imageQueries;

      if (!imageQueries.design || !imageQueries.type || !imageQueries.color)
        return res
          .status(400)
          .json({ error: 'please enter a valid query {design, color, type}' });

      // check if design available in database and server
      const fetchedDesignData = await designData(imageQueries);
      if (!fetchedDesignData)
        return res.status(400).json({
          error:
            'design id is not available in database or design file is not avalible on server',
        });

      //check & create final product dir
      const isProductTypeDirCreated = await checkMediaDir(imageQueries);

      // if (!isProductTypeDirCreated)
      //   return res
      //     .status(400)
      //     .json({ error: 'product type dir already exist' });

      const colorsQueryArr = (color as String[]).map((color) => ({
        designId: fetchedDesignData._id.toString() as string,
        designName: fetchedDesignData.fileName.split('.')[0] as string,
        type: type as string,
        color: color as string,
        size,
      }));
      console.log('🚀 ~ file: media.ts:69 ~ colorsQueryArr', colorsQueryArr);

      // colorsQueryArr.map(async (img) => {
      //   try {
      //     await imageProcessing(img, false);
      //   } catch (error) {
      //     res.status(400).json({ error: `${error}` });
      //     // throw new Error(`${error as String}`);
      //     throw error;
      //   }
      // });

      for (let i = 0; i < colorsQueryArr.length; i++) {
        await createFinalProductImages(colorsQueryArr[i], false);
      }
      const files = await fs.readdir(
        path.join(__dirname, `../../../assets/final-products/${design}/${type}`)
      );

      console.log('🚀 ~ file: media.ts:83 ~ files', files);

      res
        .status(201)
        .json({ message: 'final product images created successuflly!', files });
    } catch (error) {
      console.log('🚀 ~ file: media.ts:45 ~ error', error);
      res.status(400).json({ error: `${error}` });
    }
  }
);

// /api/media?design=1&color=black -- Route Example
mediaRoute.get(
  '/',
  async (req: express.Request, res: express.Response): Promise<void> => {
    const imageQueries: ImageQueries = {
      design: req.query.design as String,
      type: req.query.type as String,
      color: req.query.color as String,
      preview: req.query.preview as String,
    };
    const { design, type, color } = imageQueries;

    if (!imageQueries.design || !imageQueries.type || !imageQueries.color) {
      res
        .status(400)
        .json({ error: 'please enter a valid query {design, color, type}' });
      return;
    }

    if (!(await isDesignAvalible(imageQueries))) {
      res.status(400).json({ error: 'design is not available' });
      return;
    }

    await checkMediaDir(imageQueries);

    const isImgAvalible = await isImageAvalible(imageQueries);

    if (isImgAvalible) {
      res
        .status(200)
        .sendFile(
          path.join(
            __dirname,
            `../../../assets/final-products/${design}/${type}/${color}.png`
          )
        );
      return;
    }

    try {
      await imageProcessing(imageQueries, false);
      res
        .status(200)
        .sendFile(
          path.join(
            __dirname,
            `../../../assets/final-products/${design}/${type}/${color}.png`
          )
        );
      return;
    } catch (error) {
      res.status(400).json({ message: `${error}` });
    }
  }
);

//results
// "/api/media/preview?design=<filename>"
// "/api/media/preview?design=<filename>&type=tshirt&color=<color>"
mediaRoute.get('/preview', async (req, res) => {
  try {
    const imagePreviewQueries: ImageQueries = {
      design: req.query.design as String,
      type: req.query?.type as String,
      color: req.query?.color as String,
      size: +(req.query?.size as String),
    };

    const { design, type, color, size = 100 } = imagePreviewQueries;

    if (!design) {
      res
        .status(400)
        .json({ error: 'please enter a valid query {design, color, type}' });
      return;
    }

    if (!(await isDesignAvalible(imagePreviewQueries))) {
      res.status(400).json({ error: 'design is not available' });
      return;
    }

    if (design && !type && !color) {
      res
        .status(200)
        .sendFile(
          path.join(__dirname, `../../../assets/designs/${design}.png`)
        );
    }
    if (design && type && color) {
      await imageProcessing(imagePreviewQueries, true);

      res
        .status(200)
        .sendFile(
          path.join(
            __dirname,
            `../../../assets/preview-products/${design}-${type}-${color}.png`
          )
        );
      fs.rm(
        path.join(
          __dirname,
          `../../../assets/preview-products/${design}-${type}-${color}.png`
        )
      );
    }
  } catch (error) {
    res.status(400).json({ message: `${error}` });
  }
});

//get all designs
//get all designs tags /api/media/design?tags=1
//didn't used yet and need authentication
mediaRoute.get('/design', async (req, res) => {
  try {
    if (req.query.tags === '1') {
      const tagsArray = await client
        .db()
        .collection('designs')
        .distinct('tags');

      res.status(200).json(tagsArray);
      return;
    }

    const designsArray = await client
      .db()
      .collection('designs')
      .find()
      .toArray();

    res.status(200).json(designsArray);
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
});

//get all designs tags /api/media/design?tags=1
mediaRoute.get('/design/tags', async (req, res) => {
  try {
    const tagsArray = await client.db().collection('designs').distinct('tags');

    res.status(200).json(tagsArray);
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
});

//get all designs by userId
mediaRoute.get('/design/:userId', authorize, async (req, res) => {
  try {
    const userDesigns = await client
      .db()
      .collection('designs')
      .find({ userId: req.params.userId })
      .toArray();

    res.status(200).json(userDesigns);
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
});

// add new design
mediaRoute.post(
  '/add-design',
  uploadDesign.array('designs', 10),
  isDesignerAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      const filesArr = req.files as Express.Multer.File[];

      const docArr = filesArr.map((file: Express.Multer.File) => {
        const title = file?.originalname.split('.')[0].replaceAll('-', ' ');
        return {
          fileName: file.filename,
          title,
          format: req.body.format,
          tags: req.body.tags,
          userId: req.body.userId,
        };
      });

      console.log(docArr);

      const insertResult = await client
        .db()
        .collection('designs')
        .insertMany(docArr);

      res.status(201).json(insertResult);
    } catch (error) {
      res.status(400).json({ error: `${error}` });
    }
  }
);

//comented
//get single design
// mediaRoute.get('/design/:designId', async (req, res) => {
//   const designId = req.params.designId;

//   let designFileName;

//   await dbConnect('designs', async (collection) => {
//     const selectedDesign = await collection.findOne({
//       _id: new ObjectId(designId),
//     });
//     if (!selectedDesign) {
//       res.status(404).json({ error: 'design not available' });
//       return;
//     }
//     designFileName = selectedDesign.fileName;
//   });

//   try {
//     const designPath = path.join(
//       __dirname,
//       `../../../assets/designs/${designFileName}`
//     );
//     await fs.access(designPath);
//     res.status(200).sendFile(designPath);
//   } catch (error) {
//     res.status(404).json({ error: 'design not available' });
//   }
// });

//delete single design and all related products
mediaRoute.delete('/design/:designId', authenticate, async (req, res) => {
  // mediaRoute.delete('/:designId', async (req, res) => {
  const designId = req.params.designId;
  const token = req.headers.authorization;
  try {
    const payload = verify(token as string, process.env.TOKEN_SECRET as string);

    const deleteDesignResult = await client
      .db()
      .collection('designs')
      .findOneAndDelete({
        _id: new ObjectId(designId),
        userId: (payload as JwtPayload).id,
      });
    console.log(
      '🚀 ~ file: media.ts:274 ~ //mediaRoute.delete ~ deleteDesignResult',
      deleteDesignResult
    );

    if (deleteDesignResult.ok === 0)
      return res.status(404).json({ error: 'designId with userId not found!' });

    if (
      deleteDesignResult.ok === 1 &&
      deleteDesignResult.value?._id.toString() === designId
    )
      await fs.rm(
        path.join(
          __dirname,
          `../../../assets/designs/${deleteDesignResult.value?.fileName}`
        ),
        { recursive: true, force: true }
      );

    const deleteProductsResult = await client
      .db()
      .collection('products')
      .deleteMany({
        designId: designId,
        userId: (payload as JwtPayload).id,
      });
    console.log(
      '🚀 ~ file: media.ts:297 ~ //mediaRoute.delete ~ deleteProductsResult',
      deleteProductsResult
    );

    if (deleteProductsResult.acknowledged === true)
      await fs.rm(
        path.join(__dirname, `../../../assets/final-products/${designId}`),
        { recursive: true, force: true }
      );

    res.status(200).json({
      message: `${designId} design and all its product deleted successfully!`,
    });
  } catch (error) {
    console.log('🚀 ~ file: media.ts:316 ~ //mediaRoute.delete ~ error', error);
    res.status(400).json({ error: `${error}` });
  }
});

export default mediaRoute;
