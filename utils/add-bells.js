var pageTokens = [
    //Marvin
    "EAALgaxZAuSZAEBAOAU8SNMbhipwH9zcp1gFwlZCTyGM0FHHjatdXsJZCLNdtZB7xz8daXRJ5cP8WQPFkKdkA4Ahe4tXDzlZAfeHrpbF5Pttthv7wHi8WutxGgEKUlGsZA6LgyeCu44jLcgRbvPHL4aGEGFqjbpSPw1ZCYGKGPbkZA2RE3KyhckaNV",
];

var request = require('request-promise');

for (var pt of pageTokens) {
    var data = {
      "persistent_menu":[
        {
          "locale":"default",
          "composer_input_disabled":true,
          "call_to_actions":[
            {
              "title":"Copper Bell",
              "type":"postback",
              "payload":"COPPER_BELL"
            },
            {
              "title":"Silver Bell",
              "type":"postback",
              "payload":"SILVER_BELL"
            },
            {
              "title":"Glass Bell",
              "type":"postback",
              "payload":"GLASS_BELL"
            }
          ]
        },
        {
          "locale":"en_US",
          "composer_input_disabled":false
        }
      ]
    };
    
    request({
        method: 'POST',
        uri: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + pt,
        json: data
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log("ERRO:",err);
    });
}