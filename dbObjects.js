const Sequelize = require('sequelize');
const {db_host, db_username, db_password, db_database, reset_limit, add_limit} = require('./config.json');


const sequelize = new Sequelize(db_database, db_username, db_password, {
    host: db_host,
    dialect: 'mysql',

});



const daily_entry = require('./models/daily_entry.js')(sequelize, Sequelize.DataTypes);
const last_time = require('./models/last_time.js')(sequelize, Sequelize.DataTypes);
const reminder = require('./models/reminder.js')(sequelize, Sequelize.DataTypes);


const addEntry = async (author, message, url, name, channel) => {
    let streak_value;
    // find thhe steak or create a new one
    const streak = await last_time.findOne({
        where: {id: author}
    })

    // if there's a streak, check if it need to be reset by the time
    if (streak){
        const last_time = streak.time;
        const current_time = Date.now();
        const time_difference = current_time - last_time;
        console.log(time_difference > reset_limit) ;
        // if the difference is greater than the reset limit, reset the streak and set the current time
        streak.time = current_time;
        if (time_difference < add_limit){
            console.log("nothing is done");
            //do nothing with the streak
        }
        else if (time_difference > reset_limit){
            console.log("reset called");
            streak.streak = 1;
            streak.save();
        } else {
            streak.streak += 1;
            streak.save();
        }
        streak_value = streak.streak;
    } // if there's no streak, create a new one
    else {
        await last_time.create({
            id: author,
            time: Date.now(),
            streak: 1,
            channel: channel
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

// Reflect.defineProperty(daily_entry.prototype, 'addEntry',{
//     value: async function 
// })

module.exports = { daily_entry, last_time, reminder, addEntry };