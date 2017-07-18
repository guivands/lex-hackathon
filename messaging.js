var request = require('request'),
    lex = require('./lex'),
    userDAO = require('./dao/user-dao'),
    fbPageDAO = require('./dao/fb-page-dao'),
    conversationDAO = require('./dao/conversation-dao'),
    userInventoryDAO = require('./dao/user-inventory-dao'),
    fbUtils = require('./utils/fb-utils'),
    facebookUserInfo = require('./facebook-user-info'),
    edgarAllanPoe = require('./utils/edgar-allan-poe');


const INVENTORY_PAYLOAD = 'GET_INVENTORY';
const BEGIN_CONVERSATION = 'BEGIN_CONVERSATION';
const INVENTORY_PROFILE_PIC = "PROFILE_PIC";
const INVENTORY_OLD_PICTURE = "OLD_PICTURE";
const TUTORIAL_ADVANCE = 'TUTO_PT2'

const LANDING_PAGE_FB_ID = '115167939117695';
const ULALUME_SEA = '251295495370597';
const MARVIN_PAGE = '115044382461502';
const DANIEL_MORRISON = '1879235125730399';
const DONNA_GIBSON = '448408885531613';
const VINNIE_DEVIN = '1735558303404132';
const FLYNN_LAYTON = '789847667841728';
const AUSTIN_CAMPBELL = '119770888641179';

const ITEMS = [
    {
        code:INVENTORY_PROFILE_PIC,
        title: "My pic",
        subtitle:"That's me!"
    },{
        code:INVENTORY_OLD_PICTURE,
        title:"Old Photo",
        subtitle:"Vinnie Devin with that mad scientist"
    }
];

var msg = {
    webhook: function(req, res) {
        var data = req.body;
        
        if (data && data.object === 'page') {
            data.entry.forEach(function (entry) {
               var id = entry.id;
               var timeOfEntry = entry.time;
               
               entry.messaging.forEach(function (event) {
                    if (event.message || event.postback) {
                        handleMessage(event);
                    }
               })
            });
        }
        
        res.status(200).end();
    }
};

function handleMessage(event) {
    var senderId = event.sender.id,
        recipientId = event.recipient.id,
        msg = event.message,
        // messageId = msg ? msg.mid : null,
        messageText = msg ? msg.text : null,
        attachments = msg ? msg.attachments : null,
        postbackPayload = event.postback ? event.postback.payload : null;
        
    // console.log(messageText, postbackPayload);
    // console.log(event);

    fbPageDAO.findByQuery({
        fb_page:recipientId
    }).then(function(fbPages) {
        var fbPage = fbPages[0];
        facebookUserInfo.getUserInfo(senderId, fbPage.page_token).then(function(userInfo) {
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
                    userDAO.create(user).then((usr) => {
                        respondMessage(sid, messageText, attachments, postbackPayload, fbPage, userInfo, usr);
                    });
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
                        // console.log("ATUALIZANDO USUARIO:", user);
                        userDAO.updateExisting(user);
                    } else if (!fbUtils.containsImage(user.photo, imgName)) {
                        userDAO.update(user);
                    }
                    
                    respondMessage(sid, messageText, attachments, postbackPayload, fbPage, userInfo, user);
                }
                
                // console.log("Message text -> ", messageText);
            });
        }).catch(function(err) {
            console.log('OLHA O ERRRRRRROOOOOOO', err);
            console.log(fbPage, recipientId);
        });
    });
}

function respondMessage(senderId, messageText, attachments, postbackPayload, fbPage, userInfo, user) {
    if (messageText) {
        if (fbPage.fb_page == ULALUME_SEA){return tinkleBell(senderId, messageText, fbPage, user);}
        if (user.is_past) {
            if (fbPage.fb_page == AUSTIN_CAMPBELL ||
                    fbPage.fb_page == DANIEL_MORRISON ||
                    fbPage.fb_page == MARVIN_PAGE) {
                return sendText(senderId, "*not born yet*", fbPage.page_token);
            } else if (fbPage.fb_page == DONNA_GIBSON) {
                return sendText(senderId, 'My mommy said I shouldn\'t talk to strangers', fbPage.page_token);
            } else if (fbPage.fb_page == FLYNN_LAYTON) {
                return sendTextRecursive(senderId, edgarAllanPoe().split(';'), fbPage.page_token);
            }
        } else {
            if (fbPage.fb_page == VINNIE_DEVIN || fbPage.fb_page == FLYNN_LAYTON)
                return sendText(senderId, "*dead*", fbPage.page_token);
        }
        
        lex.callLex(messageText, function (err, lexResponse) {
            if (err) {
                console.log('error: ', err);
                return;
            }
            console.log('lex reponse:',lexResponse);
            if (!lexResponse) {
                console.log('lex is null', fbPage.default_answer);
                return sendText(senderId, fbPage.default_answer, fbPage.page_token);
            }
            
            if (fbPage.fb_page == DONNA_GIBSON && lexResponse == 'hows_this_possible') {
                userInventoryDAO.findByQuery({
                    user:user._id
                }).then((invs) => {
                    var inventory = invs[0];
                    inventory.items.push({
                        code: INVENTORY_OLD_PICTURE,
                        data: 'https://hackathon-amazon-raphaelrosa.c9users.io/img/old_photo.jpg',
                        used: false
                    });
                    userInventoryDAO.updateExisting(inventory)
                    sendRecursive(senderId, [
                        'Wait a minute... I do have an old picture of them',
                        'Here, you can take it',
                        '*item added*',
                        'Now please, this old lady needs some rest'
                    ], fbPage.page_token);
                });
                return;
            }
            
            
            var query = {
                fb_page: fbPage._id,
                code: lexResponse
            };
            
            console.log(query);
            
            conversationDAO.findByQuery(query).then(function(conversations) {
                if (!conversations || !conversations.length) {
                    return sendText(senderId, fbPage.default_answer, fbPage.page_token);
                }
                
                var conversation = conversations[0];
                console.log('conversation:', conversation);
                if (conversation.response.indexOf(';') > 0) {
                    conversation.response = conversation.response.replace('{PLAYER_NAME}', userInfo['first_name']);
                    var tmp = conversation.response.split(';');
                    return sendTextRecursive(senderId, tmp, fbPage.page_token);
                }
                sendText(senderId, conversation.response, fbPage.page_token);
            }).catch(function(err) {
                console.log('Erro buscando conversation adequada', err);
            });
        });
    } else if (attachments) {
        // handle this shit
    } else if (postbackPayload) {
        console.log(postbackPayload);
        if(postbackPayload == INVENTORY_PAYLOAD) {
            getUserInventory(senderId, fbPage);
        } else if (postbackPayload == BEGIN_CONVERSATION) {
            if (fbPage.fb_page == LANDING_PAGE_FB_ID) {
                landingPageBegin(senderId, fbPage, userInfo);
            } else if (fbPage.fb_page == ULALUME_SEA) {
                sendText(senderId, "A desert island, nothing to see, but three bells hanging from a pole.", fbPage.page_token);
            } else {
                var imgName = fbUtils.getProfilePicName(userInfo['profile_pic']);
            
                userDAO.findByQuery({
                    $or: [
                        {fb_id: senderId}, 
                        {photo: imgName}
                    ]
                }).then((users) => {
                    characterBegin(senderId, fbPage, userInfo, users[0]);
                });
            }
        } else if (postbackPayload == INVENTORY_PROFILE_PIC) {
            var imgName = fbUtils.getProfilePicName(userInfo['profile_pic']);
            
            userDAO.findByQuery({
                $or: [
                    {fb_id: senderId}, 
                    {photo: imgName}
                ]
            }).then((users) => {
                profilePic(senderId, fbPage, userInfo, users[0]);
            });
        } else if (postbackPayload == INVENTORY_OLD_PICTURE) {
            var imgName = fbUtils.getProfilePicName(userInfo['profile_pic']);
            
            userDAO.findByQuery({
                $or: [
                    {fb_id: senderId}, 
                    {photo: imgName}
                ]
            }).then((users) => {
                oldPic(senderId, fbPage, userInfo, users[0]);
            });
        } else if (postbackPayload == TUTORIAL_ADVANCE) {
            tutorial(senderId, fbPage, userInfo);
        } else if (postbackPayload.indexOf('_BELL') > 0) {
            userDAO.findByQuery({
                $or: [
                    {fb_id: senderId}, 
                    {photo: imgName}
                ]
            }).then((users) => {
                callToBell(postbackPayload, senderId, fbPage, user);
            });
        }
    }
}

function callToBell(postbackPayload, senderId, fbPage, user) {
    user.last_bell = postbackPayload;
    userDAO.update(user).then(() => {
        sendText(senderId, 'How many times should the bell tinkle?', fbPage.page_token);
    });
}

function tinkleBell(senderId, text, fbPage, user) {
    if (user.last_bell != 'SILVER_BELL') {
        return sendText(senderId, '*nothing happens*', fbPage.page_token);
    }
    
    text = text.trim();
    if (text== '3' || text == 'three' || text == '3 times' || text == 'three times') {
        user.is_past = !user.is_past;
        return userDAO.update(user).then(() => {
            sendTextRecursive(senderId, [
                "A portal appears in front of you. Attracted by it's power, you go through it",
                "The air is different here.",
                "You are now in the " + (user.is_past ? "past" : "present")
            ], fbPage.page_token);
        });
    }
    
    sendText(senderId, '*nothing happens*', fbPage.page_token);
}

function tutorial(senderId, fbPage, userInfo) {
    sendRecursive(senderId, [
        "Here, take this.",
        "*item added*",
        "To check your items, just go to the menu (left side from the input) and select 'Inventory'",
        "Try it..."
    ], fbPage.page_token, 1500);
}

function characterBegin(senderId, fbPage, userInfo, user) {
    var past = user.is_past;
    
    if (fbPage.fb_page == MARVIN_PAGE) {
       return sendRecursive(senderId, [
           "Hello, I am the P.I. Marvin Page and I'm investigating the murder of the journalist Vinnie Devin, 32yo...",
           "and things are not looking good for you!",
           {
               recipient:{id:senderId},
               message: {
                   attachment:{
                       type: 'template',
                       payload: {
                           template_type: 'generic',
                           elements: [{
                               title:'I found your photograph in the crime scene!',
                               image_url:userInfo['profile_pic']
                           }]
                       }
                   }
               }
           },
        //   "I found your photograph in the crime scene!",
           "What do you have to say about that?"
       ], fbPage.page_token);
    } else if (fbPage.fb_page == AUSTIN_CAMPBELL) {
        return sendText(senderId, "Hi! How can I help you?", fbPage.page_token);
    } else if (fbPage.fb_page == DANIEL_MORRISON) {
        return sendText(senderId, "Hello there, citizen!", fbPage.page_token);
    } else if (fbPage.fb_page == DONNA_GIBSON) {
        return sendText(senderId, "Hi, dear. Anything I can help you with?", fbPage.page_token);
    } else if (fbPage.fb_page == FLYNN_LAYTON) {
        if (past)
            return sendTextRecursive(senderId, edgarAllanPoe().split(';'), fbPage.page_token);
        else
            return sendText(senderId, "*dead*", fbPage.page_token);
    } else if (fbPage.fb_page == VINNIE_DEVIN) {
        if (past)
            return sendText(senderId, "So you waited to come to the past before talking to me, huh?! Nice!", fbPage.page_token);
        else
            return sendText(senderId, "*dead*", fbPage.page_token);
    }
}

function oldPic(senderId, fbPage, userInfo, user) {
    var past = user.is_past;
    
    if (fbPage.fb_page == LANDING_PAGE_FB_ID)
        return sendText(senderId, "You do know this is just the game's page, right?", fbPage.page_token);
    if (past) {
        if (fbPage.fb_page == MARVIN_PAGE)
            return sendText(senderId, "*not born yet*", fbPage.page_token);
        if (fbPage.fb_page == AUSTIN_CAMPBELL)
            return sendText(senderId, "*not born yet*", fbPage.page_token);
        if (fbPage.fb_page == DANIEL_MORRISON)
            return sendText(senderId, "*not born yet*", fbPage.page_token);
        if (fbPage.fb_page == DONNA_GIBSON)
            return sendText(senderId, "My mommy says I shouldn't talk to strangers", fbPage.page_token);
        if (fbPage.fb_page == FLYNN_LAYTON)
            return sendTextRecursive(senderId, edgarAllanPoe().split(';'), fbPage.page_token);
        if (fbPage.fb_page == VINNIE_DEVIN)
            return sendText(senderId, "Oh, that's me with Mr Layton!", fbPage.page_token);
    } else {
        if (fbPage.fb_page == MARVIN_PAGE)
            return sendText(senderId, "mmm... this seems to be Vinnie... but who are these other folks? I don't know what you got there kid, but that science freak, Mr Morrison, might know something about it", fbPage.page_token);
        if (fbPage.fb_page == AUSTIN_CAMPBELL)
            return sendText(senderId, "That one looks like Flynn Layton", fbPage.page_token);
        if (fbPage.fb_page == DANIEL_MORRISON)
            return sendRecursive(senderId, [
                "Hah!!! I knew it!",
                "He really did it. That foolish little genius... he time travelled!",
                "I gathered all these theories and stories, but I guess I was not brave enough to go through with it...",
                {
                    "recipient":{
                    "id":senderId
                    },
                    "message":{
                        "attachment":{
                            "type":"template",
                            "payload":{
                                "template_type":"button",
                                "text":"There was this last note from Flynn I gave to Vinnie...",
                                "buttons":[
                                    {
                                        "type":"web_url",
                                        "url":"https://hackathon-amazon-raphaelrosa.c9users.io/eap.html",
                                        "title":"Flynn's Note"
                                    }
                                ]
                            }
                        }
                    }
                },
                "After that, the last time I talked to Vinnie he was mumbling something about a place called Ulalume Sea... maybe you should go there."
            ], fbPage.page_token);
        if (fbPage.fb_page == DONNA_GIBSON)
            return sendText(senderId, "What? You don't want it anymore? I can take it back, you know...", fbPage.page_token);
        if (fbPage.fb_page == FLYNN_LAYTON)
            return sendText(senderId, "*dead*", fbPage.page_token);
        if (fbPage.fb_page == VINNIE_DEVIN)
            return sendText(senderId, "*dead*", fbPage.page_token);
    }
}

function profilePic(senderId, fbPage, userInfo, user) {
    var past = user.is_past;
    
    if (fbPage.fb_page == LANDING_PAGE_FB_ID) {
        if (user.tutorial_done)
            return sendText(senderId, "I gave that to you! Why are you giving it back? That's just rude...", fbPage.page_token);
        
        user.tutorial_done = true;
        userDAO.update(user).then(function() {
            sendRecursive(senderId, [
                "Well done!",
                "Now remember, this game is based on Facebook Pages and Facebook Messenger, but you might need to find some clues on the internet",
                "When advancing, you might need to search for other pages of characters or places to continue.",
                "Let's do that now, someone wants to talk to you",
                "Search for a page named 'Marvin Page'"
            ], fbPage.page_token);
        });
    }
    
    if(past) {
        if (fbPage.fb_page == MARVIN_PAGE)
            return sendText(senderId, "*not born yet*", fbPage.page_token);
        if (fbPage.fb_page == AUSTIN_CAMPBELL)
            return sendText(senderId, "*not born yet*", fbPage.page_token);
        if (fbPage.fb_page == DANIEL_MORRISON)
            return sendText(senderId, "*not born yet*", fbPage.page_token);
        if (fbPage.fb_page == DONNA_GIBSON)
            return sendText(senderId, "My mommy says I shouldn't talk to strangers", fbPage.page_token);
        if (fbPage.fb_page == FLYNN_LAYTON)
            return sendTextRecursive(senderId, edgarAllanPoe().split(';'), fbPage.page_token);
        if (fbPage.fb_page == VINNIE_DEVIN)
            sendRecursive(senderId, [
                "Thanks mate!",
                "By the way, don\'t trust a guy named Marvin Page, he\'s the reason I have to keep a low profile",
                "Cya",
                {
                recipient: {
                        id: senderId
                    },
                    message: {
                        attachment: {
                            type: "template",
                            payload: {
                                template_type: "generic",
                                elements:[{
                                    title:'Achievement unlocked',
                                    image_url:'https://hackathon-amazon-raphaelrosa.c9users.io/img/its_the_end.png',
                                    subtitle:'The End',
                                    buttons:[
                                        {
                                            "type":"web_url",
                                            "url":"https://hackathon-amazon-raphaelrosa.c9users.io/its_the_end.html",
                                            "title":"What really happened"
                                        }
                                    ]
                                }]
                            }
                        }
                    }
                }
            ], fbPage.page_token);
    } else {
        if (fbPage.fb_page == MARVIN_PAGE)
            return sendText(senderId, "So you just wave that thing around, giving it to people? Not suspicious at all... *tisc tisc*", fbPage.page_token);
        if (fbPage.fb_page == AUSTIN_CAMPBELL)
            return sendText(senderId, "Uhmmm... that's you... i guess...", fbPage.page_token);
        if (fbPage.fb_page == DANIEL_MORRISON)
            return sendText(senderId, "I don't need that...", fbPage.page_token);
        if (fbPage.fb_page == DONNA_GIBSON)
            return sendText(senderId, "I have enough photos in my house, but thanks dear", fbPage.page_token);
        if (fbPage.fb_page == FLYNN_LAYTON)
            return sendText(senderId, "*dead*", fbPage.page_token);
        if (fbPage.fb_page == VINNIE_DEVIN)
            return sendText(senderId, "*dead*", fbPage.page_token);
    }
}

function landingPageBegin(senderId, fbPage, userInfo) {
    // console.log('LANDING PAGE');
    facebookUserInfo.getUserInfo(senderId, fbPage.page_token).then(function(userInfo) {
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
                return userDAO.create(user).then((user) => {
                    continueLPBegin(senderId, fbPage, user)
                });
            }
            continueLPBegin(senderId, fbPage, users[0], userInfo);
        });
    });
}

function continueLPBegin(senderId, fbPage, user, userInfo) {
    userInventoryDAO.findByQuery({
        user:user._id
    }).then((invs) => {
        if (invs && invs.length)
            return;
        userInventoryDAO.create({
            user: user._id,
            items:[{
                code:'PROFILE_PIC',
                data:userInfo['profile_pic'],
                used:false
            }]
        });
    });
    
    sendRecursive(senderId, [
        "Welcome to Chat for the Insanes!",
        "Muahuahuahauhauahu-ha--ha---hem... *cof* *cof*",
        "...ahem...",
        "So, here how this works...",
        "You have to solve the mistery by talking with some bots *ahem*, real and very much alive, game characters :D",
        "just use the chat to talk to them!",
        {
            "recipient":{
            "id":senderId
            },
            "message":{
                "attachment":{
                    "type":"template",
                    "payload":{
                        "template_type":"button",
                        "text":"Let's begin with a story",
                        "buttons":[
                            {
                                "type":"web_url",
                                "url":"https://hackathon-amazon-raphaelrosa.c9users.io/intro.html",
                                "title":"Intro"
                            },{
                                "type":"postback",
                                "title":"Next",
                                "payload":"TUTO_PT2"
                            }
                        ]
                    }
                }
            }
        }
    ], fbPage.page_token, 1500);
}

function getUserInventory(sid, fbPage) {
    userDAO.findByQuery({
        fb_id: sid
    }).then((users) => {
        userInventoryDAO.findByQuery({
            user: users[0]._id,
            'items.used':false
        }).then((inventory) => {
            if (!inventory || !inventory.length || !inventory[0].items || !inventory[0].items.length) {
                return sendText(sid, '*empty*', fbPage.page_token);
            }
            var data = {
                recipient: {
                    id: sid
                },
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "generic",
                            elements:[]
                        }
                    }
                }
            };
            for (var item of inventory[0].items) {
                var it = getItemConfig(item.code);
                data.message.attachment.payload.elements.push({
                    title:it.title,
                    image_url:item.data,
                    subtitle:it.subtitle,
                    buttons:[
                        {
                            type:"postback",
                            title:"Use",
                            payload:item.code
                        }
                    ]
                });
                console.log(data.message.attachment.payload.elements[data.message.attachment.payload.elements.length-1]);
            }
            
            sendToApi(data, fbPage.page_token);
        });
    });
    
}

function getItemConfig(code) {
    for (var it of ITEMS) {
        if (it.code == code)
        return it;
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


function sendTextRecursive(recipientId, responses, pageToken, delay) {
    var text = responses.splice(0, 1)[0];
    if (!delay) delay = 3000;
    //console.log('text - ', text);

    sendText(recipientId, text, pageToken);
    
    if (responses.length > 0)
        setTimeout(function () {
            sendTextRecursive(recipientId, responses, pageToken);
        }, delay);
}

function sendRecursive(recipientId, responses, pageToken, delay) {
    var msg = responses.splice(0, 1)[0];
    if (!delay) delay = 3000;
    //console.log('text - ', text);
    
    if (typeof msg == 'string') {
        sendText(recipientId, msg, pageToken);
    } else {
        sendToApi(msg, pageToken);
    }
    
    if (responses.length > 0)
        setTimeout(function () {
            sendRecursive(recipientId, responses, pageToken);
        }, delay);
}

function sendToApi(data, pageToken) {
    // console.log("POST PAYLOAD -> ", data);
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


module.exports = msg;