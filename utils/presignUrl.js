import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; 
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {s3Client} from './aws.js';

export const presignUrl = async (fileKey) => {
    const params = {
        Bucket: 'diary-bot',
        Key: fileKey
    }
    try{
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params), {
            expiresIn: 3600 ,
        });
        return url;
    } catch (err) {
        console.log(err);
        return null;
    }
}
