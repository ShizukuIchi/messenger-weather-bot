function getRandomInt(min, max){
  return Math.floor(Math.random()*(max-min) +min)
}

function getRandomReply(){
  messages = [
    '蛤?',
    '87',
    '密P',
    '別密ㄌ',
    '8888888',
    '誰派你來ㄉ',
    '太閒?',
    '再來R',
    '再來RRRRRRRRRRR',
    '再來R!!!!!!!!',
    '互相傷害阿!',
    '此處無銀三百兩',
    '安安你好',
    '安安，很高興為您服務',
    '我4最棒ㄉ回話ㄐ器人',
    '我比較ㄎi'
  ]
  return messages[getRandomInt(0, messages.length)]
}

module.exports = {
  getRandomReply: getRandomReply
}