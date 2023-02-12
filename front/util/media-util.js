import sharp from 'sharp';

export const getProductPreviewImage = async (design, productType, color) => {
  const blankProduct = require(`../assets/blank-Products/${productType}/${color}.png`);
  return await sharp(blankProduct)
    .composite([{ input: design, top: 300, left: 295 }])
    .toBuffer();
};
