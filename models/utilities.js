import Sequelize from 'sequelize';
import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const {db_host, db_username, db_password, db_database, reset_limit, add_limit} = await require('../config.json');


const sequelize = new Sequelize(db_database, db_username, db_password, {
    host: db_host,
    dialect: 'mysql',

});


import {default as de} from './daily_entry.js';
export const daily_entry = de(sequelize, Sequelize.DataTypes);

import {default as lt} from './last_time.js';
export const last_time = lt(sequelize, Sequelize.DataTypes);

import {default as r} from './reminder.js';
export const reminder = r(sequelize, Sequelize.DataTypes);

// console.log(last_time.findOne({
//     where: {id:"343046183088029696"}
// }))

export const addEntry = async (author, message, url, name, channel) => {
    let streak_value;
    // find thhe steak or create a new one
    const user_last_time = await last_time.findOne({
        where: {id: author}
    })

    // if there's a streak, check if it need to be reset by the time
    if (user_last_time){
        const last_time = user_last_time.time;
        const current_time = new Date().getTime();
        const time_difference = current_time - last_time;
        console.log(time_difference > reset_limit) ;
        // if the difference is greater than the reset limit, reset the streak and set the current time
        user_last_time.time = current_time;
        if (time_difference < add_limit){
            //do nothing with the streak
        }
        else if (time_difference > reset_limit){
            // console.log("reset called");
            user_last_time.streak = 1;
            user_last_time.save();
        } else {
            user_last_time.streak += 1;
            user_last_time.save();
        }
        streak_value = user_last_time.streak;
        user_last_time.time = current_time; //save the current time regardless
        user_last_time.save();
    } // if there's no streak, create a new one
    else {
        await last_time.create({
            id: author,
            time: new Date().getTime(),
            streak: 1,
            channel: channel
        });
        streak_value = 1;
    }

    // create the entry
    await daily_entry.create({
        author: author,
        date: new Date().getTime(),
        message: message,
        url: url,
        name: name,
    })

    return streak_value
}

// Reflect.defineProperty(daily_entry.prototype, 'addEntry',{
//     value: async function 
// })
// export const addEntry = addEntry;
// module.exports = { daily_entry, last_time, reminder };