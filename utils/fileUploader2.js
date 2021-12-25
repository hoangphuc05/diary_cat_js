import {file} from 'tmp-promise';
import {DownloaderHelper } from 'node-downloader-helper';
import PathTool from 'path';

import Url from 'url';
import Path from 'path';

//for image checking
import {readChunk} from 'read-chunk';
import imageType from 'image-type'; // https://github.com/sindresorhus/image-type

// for uploading to s3
import {s3Upload} from './aws.js';

const uploadFile = async (discordUrlList) => {
    return Promise.all(discordUrlList.map(async (discordUrl) => {
        //https://stackoverflow.com/questions/10865347/node-js-get-file-extension
        // var result = Path.extname(Url.parse(url).pathname); // '.jpg'

        const {fd, path, cleanup} = await file({ dir: './tmp-diary-bot'});
        const downloader = new DownloaderHelper(discordUrl, PathTool.dirname(path), {fileName: PathTool.basename(path), override: true});

        // console.log(downloader);
        downloader.on('end',async () => {
            
            // check if the downloaded file is a proper image
            const buffer = await readChunk(path,{length:12});
            const imgType = imageType(buffer);
            
            // if not an image, delete the file and return null
            if (!imgType) {
                console.log('Not an image');
                cleanup();
                return Promise.resolve(null);
            }

            //else upload the image to s3 and return the name of the image
            s3Upload(path, imgType.ext).then(fileKey => {
                cleanup();
                return Promise.resolve(fileKey);
            });

        });
        downloader.on('error',(err) => {
            console.log(err);
            return Promise.reject(null);
        });
        downloader.start();


    }));

    // console.log(path);

}
uploadFile(['https://hphucs.me/dailyPics/uploads/2021_11_13042d13ff2a576e4b58627dd563a9416e1ce325a6fff96f7d31e71388f2462d1d.jpg', 'https://google.com']).then(result => console.log(result));