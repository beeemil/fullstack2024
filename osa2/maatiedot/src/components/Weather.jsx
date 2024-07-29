const Weather = ({weather}) => {
    console.log('Weather Component', weather)
    const temp = Math.round(weather.main.temp - 273.15) * 100) / 100
    const imgUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    return(
        <>
        <h2>Weather in {weather.name}</h2>
        <p>Temperature {temp} Celsius</p>
        <img src={imgUrl}/>
        <p>Wind {weather.wind.speed} m/s</p>
        </>
    )
  }

export default Weather
