var fbUtils = {
    getProfilePicName:function(url) {
        if (!url)
            return null;
        
        var imgName = url.substring(url.lastIndexOf('/') + 1, url.indexOf("?") >= 0 ? url.indexOf('?') : url.length);
        return imgName;
    },
    
    containsImage:function(userImages, img) {
        for(i of userImages) {
            if (img == i)
             return true;
        }
        userImages.push(img);
        return false;
    }
}

module.exports = fbUtils;

// var x = fbUtils.getProfilePicName('https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/19149328_1546941262036331_7080710633598705826_n.jpg?oh=98e99eb499987407fdb2bd9311503e94&oe=59C441CB');
// console.log(x);
