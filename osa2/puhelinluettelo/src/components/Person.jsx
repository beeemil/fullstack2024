const Person = ({person, removeName}) => {
    return(
      <li>{person.name} {person.number} <button onClick={() => removeName({id:person.id, name:person.name})}>delete</button></li>
    )
  }

export default Person