import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import CountryInfo from './components/CountryInfo'
import Country from './components/Country'
import axios from 'axios'


function App() {
  const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/"
  const [countries, setCountries] = useState([]) 
  const [filterName, setNewFilter] = useState('')
  const [showCountries, setShowCountries] = useState(false)
  const [showCountry, setShowCountry] = useState(false)
  const [country, setCountry] = useState({})
  const [weather, setWeather] = useState({})
  const api_key = import.meta.env.VITE_SOME_KEY
  
  useEffect(() => {
    console.log('effect')
    if (filterName) {
      axios
      .get(`${baseUrl}/all`)
      .then(initialCountries => {
        console.log('promise fulfilled')
        const data = initialCountries.data
        const countriesToShow = data.filter(country => country.name.common.toUpperCase().includes(filterName.toUpperCase()))
        if (countriesToShow.length <= 10 && countriesToShow.length > 1) {
          console.log('10 tai alle', countries.length)
          setShowCountries(true)
          setShowCountry(false)
          setCountries(countriesToShow)
      } else if (countriesToShow.length === 1) {
        const name = countriesToShow[0].name.common
        console.log('countryName',name)
        axios
        .get(`${baseUrl}/name/${name}`)
        .then(resp => {
          console.log('promise fulfilled, singlecountry')
          setCountry(resp.data)
          setShowCountry(true)
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${resp.data.capitalInfo.latlng[0]}&lon=${resp.data.capitalInfo.latlng[1]}&appid=${api_key}`
          axios
          .get(weatherUrl)
          .then(resp2 => {
            console.log('weatherData', resp2.data)
            setWeather(resp2.data)
            setShowCountries(false)
            setCountries([])
          })
          
        })

      } else {
        setCountries([])
        setShowCountries(false)
        setShowCountry(false)
      }
      })
    }
  }, [filterName])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleClick = country => {
    setNewFilter(country)

  }
  return (
    <>
    <Filter filterName={filterName} handleFilterChange={handleFilterChange}/>
    {showCountries 
    ?countries.map(
      country => 
        <Country key = {country.name.common} countryName = {country.name.common} handleClick={handleClick}/>)
    :showCountry
      ?<CountryInfo country = {country} weather = {weather}/>
      :<p>morefilter</p>}
    </>
  )
}

export default App
