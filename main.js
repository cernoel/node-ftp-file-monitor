var date = new Date();

var path = require('path');
var fs = require('fs');
var client = require('ftp');

var c = new client();

console.log('Starte Monitor ' + date)
var email   = require("emailjs");
var server  = email.server.connect({
   host:    "192.168.1.1", 
   ssl:     false
});

// FTP
var connectionProperties = {
    host: "192.168.1.2",
    user: "usr",
    password: "pwd"
};
var searchPath = 'path/destDir;

var fileIsOlderThanSeconds = 120;

var timeZoneCorrection = +2; //in hours

var mailEnvelope = {
			text:    "AHHHH", 
            from:    "support <support@hello.it>", 
            to:      "ITGUY <itguy@hello.it>",
            subject: "ERROR .. ROAHR!"
};




// Calculations
var timeZoneCorrectionSeconds = timeZoneCorrection * 3600;
                        
var nowYear = parseFloat( date.getFullYear() );
var nowYearSeconds = nowYear * 31557600;
                        
var nowMonth = parseFloat( date.getMonth() ) + 1;
var nowMonthSeconds = ( nowMonth ) * 2592000;

var nowDay = parseFloat( date.getDate() );
var nowDaySeconds = nowDay * 86400;
                       
var nowHour = parseFloat( date.getHours() );
var nowHourSeconds = nowHour * 3600;

var nowMinute = parseFloat( date.getMinutes() );
var nowMinuteSeconds = nowMinute * 60;

var nowSeconds = parseFloat( date.getSeconds() );
              
var nowFullSeconds = nowYearSeconds + nowMonthSeconds + nowDaySeconds + nowHourSeconds + nowMinuteSeconds + nowSeconds + timeZoneCorrectionSeconds;

console.log(nowYear, nowMonth, nowDay, nowHour, nowMinute, nowSeconds, timeZoneCorrection, nowYearSeconds, nowMonthSeconds, nowDaySeconds, nowHourSeconds, nowMinuteSeconds, nowSeconds, timeZoneCorrectionSeconds, nowFullSeconds);  
var oldFileFound = false;

c.on('ready', function () {
    c.list(searchPath, function (err, list) {
        if (err) throw err;
        list.forEach(function (element, index, array) {
            
            if (element.type !== 'd') { // ignoring the D's
                
                if (path.extname(element.name) == '.RCV') { // watch only for .RCV files
                    
					console.log( element.name, element.date );
					
                    var fullDate = ''; //string
                    fullDate = element.date.toString();
                    
                    var arrDate = []; //array
                    arrDate = fullDate.split(' ');
                    
                    if ( arrDate.length > 0 ) {
                        
                        var year = 0;
                        year = parseFloat( arrDate[3] );
                        
                        month = 0;
                        
                        switch(arrDate[1]) {
                            case 'Jan':
                                month = 1;
                                break;
                            case 'Feb':
                                month = 2;
                                break;
                            case 'Mar':
                                month = 3;
                                break;
                            case 'Apr':
                                month = 4;
                                break;
                            case 'May':
                                month = 5;
                                break;
                            case 'Jun':
                                month = 6;
                                break;
                            case 'Jul':
                                month = 7;
                                break;
                            case 'Aug':
                                month = 8;
                                break;
                            case 'Sep':
                                month = 9;
                                break;
                            case 'Oct':
                                month = 10;
                                break;
                            case 'Nov':
                                month = 11;
                                break;
                            case 'Dec':
                                month = 12;
                                break;
                            default:
                                month = 0;
                        }
                        
                        var day = 0;
                        day = parseFloat( arrDate[2] );
                        
                        
                        
                        var time = []; //array
                        time = arrDate[4].split(':');
                        
                        var hour = 0;
                        hour = parseFloat( time[0] );
                        
                        var minute = 0;
                        minute = parseFloat( time[1] );
                        
                        var second = 0;
                        second = parseFloat( time[2] );
                        
                        
                        var yearSeconds = year * 31557600;
                        var monthSeconds = month * 2592000;
                        var daySeconds = day * 86400;
                        var hourSeconds = hour * 3600;
                        var minuteSeconds = minute * 60;
                        var elementSeconds = yearSeconds + monthSeconds + daySeconds + hourSeconds + minuteSeconds + second;
                        
                        var difference = 0;
                        difference = nowFullSeconds - elementSeconds;
                        
                        console.log( year, month, day, hour, minute, second, yearSeconds, monthSeconds, daySeconds, hourSeconds, minuteSeconds, second, elementSeconds, difference );

                        if( difference > fileIsOlderThanSeconds ) {
						
							if( difference < 3600 ) {
								// Only Files that are not older than one day.
								// There is a bug sometimes, when a file get's touched by the os.. , the date changes to year 1970 something for a blink.. 
								// we wanna prevent that.
								oldFileFound = true;
							};
                            
                        } else {
							console.log('File ignored, its not old enough.');
						};
                    }
                    
                }
                
            }
                        
        }); //forEach
        
        if( oldFileFound ) {
            
            // send the message and get a callback with an error or details of the message that was sent
            server.send(mailEnvelope, function(err, message) { console.log(err || message); });
            
        } else {
			console.log('no hanging file found.');
		};
        c.end();
    });
    
});

c.connect(connectionProperties);