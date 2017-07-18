var fbPageDAO = require('../dao/fb-page-dao');
var conversationDAO = require('../dao/conversation-dao');
var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.Promise = Promise; 
//mongoose.connect('mongodb://kj9vzh8DQe:%25tF8Xf-F5HTBWY!hGNP2vV@insan.es/project-detective');
mongoose.connect('mongodb://localhost/project-detective');

const LANDING_PAGE_FB_ID = '320422681726492';
const AUSTIN_CAMPBELL = '115044382461502';

// Load from file?
var pages = [
    { //Marvin Page
        fb_page: '115044382461502',
        page_token: 'EAALgaxZAuSZAEBAMPr18ey8ZCgR8euI22glqJNrRpIP9QZCjthFuw4yhOVS0jv1jicnmOifDkDxXSHcENcyO7RpaJ7jXY8AcIC2qRPZCAvvBhxZATsxr6bNKr1NsPgpp7inIdEwqHmFBM5O4VQDteO79fZCaYA8VGxH8LewoaWwmwZDZD',
        name: 'Marvin Page',
        default_answer: 'Sorry, but you\'re talking gibberish.',
        error_answer: 'Sorry, I dozed out a little.'
    },
    
    { //Daniel Morrison
        fb_page: '1879235125730399',
        page_token: 'EAALgaxZAuSZAEBAEBZAhtPisW5yaELpCe1URwwOgCRKzupdfwE5cCCLFHwrpMQtS4OQ8byURvlYa3yIVUFi3d7VnQ7PEdbvZBWuEusoxQ7ZCkHpBn3uKKInQFsj3lw4p6Ho00JdLvRN1bFSvZCm8ZCNXLJAxG1WJN7G3PTVdcQZB0wZDZD',
        name: 'Daniel Morrison',
        default_answer: 'Sorry, I don\'t quite understand what you mean',
        error_answer: 'Whoops, can\'t help you right now.'
    },
    
    { //Donna Gibson
        fb_page: '448408885531613',
        page_token: 'EAALgaxZAuSZAEBALnFUoDAli0pJphbb7FiClTiBMNmTWtftxVa3GlR0UR4Pu9mfhgzHhk2SZCLLaEY7ssNquLrWR46o856G53ZB1tWvZB2XlzUkUJmECePs4ZCvZAD8rWEyqZCjtXfUoyIVtSPIGQZBY2ZA0K4EhipRvhIZCbSEJhAaVwZDZD',
        name: 'Donna Gibson',
        default_answer: 'Sorry darling, I can\'t hear you that well, it\'s not easy being an old lady sometimes :)',
        error_answer: 'Sorry, I\'m just too tired to think.'
    },
    
    { //Vinnie Devin
        fb_page: '1735558303404132',
        page_token: 'EAALgaxZAuSZAEBAF9BMRZCrMJSJ9AUGXlVWc6C6mM6fcqi4k4hC3hdabOQPg8VkscDcX5aoM6UxwKA1Yb3vpWoXrtKHdgyOYZC7ZANOYuZC2wpn7hiPZAMmj0BXitCE4X7M6TrZB6PFEwdziqCqezvSDQbClCfHCQWPdZByTbbAgTTwZDZD',
        name: 'Vinnie Devin',
        default_answer: 'Whew... time travelling is getting me dizzy... what?',
        error_answer: '*time error*'
    },
    
    { //Flynn Layton
        fb_page: '789847667841728',
        page_token: 'EAALgaxZAuSZAEBABYfZAZBt7Ghtt6TSY64WJIufejn33MDcPiZBDhiZBTEmXqwyWtKrWzWLjah5FkFO617ZAVGAirpRQwePZBLbjBwf8WbL4MB6ZBFqEgxNLFvxJ7hu1Nx2DZAZA0OgslhfgAoTWdIrqy5CZB0XlIsaWJvQKxwIwti9Q3gZDZD',
        name: 'Flynn Layton',
        default_answer: '',
        error_answer: ''
    },
    
    { //Austin Campbell
        fb_page: '119770888641179',
        page_token: 'EAALgaxZAuSZAEBAOr9Hn8NVZAYMr4uQWcRAScZCTds0ixUsfyheDo4C8rA4xIZCAlDDnXGYWcFdu1hBOfU79w0OG8yzN2PyXgzYJckUZB7L8tMZBeFUEhkwUiZAipUZAaLOemCTDb3qrxE5ZAJsqNf5yG382qFVUsu71HGlBGfrpJ23gZDZD',
        name: 'Austin Campbell',
        default_answer: 'Ahh... I apologize, but I\'m having trouble understanding you',
        error_answer: 'Ahh... something is wrong here...'
    },
    
    { //Chat for the Insanes
        fb_page: '115167939117695',
        page_token: 'EAALgaxZAuSZAEBANJLglmXq20f9rbmZB9g2W6LznQTqP00bv7ymQNxXa2G6C8uhVgJJKgFvQ1ZCFZB5WluTWYYxAVH7ciUqYPQROlhXKYjKOQ5o55xl8AZAiZBfobL7qLxuzzsXXvvgz6B5iV6pF01odZArjJZAXmpqm7SOSB2ab3QFwBcM7zZBARv',
        name: 'Landing Page',
        default_answer: 'Talking with a landing page?.',
        error_answer: '** error **'
    },
    
    { //Ulalume Sea
        fb_page: '251295495370597',
        page_token: 'EAALgaxZAuSZAEBAOAU8SNMbhipwH9zcp1gFwlZCTyGM0FHHjatdXsJZCLNdtZB7xz8daXRJ5cP8WQPFkKdkA4Ahe4tXDzlZAfeHrpbF5Pttthv7wHi8WutxGgEKUlGsZA6LgyeCu44jLcgRbvPHL4aGEGFqjbpSPw1ZCYGKGPbkZA2RE3KyhckaNV',
        name: 'Ulalume Sea',
        default_answer: '',
        error_answer: ''
    }
]

var responses = [
    // ------------------- MARVIN PAGE --------------------
    {
        page_name: 'Marvin Page',
        code: 'beginGame',
        response: 'Hi, I am the PI Marvin Page investigating the murder of the journalist Vinnie Devin, 32yo... and boy, things are not looking good for you! I found your photo on the crime scene! What do you have to say about that?'
    },
    
    {
        page_name: 'Marvin Page',
        code: 'i_didnt_do_it',
        response: 'I don\'t know why, but I believe in you. Something about this is way off... but if you really want to stay out the joint, you better find out what really happened.'
    },
    
    {
        page_name: 'Marvin Page',
        code: 'what_should_i_do',
        response: 'If you really wanna help yourself, take this article. Mr. Devin had been reading about this stuff... '+
        'and it\'s public info anyway. Now get out. I\'ll keep an eye on you.;https://hackathon-amazon-raphaelrosa.c9users.io/time-travel.html'
    },
    
    {
        page_name: 'Marvin Page',
        code: 'i_did_it',
        response: 'mmmmm;I doubt that. You don\'t seem to have the stomach...'
    },
    
    {
        page_name: 'Marvin Page',
        code: 'fuck_you',
        response: '\'Cause saying that kind of thing will really absolve you... Fucking dumbasses.'
    },
    
    // -------------------------------------------------
    
    // ------------------- Daniel Morrison --------------------
    {
        page_name: 'Daniel Morrison',
        code: 'did_you_write_these_articles',
        response: 'I wrote lots of things... what do you want, anyway?'
    },
    
    {
        page_name: 'Daniel Morrison',
        code: 'do_you_know_vinnie',
        response: 'Yes, he came to me looking for some of my work, why?'
    },
    
    {
        page_name: 'Daniel Morrison',
        code: 'did_you_wrote_anything_else',
        response: 'Well... these articles seemed to capture Vinnie\'s attention.'
    },
    
    {
        page_name: 'Daniel Morrison',
        code: 'what_do_yout_know_about_portals',
        response: 'You believe that shit? Maybe you belong here...'
    },
    
    {
        page_name: 'Daniel Morrison',
        code: 'i_need_help',
        response: 'Try this articles... maybe they can be of help;https://hackathon-amazon-raphaelrosa.c9users.io/portals.html'
    },
    
    {
        page_name: 'Daniel Morrison',
        code: 'what_should_i_do',
        response: 'Well, maybe this articles can help you;https://hackathon-amazon-raphaelrosa.c9users.io/portals.html'
    },
    
    {
        page_name: 'Daniel Morrison',
        code: 'hello',
        response: 'Hi again...'
    },
    
    {
        page_name: 'Daniel Morrison',
        code: 'do_you_know_flynn',
        response: 'One thing I know about FLynn Layton, he really did go insane some years before dying'
    },
    
    {
        page_name: 'Daniel Morrison',
        code: 'goodbye',
        response: 'Bye'
    },
    
    {
        page_name: 'Daniel Morrison',
        code: 'fuck_you',
        response: 'Do you kiss your mother with that mouth?'
    },
    
    // -------------------------------------------------
    
    // ------------------- Austin Campbell --------------------
    {
        page_name: 'Austin Campbell',
        code: 'do_you_know_vinnie',
        response: 'Nope'
    },
    
    {
        page_name: 'Austin Campbell',
        code: 'do_you_know_flynn',
        response: 'That name is familiar, let me check...;mmmmm;no;not here;mmmmm;yes, got it;He was a pacient here, but died a long time ago... \'bout 50 years ago'
    },
    
    {
        page_name: 'Austin Campbell',
        code: 'tell_me_more_about_him',
        response: 'I can\'t say much about this Flynn guy, but it seems that there is someone alive who knew him... some Donna Gibson.'
    },
    
    // -------------------------------------------------
    
    // ------------------- Donna Gibson --------------------
    
    {
        page_name: 'Donna Gibson',
        code: 'do_you_know_flynn',
        response: 'Yes, of course! He was a neighbour of mine. An odd one too... He had this strange looking friend, who was always dressed with the same weird looking clothes;What was his name?;Walter... Wendel;No... it had something to do with the devil;DEVIN!;Yes!;Vinnie Devin!'
    },
    
    {
        page_name: 'Donna Gibson',
        code: 'hows_this_possible',
        response: 'Wait a minute... I do have an old photo of them together;Here, you can take it.;Now please, this old lady needs some rest'
    },

    // -------------------------------------------------
    
    // ------------------- Vinnie Devin --------------------
    
    {
        page_name: 'Vinnie Devin',
        code: 'came_from_the_future',
        response: 'Oh! Hey {PLAYER_NAME}, what are you doing here? No! Wait... this is the moment I meet you...;'+
        'Arrrghhh... this travelling drives me crazy!...;Ok, If I\'m meeting you just now, it means I must take something to remember you by...;'+
        'You see...;I have a warehouse in the future where I keep everything that any version of me might need to know...;'+
        'So, I need something of yours that I can easily relate to you to keep in my warehouse! Do you have something like that, please?'
    },
    
    {
        page_name: 'Vinnie Devin',
        code: 'vinnie_you_will_die',
        response: 'Everybody is going to die... But if you said that, probably I\'m gonna die some way I\'d wish I wouldn\'t. But is that even avoidable? Can I do something about that? Hummm.... that\'s odd'
    },
    
    {
        page_name: 'Vinnie Devin',
        code: 'found_you',
        response: 'I guess you found me...'
    }
    
    // -------------------------------------------------
];

var promises = [];


for (var item in pages) {
    promises.push(createPage(pages[item]));
}

Promise.all(promises)
.then(function () {
    var promisesResponses = [];
    
    for (var item in responses)
        promisesResponses.push(createResponse(responses[item]));
    
    Promise.all(promisesResponses)
    .then(function () {
        //console.log('finalizou');
        process.exit(0);
    });
});

function createPage(page) {
    return new Promise(function (resolve, reject) {
        fbPageDAO.create(page)
        .then(function(fbPage) {
            //console.log('FB Page created:', fbPage);
            resolve();
        }).catch(function (err) {
            console.log('Error creating FB Page');
            console.log(err);
            reject(err);
        });
    });
}

function createResponse(response) {
    return new Promise(function (resolve, reject) {
        fbPageDAO.findByQuery({ name: response.page_name })
        .then(function (fbPage) {
            
            fbPage = fbPage[0];
            
            //console.log(fbPage);
            
            if (!fbPage || !fbPage._id)
                console.log('ERROR -> ', response.code, 'Página ->', response.page_name, 'FBPAGE ->', fbPage);
            
            var tmp = {
                fb_page: fbPage._id,
                code: response.code,
                response: response.response //WTF
            }
            
            //console.log('OBJ -> ', tmp);
            
            conversationDAO.create(tmp)
            .then(function(fbPage) {
                //console.log('Conversation created:', fbPage);
                resolve();
            }).catch(function (err) {
                console.log('Error creating Conversation', err);
                reject();
            })
        });
    });
}