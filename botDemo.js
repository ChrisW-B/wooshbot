var bot = require('fancy-groupme-bot').Bot,
	botServer = require('fancy-groupme-bot').Server,
	fs = require('fs'),
	request = require('request'),
	groupmeImage = require('groupme').ImageService,
	formidable = require('formidable');

//configuration
//Might want to not hard code these later
var TOKEN = "0e088af0a4b301327e9a16a8358f1ba3"; // your groupme api token
var USER_TOKEN = "55JqxdWFl4G29PSPDcp6O7Zc2grs74giP3wDIIXz";
var GROUP = "9674073"; // the room you want to join
var URL = "http://cse398-cwb216.cloudapp.net";

var WOOSH_NAME = "wesBot"; // the name of your bot
var WOOSH_TAIL = "/woosh"; // the domain you're serving from, 

var JINX_NAME = "jonBot"; // the name of your bot
var JINX_TAIL = "/jinx";

var WHERE_NAME = "chrisGBot"; // the name of your bot
var WHERE_TAIL = "/where";

var BAND_NAME = "bandBot"; // the name of your bot
var BAND_TAIL = "/band";

var privatekeyLoc = "/home/cwb216/server_key.pem";
var certificateLoc = "/home/cwb216/server_crt.pem";

const WOOSH_CONFIG = {
	token: TOKEN,
	group: GROUP,
	name: WOOSH_NAME,
	url: URL + WOOSH_TAIL,
	tail: WOOSH_TAIL
};
const JINX_CONFIG = {
	token: TOKEN,
	group: GROUP,
	name: JINX_NAME,
	url: URL + JINX_TAIL,
	tail: JINX_TAIL
};
const WHERE_CONFIG = {
	token: TOKEN,
	group: GROUP,
	name: WHERE_NAME,
	url: URL + WHERE_TAIL,
	tail: WHERE_TAIL
};
const BAND_CONFIG = {
	token: TOKEN,
	group: GROUP,
	name: BAND_NAME,
	url: URL + BAND_TAIL,
	tail: BAND_TAIL
};

//attempts to register bot
var wooshBot = bot(WOOSH_CONFIG);
var jinxBot = bot(JINX_CONFIG);
var whereBot = bot(WHERE_CONFIG);
var bandBot = bot(BAND_CONFIG);


//receives event triggered by successful registration
wooshBot.on('botRegistered', function(b) {
	console.log("woosh is registered");
});
jinxBot.on('botRegistered', function(b) {
	console.log("jinx is registered");
});
whereBot.on('botRegistered', function(b) {
	console.log("where is registered");
});
bandBot.on('botRegistered', function(b) {
	console.log("band is registered");
});

//Receives message event, but only proceeds if in correct group and not a bot
//which prevents it from repeating other conversations, or itself
var stopBeingAnnoying;
var lastRepliedTo = [];
wooshBot.on('botMessage', function(b, message) {
	if (message.group_id === GROUP && message.sender_type !== "bot") {
		console.log("looking for the woosh");
		var randNum = Math.floor(Math.random() * 1000);
		console.log("Seaworld number is " + randNum);
		if (randNum == 500 || randNum == 750 || randNum == 250) {
			wooshBot.message("Welcome to Sea World, you little shit");
		} else if (message.name.indexOf("Wes") > -1 || message.name.indexOf("wes") > -1 && randNum > 600) {
			stopWooshing();
			startWooshing(b, message.name);
		}
	}
});

whereBot.on('botMessage', function(b, message) {
	if (message.group_id === GROUP && message.sender_type !== "bot") {
		var randNum = Math.floor(Math.random() * 1000);
		if ((message.text.indexOf("where") > -1 || message.text.indexOf("Where") > -1) && randNum > 850) {
			setTimeout(
				function() {
					whereBot.message("Under there!");
				}, 1500);
		}
	}
});

bandBot.on('botMessage', function(b, message) {
	if (message.group_id === GROUP && message.sender_type !== "bot") {
		var randNum = Math.floor(Math.random() * 1000);
		var splitMessage = message.text.split(" ");
		if (splitMessage.length == 3 && randNum > 750) {
			var goodBandName = message.text + "\" would be a good band name!";
			goodBandName = goodBandName.replace(/['!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']/g, "");
			setTimeout(
				function() {
					bandBot.message(goodBandName);
				}, 1500);
		}
	}
});

jinxBot.on('botMessage', function(b, message) {
	if (message.group_id === GROUP && message.sender_type !== "bot") {
		randNum = Math.floor(Math.random() * 1000);
		console.log("jinxNum is " + randNum);
		if (randNum >= 995) {
			jinxBot.message(message.text);
			setTimeout(
				function() {
					jinxBot.message("jinx");
				}, 1500);
		} else if (randNum >= 980) { //hopefully a small chance of jinxing
			var splitMessage = message.text.split(" ");
			setTimeout(
				function() {
					var newMessage = newsplitMessage[splitMessage.length - 1];
					var i = splitMessage.length - 1;
					while (newMessage !== " " && newMessage !== "") {
						i--;
						newMessage = newsplitMessage[i];
						if (i < 0) {
							break;
						}
					}
					jinxBot.message(newMessage);
				}, 1000);
			setTimeout(
				function() {
					jinxBot.message("jinx!");
				}, 2100);
		}
	}
});

function stopWooshing() {
	console.log("Cancelling last woosh");
	clearTimeout(stopBeingAnnoying);
}

var clearName;

function startWooshing(bot, name) {
	var randNum = Math.floor(Math.random() * 1000);
	var updatedList = false;
	console.log("Attempting to woosh");
	if (randNum < 400 && !recentlyRepliedTo(name)) {
		bot.message("I'll have you know");
		lastRepliedTo[lastRepliedTo.length] = name;
		updatedList = true;
	} else if (!recentlyRepliedTo(name) && randNum > 600) {
		stopBeingAnnoying = setTimeout(
			function() {
				bot.message("woosh");
				clearTimeout(clearName);
				lastRepliedTo[lastRepliedTo.length] = name;
				updatedList = true;
			}, 10000);
	}
	if (updatedList) {
		clearName = setTimeout(
			function() {
				lastRepliedTo = [];
			}, 1000000);
	}
}

function recentlyRepliedTo(name) {
	for (var i = 0; i < lastRepliedTo.length; i++) {
		if (name === lastRepliedTo[i]) {
			return true;
		}
	}
	return false;
}


var port = process.env.PORT || 80;
console.log("i am serving on " + port);
var options = {
	port: port
	// privateKey: privatekeyLoc,
	// certificate: certificateLoc
};
var server = botServer(options);
bandBot.serve(server);
wooshBot.serve(server);
whereBot.serve(server);
jinxBot.serve(server);
