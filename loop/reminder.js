import { reminder, last_time, sequelize, remind_string } from "../models/utilities.js";
import { generalLogger } from "../utils/logger.js";
import { Op, QueryTypes  } from "sequelize";
import Sequelize from 'sequelize';

export default async (client) => {
    // get 24 hour ago in unix timestamp
    const remindTime = Math.floor((new Date().getTime() - (24*60*60*1000))/1000);

    // get all remind string that are enabled
    const remindString = await remind_string.findAll({
        where: {
            enable: 1
        }
    });
    // get all user in last_time table with time older than 24 hours
    // const users = last_time.findAll({
    //     where: {
    //         time: {
    //             [Op.lte]: remindTime,
    //         },
    //     },
    //     include: [{
    //         model: reminder,
    //         where:{
    //             reminded: 0,
    //             remind_switch: 1,
    //         },
    //         required: false,
    //     }]
    // });
    const users = await sequelize.query(`SELECT last_time.* 
        FROM last_time 
        LEFT JOIN reminder ON last_time.id=reminder.id 
        WHERE last_time.time <= ${remindTime} 
            AND reminder.remind_switch = 1 
            AND reminder.reminded = 0`, 
            {
                models: last_time,
                mapToModel: true,
            }
        );

    console.log(users[0][0]);

    for (const user of users[0]){
        // console.log(user.channel)
        // select a random remind string
        const askString =  remindString[Math.floor(Math.random() * remindString.length)];
        // build the message by inject user name into the askString
        const message = askString.message.replace("{user}", "<@" + user.id + ">");
        // send the message
        client.channels.fetch(user.channel).then(channel => {
            channel.send(`${message}`);
            generalLogger("reminded user: " + user.id);
            // find the user in reminder table and update reminded to 1
            reminder.update({
                reminded: 1,
            }, {
                where: {
                    id: user.id,
                }
            }).then((result) => {
                generalLogger("updated user: " + user.id);
            });
        }).catch(error =>{
            // console.log("fail to get channel", user.channel);
            // generalLogger("fail to remind user: ", user.id);
            // console.error(error)
        });

    }

}