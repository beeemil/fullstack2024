import Weather from './Weather'
const CountryInfo = ({country, weather}) => {
    console.log('Weather in countryInfo', weather)
    const languageMap = (langObj) => (
        Object.values(langObj).map((lang, idx) => (
            <li key = {idx}>{lang}</li>
        ))
    )
    
    return(
        <>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital[0]}</p>
        <p>Area {country.area}</p>
        <b>Languages</b>
        {languageMap(country.languages)}
        <img src={country.flags.png}/>
        <Weather weather={weather}/>
        </>
    )
  }

export default CountryInfo