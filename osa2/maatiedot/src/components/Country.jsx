const Country = ({countryName, handleClick}) => {
    return(
        <>
        <p>{countryName}<button onClick={() => handleClick(countryName)}>show</button></p>
        </>
    )
  }

export default Country