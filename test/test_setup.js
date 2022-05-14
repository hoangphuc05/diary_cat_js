import Sequelize from 'sequelize';
import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const {db_host, db_username, db_password, db_database, reset_limit, add_limit} = await require('../__mocks__/config.json');


export default async function setup() {
    console.log("db_username:", db_username);
    
    //safety net cause I don't trust myself
    if (db_username === "dbmasteruser")
        return;

    const sequelize = new Sequelize(db_database, db_username, db_password, {
        host: db_host,
        dialect: 'mysql',
        logging: false,
    });
    

    // return new Promise(async (resolve, reject) => {
    //     client.client.on('ready', () => {
    //         console.log("==============Userbot ready==============");
    //         client.setTestChannel("828001338625490944").then(() => {
    //             global.client = client;
    //             resolve(client);
    //         });
    //     })
    //     client.login();
    // })
}

