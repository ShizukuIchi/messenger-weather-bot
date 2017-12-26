'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const replyMessage = require('./replyMessage.js')
const getWeather = require('./getWeather.js').getWeather
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'verify_me') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

app.post('/sendme/'), function (req, res) {
	if (req.body.message !== '') {
		sendTextMessage('100002727191406', req.body.message);
		res.sendStatus(200);
	} else {
		res.sendStatus(403);
	}
}

app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			let reverseText = text.split('').reverse().join('')
			if (reverseText[0]==='氣' && reverseText[1]==='天'){
				getWeather(text.split('天氣')[0])
				.then(weather=>{
					if (weather) {
						sendTextMessage(sender, weather.name+'\n天氣: '+weather.weather+'\n最高溫:'+weather.highestT+', 最低溫:'+weather.lowestT+'\n'+'降雨機率:'+weather.rainRate)		
					} else {
						sendTextMessage(sender, '沒有該縣市QQ (可能是"臺"?)')
					}
				})
			}
			else
				sendTextMessage(sender, replyMessage.getRandomReply())
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})


const token = process.env.FB_PAGE_ACCESS_TOKEN

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})