import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; 
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {s3Client} from './aws.js';
import cloudFront from 'aws-cloudfront-sign';
import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const { key_pair_id} = require ('./../config.json');

// export const presignUrl = async (fileKey) => {
//     const params = {
//         Bucket: 'diary-bot',
//         Key: fileKey
//     }
//     try{
//         const url = await getSignedUrl(s3Client, new GetObjectCommand(params), {
//             expiresIn: 3600 ,
//         });
//         return url;
//     } catch (err) {
//         console.log(err);
//         return null;
//     }
// }


export const presignUrl = async (fileKey) => {
    // generate signed url for cloudfront from the file key
    const signingParams = {
        keypairId: key_pair_id,
        // privateKeyString: keyString,
        privateKeyPath: './key/private_key.pem',
        expire: new Date().getTime() + 1*60*60*1000,
    };
    const signUrl = await cloudFront.getSignedUrl(
        `https://d23rmf6k57cbl6.cloudfront.net/${fileKey}`,
        // signingParams,
        signingParams
    );
    return signUrl;
}

// presignUrl('2020_08_02.png').then(console.log);
// console.log(presignUrl);
