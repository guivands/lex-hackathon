var AWS = require('aws-sdk');

// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexRuntime.html
var lexConfig = require('./config/lex-config');
var lexRuntime = new AWS.LexRuntime(lexConfig.credentials);


var api = {

    callLex: function(text, cb) {
        // console.log('sending text:',text);
        var params = {
            inputText:text
        };
        
        for (i in lexConfig.params) {
            params[i] = lexConfig.params[i];
        }
        
        lexRuntime.postText(params, function(err, data) {
            console.log('lex return', data);
            cb(err, err ? null : data.intentName);
        });
    }
}

module.exports = api;

function testIt() {
    api.callLex('hi', function(err, data) {
        console.log(err, data);
    })
}

// testIt();
