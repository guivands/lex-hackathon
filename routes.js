var passport = require('passport');
var request = require('request'),
    lex = require('./lex'),
    messaging = require('./messaging'),
    logDao = require('./dao/log-dao');

var token = 'EAALgaxZAuSZAEBAHAqvnpw2DOB1a1FEhcXEeyvywUipULAsIi6vOlhw8Nu2NfZCnakXzIwncr2IJXk0cCD6q8TsAcX89O8mtgpZBozZCpMG0tWMAQcZA4EewhAQbX9BkBflyldPJebskZBlYBrB4rlWtpTTHyx1RhwVbZCegMrKzMAZDZD';
var tokenCabarrala = 'EAALgaxZAuSZAEBABKZCuwusZCmCschWZC1wcJ80KH4usZCZAZAroeM9ZCI0byUWYBnpszMllyGX1WdCvnRsnpF9hO6XzqvMwOMii6ZA9RVCAZCYndqSdZA06S3ol2uZAxJp1RPhBBVJ11DKXVZCimaaMFDrgG6NZC2ZCnDCZBw3JpqgSpOzkZBJmDlYoPcHGKc';

var testRecipient = '200440840360781';
var cabarralatRecipient = '320422681726492';

module.exports = function (app) {
    
    app.get('/webhook', function (req, res) {
        if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'senha') {
          res.status(200).send(req.query['hub.challenge']).end();
        } else {
            res.status(403).end();
        }
    });
    
    app.post('/webhook', messaging.webhook);

    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login' 
    }));
    
    app.post('/logger', function (req, res) {
       if (req.body) {
           logDao.create(req.body);
       }
       
       res.status(201).end();
    });
    
    return app;
}

var userDAO = require('./dao/user-dao');
var fbPageDAO = require('./dao/fb-page-dao');
var fbUtils = require('./utils/fb-utils');
function handleMessage(event) {
    var senderId = event.sender.id,
        recipientId = event.recipient.id,
        messageId = event.message.mid,
        messageText = event.message.text,
        attachments = event.message.attachments;

    fbPageDAO.findByQuery({
        fb_page:recipientId
    }).then(function(fbPages) {
        var fbPage = fbPages[0];
        require('./facebook-user-info').getUserInfo(senderId, fbPage.page_token).then(function(userInfo) {
            // console.log(event);
            // console.log('sender id:', senderId);
            userInfo = JSON.parse(userInfo);
            var imgName = fbUtils.getProfilePicName(userInfo['profile_pic']);
            
            userDAO.findByQuery({
                $or: [
                    {fb_id: senderId}, 
                    {photo: imgName}
                ]
            }).then(function(users) {
                var sid = senderId;
                if (!users.length) {
                    var user = {
                        name: userInfo['first_name'] + ' ' + userInfo['last_name'],
                        photo: [imgName],
                        friends_name: [],
                        fb_id: [senderId]
                    }
                    userDAO.create(user);
                } else {
                    var user = users[0];
                    var contains = true;
                    if (user.fb_id.length > 0) {
                        for (s of user.fb_id) {
                            if (s != sid) {
                                contains = false;
                                // sid = s;
                                break;
                            }
                        }
                    }
                    
                    if (!contains) {
                        user.fb_id.push(sid);
                        fbUtils.containsImage(user.photo, imgName);
                        console.log("ATUALIZANDO USUARIO:", user);
                        userDAO.updateExisting(user);
                    } else if (!fbUtils.containsImage(user.photo, imgName)) {
                        userDAO.update(user);
                    }
                }
                
                respondMessage(sid, messageText, attachments, fbPage.page_token);
            });
        }).catch(function(err) {
            console.log('OLHA O ERRRRRRROOOOOOO', err);
            console.log(fbPage, recipientId);
        });
    });
}

function respondMessage(senderId, messageText, attachments, pageToken) {
    if (messageText) {
        lex.callLex(messageText, function (err, res) {
            if (err) {
                console.log('error: ', err);
                return;
            }
            sendText(senderId, res, pageToken);
            console.log(res);
        });
    } else if (attachments) {
        // handle this shit
    }
}

function sendText(recipientId, text, pageToken) {
    var data = {
        recipient: {
            id: recipientId
        },
        message: {
            text: text
        }
    };
    
    sendToApi(data, pageToken);
}

function sendToApi(data, pageToken) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: pageToken
        },
        method: 'POST',
        json: data
    }, function (error, response, body) {
       if (error) {
           console.log('error: ', error);
           return;
       }
       
       if (response.statusCode === 200) {
           console.log('message sent successfully');
       } else {
           console.log('error on message send. ', error, response.statusCode)
       }
    });
}