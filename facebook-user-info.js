var request = require('request-promise')

var userInfo = {
    
    getUserInfo : function(recipientId, pageToken) {
        //pageToken = 'EAALgaxZAuSZAEBAMHQmjKqd7SiwTMCA5pod43uA3T9ZCISQP6Vcr2LzM8zEdUQG7DzHgCEDJR13aJaDVuOjtmIxnsZCm4Eb8ZAg58Cmvr23KBP5P8yXEWFK9cjWCLQhkupn3yLxXVwmFimhLrm6Kf0ZB5Suj1nMcA2RLVjIkhoNWIN86JVEdqF48UYKM1BZBf8ZD';
        // PROFILE PIC EH A SALVACAO! ID DO CARA MANO!
        var fields = 'first_name,gender,last_name,profile_pic';//,email,gender,hometown,last_name,name';
        // return request({
        //     uri: "https://graph.facebook.com/v2.6/"+recipientId+"?fields="+fields+"&access_token="+pageToken,
        //     // qs: {
        //     //     access_token: tokenCabarrala
        //     // },
        //     method: 'GET'
        // });
        
        return request("https://graph.facebook.com/v2.6/"+recipientId+"?fields="+fields+"&access_token="+pageToken, { headers: { 'Content-type': 'application/json' } });
    }
    
}

module.exports = userInfo;
