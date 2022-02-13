import Discord from 'discord.js-selfbot';


class DiscordSelfWrapper {
    timeOut = 5000;
    constructor(token) {
        this.client = new Discord.Client();
        this.token = token;
        // this.client.login(token);
    }

    async login() {
        return new Promise(resolve => {
            this.client.on('ready', () => {
                // console.log('I am ready!');
                resolve();
            });
            this.client.login(this.token);
        });
    }
    
    
    async setTestChannel(channel_id) {
        this.testChannel = await this.client.channels.fetch(String(channel_id));
    }

    async sendTestMessage( message) {
        return new Promise(resolve => {
            this.testChannel.send(message).then(message => {
                resolve();
            })
        });
    }

    async sendImageMessage(message, image_path = "./__mocks__/test.png") {
        return new Promise((resolve, reject) => {
            this.testChannel.send(message, {files: [{
                attachment: image_path,
                name: "test.png",
                description: "Test image"
            }]}).then(message => {
                resolve();
            }).catch(error => reject());
        });
    }

    async getNextMessage() {
        return new Promise((resolve, reject) => {
            this.testChannel.awaitMessages(m => true, {max: 1, time: this.timeOut, errors: ['time']})
                .then(collected => {
                    resolve(collected.first());
                }).catch(collected => reject());
        });
        // return await this.testChannel.awaitMessages(m => true, {max: 1, time: this.timeOut, errors: ['time']});
    }

    async getNextMessageFrom(user_id) {
        return new Promise((resolve, reject) => {
            this.testChannel.awaitMessages(m => m.author.id === user_id, {max: 1, time: this.timeOut, errors: ['time']})
                .then(collected => {
                    resolve(collected.first());
                }).catch(collected => reject());
        });
    }
}

export default DiscordSelfWrapper;