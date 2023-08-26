require('dotenv').config()
const express = require('express')
const app = express()
//axios for api
const axios = require('axios')
//bodyParser for form
const bodyParser = require('body-parser')
//for finding the location of user
const requestIp = require('request-ip')
const geoip = require('geoip-lite')
const PORT = 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.route('/')
	.get(async (req, res) => {
		/*find location of client*/

		const clientIp = requestIp.getClientIp(req)
		const geo = geoip.lookup(clientIp)
		let city ="Roorkee"
		
		if(geo)
			city = geo.city.trim()

		const data = await fetchData(city)
		res.render('index', data)
	})
	.post(async (req, res) => {
		const city = req.body.city.trim()
		const data = await fetchData(city)

		res.render('index', data)
	})

app.listen(PORT, err => {
	if(err)
		console.log(err)
	console.log(`Server running on port ${PORT}`)
})
async function fetchData(city){

	//fetch weather data using axios
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`
	const response = await axios.get(url);
	const result = response.data
	const data = {
		city_name: city.slice(0,1).toUpperCase() + city.slice(1),
		temp: result.main.temp,
		humidity: result.main.humidity,
		wind_speed: result.wind.speed,
		desc: result.weather[0].main
	}
	return data
}