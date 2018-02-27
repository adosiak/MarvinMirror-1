var moment = require('moment-timezone');
var config = require('../config/config.js');
var request = require('request-promise');
var manageDOM = require('../src/manageDOM');

/*
** With the momentjs module we will be able to easily
** set timezone and hopefully change it easily with
** voice command.
*/

async function promiseJSON(url) {
    const options = {
        method: 'GET',
        uri: url,
        json: true
    };
    try {
        const response = await request(options);
        return Promise.resolve(response);
    }
    catch (error) {
        return Promise.reject(error);
    }
}

function getTimeZone(data) {
    var geoLocation = {
        lat: data.geonames[0].lat,
        lng: data.geonames[0].lng,
        name: data.geonames[0].toponymName
    }
    var new_url = makeTimeZoneQuiry(geoLocation);
    return promiseJSON(new_url);
}

function getTimeZone(place)
{
   
    var url = makeSearchQuiry(place, 1);
    
    promiseJSON(url).then(getTimeZone).then(function (data) {
        console.log(data)
        dateLocalTime(data['timezoneId'], place)
    })
}

function dateTime() {

    var newDay = moment('12:00:01am', 'h:mm:ssa');
    var dateString = moment().format("dddd, MMMM D");

    var clockDiv = document.getElementById("date-time");

    var timeDiv = document.createElement("div");
    var dateDiv = document.createElement("div");
    timeDiv.setAttribute('class', 'clock');
    dateDiv.setAttribute('class', 'date');

    var hourDiv = document.createElement("div");
    var colonDiv = document.createElement("div");
    var minutesDiv = document.createElement("div");


    hourDiv.className = "hour";
    colonDiv.className = "colon";
    minutesDiv.className = "minutes";

    clockDiv.append(timeDiv, dateDiv);
    timeDiv.append(hourDiv, colonDiv, minutesDiv);

    colonDiv.innerHTML = ":";
    dateDiv.innerHTML = dateString;
    // dateDiv.innerHTML = "Wednesday, 30 November";


    setInterval(function getTime () {
        now = moment();
        hourDiv.innerHTML = now.format("HH");
        minutesDiv.innerHTML = now.format("mm");
        if (now.isSameOrBefore(newDay)) {
            dateString = now.format("dddd, MMMM D");
            dateDiv.innerHTML = dateString;
            console.log(dateString);
        }
    }, 1000);
}

function dateLocalTime(timezone, place) {

        var newDay = moment('12:00:01am', 'h:mm:ssa').tz(timezone);

        var dateString = now.format("dddd, MMMM D");

        manageDOM.array2Div(['locale', 'dateDiv'], "popup");

        var contentdiv = document.getElementById("locale");
        contentdiv.className = "locale center-div"
        contentdiv.innerHTML = "Now in " + place.toUpperCase() + ':'

        var localTimediv = document.createElement("div");
        var hourDiv = document.createElement("div");
        var colonDiv = document.createElement("div");
        var minutesDiv = document.createElement("div");
        var dateDiv = document.createElement("div");

        localTimediv.className = "clock";
        hourDiv.className = "hour";
        colonDiv.className = "colon";
        minutesDiv.className = "minutes";
        dateDiv.className = "date"

        contentdiv.appendChild(localTimediv);
        localTimediv.appendChild(hourDiv);
        localTimediv.appendChild(colonDiv);
        localTimediv.appendChild(minutesDiv);
        contentdiv.appendChild(dateDiv);

        colonDiv.innerHTML = ":";
        dateDiv.innerHTML = dateString;
        setInterval(function getTime() {

            now = moment().tz(timezone);
            hourDiv.innerHTML = now.format("HH");
            minutesDiv.innerHTML = now.format("mm");
            if (now.isSameOrBefore(newDay)) {
                dateString = now.format("dddd, MMMM D");
                dateDiv.innerHTML = dateString;
              }
        }, 1000);
    }

function localDateTime(place)
{
    if (place) {
        getTimeZone(place)
    }
    else
    {
        dateLocalTime(config.timeZone, config.location)
    }
}

function makeTimeZoneQuiry(geoLocation)
{
    return (config.geoNamesAPI.timezone + 'lat=' + geoLocation.lat + '&lng=' + geoLocation.lng + '&username=' + config.geoNamesAPI.username)
}

function makeSearchQuiry(place, numberOfPlases)
{
    return (config.geoNamesAPI.search + place + '&maxRows=' + numberOfPlases + '&username=' + config.geoNamesAPI.username)
}

module.exports = localDateTime