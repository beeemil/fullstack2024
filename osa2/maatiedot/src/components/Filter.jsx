const Filter = ({filterName, handleFilterChange}) => {
    return(
      <div>filter countries: <input value = {filterName} onChange={handleFilterChange}/></div>
    )
  }

export default Filter