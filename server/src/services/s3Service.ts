import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
} as S3ClientConfig);

// AWS S3 Single upload image
// export const s3Uploadv3Image = async (file: Express.Multer.File) => {
//   const key = `uploads/${uuidv4()}-${file.originalname}`;
//   const param = {
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Key: key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   // Upload the file to S3
//   await s3.send(new PutObjectCommand(param));

//   return { key, status: "success" };
// };

// // AWS S3 Multiple upload image
export const s3Uploadv3Images = async (files: Express.Multer.File[]) => {
  const params = files.map((file) => {
    const key = `uploads/${uuidv4()}-${file.originalname}`;
    return {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      key, // Include the key in the return object for tracking
    };
  });

  const uploadResults = await Promise.all(
    params.map(async (param) => {
      await s3.send(new PutObjectCommand(param)); // Send the upload
      return { key: param.key }; // Return the key
    })
  );

  return uploadResults;
};
