import fs from 'fs/promises';
import { ObjectId, WithId } from 'mongodb';
import path from 'path';
import sharp from 'sharp';
import { ImageQueries } from '../src/routes/api/media';
import client from './mongodb';

export const designData = async (img: ImageQueries): Promise<any> => {
  try {
    const designData = await client
      .db()
      .collection('designs')
      .findOne({ _id: new ObjectId(img.design as string) });

    if (!designData) return false;

    await fs.access(
      path.join(__dirname, `../assets/designs/${designData.fileName}`)
    );
    return designData as WithId<Document>;
  } catch (error) {
    return false;
  }
};

export const isDesignAvalible = async (img: ImageQueries): Promise<Boolean> => {
  try {
    await fs.access(
      path.join(__dirname, `../assets/designs/${img.design}.png`)
    );
    return true;
  } catch (error) {
    return false;
  }
};

export const checkMediaDir = async (img: ImageQueries): Promise<boolean> => {
  try {
    await fs.access(
      path.join(__dirname, `../assets/final-products/${img.design}`)
    );
  } catch (error) {
    await fs.mkdir(
      path.join(__dirname, `../assets/final-products/${img.design}`)
    );
  } finally {
    try {
      await fs.access(
        path.join(
          __dirname,
          `../assets/final-products/${img.design}/${img.type}`
        )
      );

      return false;
    } catch (error) {
      await fs.mkdir(
        path.join(
          __dirname,
          `../assets/final-products/${img.design}/${img.type}`
        )
      );
      return true;
    }
  }
};

export const isImageAvalible = async (img: ImageQueries): Promise<Boolean> => {
  try {
    await fs.access(
      path.join(
        __dirname,
        `../assets/final-products/${img.design}/${img.type}/${img.color}.png`
      )
    );
    return true;
  } catch (error) {
    return false;
  }
};

export const imageProcessing = async (
  img: ImageQueries,

  preview: Boolean
) => {
  try {
    const designPath = path.join(
      __dirname,
      `../assets/designs/${img.design}.png`
    );
    const blankProductPath = path.join(
      __dirname,
      `../assets/blank-products/${img.type}/${img.color}.png`
    );
    const finalProductPath = path.join(
      __dirname,
      `../assets/final-products/${img.design}/${img.type}/${img.color}.png`
    );
    const previewProductPath = path.join(
      __dirname,
      `../assets/preview-products/${img.design}-${img.type}-${img.color}.png`
    );

    const resize = img.size ? Math.round(670 * (img.size / 100)) : 670;

    const designBuffer = await sharp(designPath).resize(resize).toBuffer();
    // const designBuffer = await sharp(designPath).resize(329).toBuffer();

    await sharp(blankProductPath)
      .composite([
        {
          input: designBuffer,
          top: 585,
          left: Math.round((2000 - resize) / 2),
          // left: 670,
        },
      ])
      // .composite([{ input: designBuffer, top: 300, left: 295 }])
      .png({ compressionLevel: 9, quality: 80 })
      .toFile(preview ? previewProductPath : finalProductPath);
  } catch (error) {
    console.log(
      '🚀 ~ file: media-util.ts:116 ~ imageProcessing ~ error',
      error
    );
    // throw new Error(`${error as String}`);
    throw error;
  }
};

export const createFinalProductImages = async (
  img: {
    designId: string;
    designName: string;
    type: string;
    color: string;
    size: number;
  },
  preview: Boolean
) => {
  try {
    const designPath = path.join(
      __dirname,
      `../assets/designs/${img.designName}.png`
    );
    const blankProductPath = path.join(
      __dirname,
      `../assets/blank-products/${img.type}/${img.color}.png`
    );
    const finalProductPath = path.join(
      __dirname,
      `../assets/final-products/${img.designId}/${img.type}/${img.color}.png`
    );
    const previewProductPath = path.join(
      __dirname,
      `../assets/preview-products/${img.designId}-${img.type}-${img.color}.png`
    );

    const resize = Math.round(670 * (img.size / 100));

    const designBuffer = await sharp(designPath).resize(resize).toBuffer();
    // const designBuffer = await sharp(designPath).resize(329).toBuffer();

    await sharp(blankProductPath)
      .composite([
        {
          input: designBuffer,
          top: 585,
          left: Math.round((2000 - resize) / 2),
        },
      ])
      // .composite([{ input: designBuffer, top: 300, left: 295 }])
      .png({ compressionLevel: 9, quality: 80 })
      .toFile(preview ? previewProductPath : finalProductPath);
  } catch (error) {
    console.log(
      '🚀 ~ file: media-util.ts:116 ~ imageProcessing ~ error',
      error
    );
    // throw new Error(`${error as String}`);
    throw error;
  }
};
