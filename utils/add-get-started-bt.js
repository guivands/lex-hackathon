var pageTokens = [
    //Marvin Page
    "EAALgaxZAuSZAEBAMPr18ey8ZCgR8euI22glqJNrRpIP9QZCjthFuw4yhOVS0jv1jicnmOifDkDxXSHcENcyO7RpaJ7jXY8AcIC2qRPZCAvvBhxZATsxr6bNKr1NsPgpp7inIdEwqHmFBM5O4VQDteO79fZCaYA8VGxH8LewoaWwmwZDZD",
    //Chat for the Insanes
    "EAALgaxZAuSZAEBANJLglmXq20f9rbmZB9g2W6LznQTqP00bv7ymQNxXa2G6C8uhVgJJKgFvQ1ZCFZB5WluTWYYxAVH7ciUqYPQROlhXKYjKOQ5o55xl8AZAiZBfobL7qLxuzzsXXvvgz6B5iV6pF01odZArjJZAXmpqm7SOSB2ab3QFwBcM7zZBARv",
    //Daniel Morrison
    "EAALgaxZAuSZAEBAEBZAhtPisW5yaELpCe1URwwOgCRKzupdfwE5cCCLFHwrpMQtS4OQ8byURvlYa3yIVUFi3d7VnQ7PEdbvZBWuEusoxQ7ZCkHpBn3uKKInQFsj3lw4p6Ho00JdLvRN1bFSvZCm8ZCNXLJAxG1WJN7G3PTVdcQZB0wZDZD",
    //Donna Gibson
    "EAALgaxZAuSZAEBALnFUoDAli0pJphbb7FiClTiBMNmTWtftxVa3GlR0UR4Pu9mfhgzHhk2SZCLLaEY7ssNquLrWR46o856G53ZB1tWvZB2XlzUkUJmECePs4ZCvZAD8rWEyqZCjtXfUoyIVtSPIGQZBY2ZA0K4EhipRvhIZCbSEJhAaVwZDZD",
    //Vinnie Devin
    "EAALgaxZAuSZAEBAF9BMRZCrMJSJ9AUGXlVWc6C6mM6fcqi4k4hC3hdabOQPg8VkscDcX5aoM6UxwKA1Yb3vpWoXrtKHdgyOYZC7ZANOYuZC2wpn7hiPZAMmj0BXitCE4X7M6TrZB6PFEwdziqCqezvSDQbClCfHCQWPdZByTbbAgTTwZDZD",
    //Flynn Layton
    "EAALgaxZAuSZAEBABYfZAZBt7Ghtt6TSY64WJIufejn33MDcPiZBDhiZBTEmXqwyWtKrWzWLjah5FkFO617ZAVGAirpRQwePZBLbjBwf8WbL4MB6ZBFqEgxNLFvxJ7hu1Nx2DZAZA0OgslhfgAoTWdIrqy5CZB0XlIsaWJvQKxwIwti9Q3gZDZD",
    //Austin Campbell
    "EAALgaxZAuSZAEBAOr9Hn8NVZAYMr4uQWcRAScZCTds0ixUsfyheDo4C8rA4xIZCAlDDnXGYWcFdu1hBOfU79w0OG8yzN2PyXgzYJckUZB7L8tMZBeFUEhkwUiZAipUZAaLOemCTDb3qrxE5ZAJsqNf5yG382qFVUsu71HGlBGfrpJ23gZDZD",
    //Ulalume Sea
    "EAALgaxZAuSZAEBAOAU8SNMbhipwH9zcp1gFwlZCTyGM0FHHjatdXsJZCLNdtZB7xz8daXRJ5cP8WQPFkKdkA4Ahe4tXDzlZAfeHrpbF5Pttthv7wHi8WutxGgEKUlGsZA6LgyeCu44jLcgRbvPHL4aGEGFqjbpSPw1ZCYGKGPbkZA2RE3KyhckaNV"
];

var request = require('request-promise');

for (var pt of pageTokens) {
    var data = { 
      "get_started":{
        "payload":"BEGIN_CONVERSATION"
      }
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