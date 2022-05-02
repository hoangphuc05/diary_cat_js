import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export default async (applicationID, guildID, channelID, data) => {
    const API_URL = "https://discord.com/api/v9/interactions";

    let payload = {
        "type": 2,
        "application_id": applicationID,
        "guild_id": guildID,
        "channel_id": channelID,
        "data": data,
        "nonce": uuidv4(),
        "session_id": makeid(32)
    };
    if (guildID == null) {
        delete payload.guild_id;
    }

    fields = {"payload_json": JSON.stringify(payload)};
    randomstr = makeid(16);

    //source in python: body = MultipartEncoder(fields=fields, boundary='----WebKitFormBoundary'+randomstr)
    //source in python: headers = {'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary'+randomstr}
    //source in python: r = requests.post(API_URL, data=body, headers=headers)
    // convert to javascript


    await axios({
        method: 'post',
        url: API_URL,
        data: payload,
        headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary" + randomstr
        } 
    });


}