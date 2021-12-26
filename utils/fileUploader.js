import {file} from 'tmp-promise';
import PathTool from 'path';

import Url from 'url';
import Path from 'path';

import https from 'https';
import fs from 'fs';

//for image checking
import {readChunk} from 'read-chunk';
import {fileTypeFromBuffer} from 'file-type'; // https://github.com/sindresorhus/image-type
import imageType from 'image-type'; // https://github.com/sindresorhus/image-type


// for uploading to s3
import {s3Upload} from './aws.js';

const uploadFile = async (discordUrl) => {
        //https://stackoverflow.com/questions/10865347/node-js-get-file-extension
        // var result = Path.extname(Url.parse(url).pathname); // '.jpg'

        const {fd, path, cleanup} = await file({ dir: './tmp-diary-bot'});

        const fileStream = fs.createWriteStream(path);
        const request = await new Promise((resolve, reject) => {
            https.get(discordUrl, (response) => {
                response.pipe(fileStream);
                // resolve(response);
                response.on('close', async () => {
                    fileStream.close();
                    const buffer = await readChunk(path,{length:12});
                    const imgType = imageType(buffer);
                    if (!imgType) {
                        cleanup();
                        return resolve(null);
                    }
                    return s3Upload(path, imgType.ext).then(fileKey => {
                        cleanup();
                        resolve(fileKey);
                    });
                })

                response.on('error', (err) => {
                    cleanup();
                    // console.log(err);
                    resolve(null);
                });
            });

                
            });
            // console.log(request);
            return request;
        };


        


// uploadFile('https://hphucs.me/dailyPics/uploads/2021_11_13042d13ff2a576e4b58627dd563a9416e1ce325a6fff96f7d31e71388f2462d1d.jpg').then(result => console.log(result));
export {uploadFile};