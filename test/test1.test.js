// import { createRequire } from "module";
// const require = createRequire(import.meta.url); 
import {sum} from './test1.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const { user_token } = require ('./config.json');
import {jest} from '@jest/globals';

import Discord from 'discord.js-selfbot';

const client = new Discord.Client();

// wait for self bot to be in
jest.setTimeout(25000);

beforeAll(done => {
    client.on('ready', () => {
        console.log('I am ready!');
        done();
    });
    client.login(user_token);
})

test("test1", () => {
    expect(sum(1,2)).toBe(3);
})

afterAll(() => {
    client.destroy();
})