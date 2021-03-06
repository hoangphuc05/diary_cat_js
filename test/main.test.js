
import fs from 'fs';

import DiscordSelfWrapper from './user_driver';
import {client as realClient} from '../index';
import { sequelize } from '../models/utilities';
import { createRequire } from "module";
const require = createRequire(import.meta.url);  
const { user_token } = require ('./config_test.json');

import {jest} from '@jest/globals';

const messageTestFiles = fs.readdirSync('./test/message_tests');

const client = new DiscordSelfWrapper(user_token);
jest.setTimeout(25000);
beforeAll(done => {
    client.client.on('ready', () => {
        console.log("==============Userbot ready==============");
        client.setTestChannel("828001338625490944").then(() => {
            done();
        });
    })
    client.login();
});

afterAll((done) => {
    client.client.destroy();
    realClient.destroy();
    sequelize.close();
    done();
})



for (const file of messageTestFiles) {
    const testFile = await import(`./message_tests/${file}`);
    // console.log(testFile.execute);
    testFile.default.execute(client);
}

