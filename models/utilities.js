import Sequelize from 'sequelize';
import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const {db_host, db_username, db_password, db_database, reset_limit, add_limit} = await require('../config.json');


export const sequelize = new Sequelize(db_database, db_username, db_password, {
    host: db_host,
    dialect: 'mysql',
    logging: false,
});


import {default as de} from './daily_entry.js';
export const daily_entry = de(sequelize, Sequelize.DataTypes);

import {default as lt} from './last_time.js';
export const last_time = lt(sequelize, Sequelize.DataTypes);

import {default as r} from './reminder.js';
export const reminder = r(sequelize, Sequelize.DataTypes);

import {default as rs} from './remind_string.js';
export const remind_string = rs(sequelize, Sequelize.DataTypes);

import {default as anm} from './announcement.js';
export const announcement = anm(sequelize, Sequelize.DataTypes);

import {default as anr} from './announcement_read.js';
export const announcement_read = anr(sequelize, Sequelize.DataTypes);

// console.log(last_time.findOne({
//     where: {id:"343046183088029696"}
// }))

// create associations
// reminder.belongsTo(daily_entry, {foreignKey: 'id'});

export const addEntry = async (author, message, url, name, channel) => {

    // if url is null, entry should be ignored
    if (url == null){
        return -1;
    }
    
    let streak_value;
    // find thhe steak or create a new one
    const user_last_time = await last_time.findOne({
        where: {id: author}
    })

    // if there's a streak, check if it need to be reset by the time
    if (user_last_time){
        // find the reminder of that user
        const user_reminder = await reminder.findOne({
            where: {id: author}
        })
        const last_time = user_last_time.time;
        const current_time = Math.floor(Date.now()/1000);
        // console.log("Current time is: " + current_time);
        const time_difference = current_time - last_time;
        // console.log(time_difference > reset_limit) ;
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
        user_last_time.channel = channel;
        user_last_time.time = current_time; //save the current time regardless
        user_last_time.save();
        
        // if reminder exist, set reminded to 0
        if (user_reminder){
            user_reminder.reminded = 0;
            user_reminder.save();
        } // if reminder doesn't exist, create one
        else {
            await reminder.create({
                id: author,
                reminded: 0,
                remind_switch: 1
            });
        }
    } // if there's no streak, create a new one
    else {
        await last_time.create({
            id: author,
            time: Math.floor(Date.now()/1000),
            streak: 1,
            channel: channel
        });
        await reminder.create({
            id: author,
            reminded: 0,
            remind_switch: 1
        });
        streak_value = 1;
    }

    // create the entry
    await daily_entry.create({
        author: author,
        date: Date.now(),
        message: message,
        url: url,
        name: name,
    })

    return streak_value
}

export const getUnreadAnnouncement = async (userId) => {
    // find the latest announcement 
    // const latest_announcement = await announcement.findOne({
    //     order: [['id', 'DESC']]
    // })
    const latest_announcement = await sequelize.query(`
        SELECT *
        FROM diarybot.announcement
        WHERE NOT EXISTS (
            SELECT *
            FROM diarybot.announcement_read
            WHERE announcement_id = (
                SELECT id
                FROM diarybot.announcement
                ORDER BY id DESC
                LIMIT 1
            ) AND user_id = :userId
        )
        ORDER BY id DESC
        LIMIT 1`,{
            replacements: {userId: userId},
            model: announcement,
            mapToModel: true
        });

    return latest_announcement;
}