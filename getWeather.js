const xmlParser = require('xml2js').parseString
const fetch = require("isomorphic-fetch")

const dataid = 'F-C0032-001'
const apikey = process.env.WEATHER_API_KEY

const url = `http://opendata.cwb.gov.tw/opendataapi?dataid=${dataid}&authorizationkey=${apikey}`

const getLocationWeather = e => (
  e.weatherElement[0].time[0].parameter[0].parameterName[0]
)
const getHighestTemperature = e => (
  e.weatherElement[1].time[0].parameter[0].parameterName[0]+'℃'
)
const getLowestTemperature = e => (
  e.weatherElement[2].time[0].parameter[0].parameterName[0]+'℃'
)
const getRainRate = e => (
  e.weatherElement[4].time[0].parameter[0].parameterName[0]+'%'
)

const getWeather = async location => {
  let obj = await fetch(url)
    .then(res => res.text())
    .then(xml => new Promise(res => {
      xmlParser(xml, (err, result) => {
        res(result)
      })
    }))
    let locations = obj.cwbopendata.dataset[0].location
    locationObj = locations.filter(element => {
      return element.locationName[0].match(location) 
    })
    let o = locationObj[0]
    if (locationObj.length){
      return ({
        name: o.locationName[0],
        weather: getLocationWeather(o),
        highestT: getHighestTemperature(o),
        lowestT: getLowestTemperature(o),
        rainRate: getRainRate(o)
      })
      // console.log(locationObj[0].locationName[0])
      // console.log(getLocationWeather(locationObj[0]))
      // console.log(getHighestTemperature(locationObj[0]))
      // console.log(getLowestTemperature(locationObj[0]))
      // console.log(getRainRate(locationObj[0]))
    }
    return null
}

module.exports = {
  getWeather
}