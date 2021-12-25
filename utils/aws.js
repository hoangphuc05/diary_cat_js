// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html
import dotenv from 'dotenv';

import  { S3Client, PutObjectCommand, CreateBucketCommand, GetObjectCommand } from"@aws-sdk/client-s3";
import { getSignedUrl } from"@aws-sdk/s3-request-presigner";
import fs from 'fs';
import path  from'path';
import {v4} from'uuid';
// const {region} from'../aws_config.json');

dotenv.config();
const s3Client = new S3Client({ "region":process.env.AWS_REGION });



const s3Upload = async (filepath, fileType) => {
    const fileKey = new Date().toISOString().split("T")[0] + "-"+  v4() + "." + fileType;
    const fileStream = fs.createReadStream(filepath);
    const uploadParams = {
        Bucket: 'diary-bot',
        Key: fileKey,
        Body: fileStream
    }
    try{
        await s3Client.send(new PutObjectCommand(uploadParams));
        // if (data){
        //     console.log("upload finished:", data);
        //     return fileKey;
        // }
        return fileKey;

    } catch (err) {
        // console.log(err);
        return null;
    }
}

export {s3Upload};

// s3Upload('C:\\Users\\chphu\\AppData\\Local\\Temp\\tmp-diary-bot\\tmp-16240-bwUJ7jglbm1Z', 'jpg').then(key => console.log(key));