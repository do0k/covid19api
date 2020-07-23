const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 8000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

app.get('/', (req, res) => {
    fetch('https://api.covid19api.com/summary')
        .then(result => result.json())
        .then(data => res.json(data))
})

app.get('/stats/:country', async(req, res) => {
    const countryName = req.params.country

    const response = await fetch(`https://api.covid19api.com/country/${countryName}`)
    await response.json()
        .then(data => {
            res.json(data[data.length - 1])
        })
})

app.get('/stats/:country/:date', async(req, res) => {
    const countryName = req.params.country
    const date = new Date(req.params.date)
    const tempDate = new Date(date)
    const newdate = new Date(tempDate.setDate(tempDate.getDate() + parseInt(1)))
    console.log(`https://api.covid19api.com/country/${countryName}?from=${date.toISOString()}&to=${newdate.toISOString()}`)
    const response = await fetch(`https://api.covid19api.com/country/${countryName}?from=${date.toISOString()}&to=${newdate.toISOString()}`)
    await response.json()
        .then(data => {
            res.json(data[0])
        })
})

app.get('/ranking/cases', async(req, res) => {
    const response = await fetch('https://api.covid19api.com/summary')
    await response.json()
        .then(async data => {
            let list = data.Countries
            await list.sort((a, b) => (parseInt(b.TotalConfirmed) - parseInt(a.TotalConfirmed)))
            await res.json(list)
        })
})

app.get('/ranking/deaths', async(req, res) => {
    const response = await fetch('https://api.covid19api.com/summary')
    await response.json()
        .then(async data => {
            let list = data.Countries
            await list.sort((a, b) => (parseInt(b.TotalDeaths) - parseInt(a.TotalDeaths)))
            await res.json(list)
        })
})

app.get('/ranking/recovered', async(req, res) => {
    const response = await fetch('https://api.covid19api.com/summary')
    await response.json()
        .then(async data => {
            let list = data.Countries
            await list.sort((a, b) => (parseInt(b.TotalRecovered) - parseInt(a.TotalRecovered)))
            await res.json(list)
        })
})

app.listen(PORT, () => {
    console.log(`Server Running on port: ${ PORT }`)
})