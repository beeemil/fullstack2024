import { useState, useEffect } from 'react'
import personService from './services/persons'

import Filter from './components/Filter'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('notification')
  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    const exists = (name) => name.name === newName
    if (persons.some(exists)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updateId = persons.find(person => person.name === newName).id
        console.log('updating', updateId)
        personService
        .update(updateId, nameObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== updateId ? person : returnedPerson))
          console.log('putrespo', returnedPerson)
          setNotificationMessage(
            `${nameObject.name} updated successfully`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log('error', error)
          setNotificationType('error')
          setNotificationMessage(
            `${error.response.data.error}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType('notification')
          }, 5000)
      })
      }
    } else {
      personService
      .create(nameObject)
      .then(newPersons => {
          setPersons(persons.concat(newPersons))
          setNewName('')
          setNewNumber('')
          setNotificationMessage(
            `${nameObject.name} added successfully`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log('error', error)
          setNotificationType('error')
          setNotificationMessage(
            `${error.response.data.error}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType('notification')
          }, 5000)
      })
    }
  }

  const removeName = ({id, name}) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setNotificationType('error')
        setNotificationMessage(
          `${name} removed successfully`
        )
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationType('notification')
        }, 5000)
    })
    .catch(error => {
      personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
      setNotificationType('error')
      setNotificationMessage(
        `${name} was already deleted from server`
      )
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType('notification')
      },5000)
    })
    }
  
  }
  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    //console.log(event.target.value)
    setNewFilter(event.target.value)
    setShowAll(false)
  }
  console.log('persons',persons)
  const personsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toUpperCase().includes(filterName.toUpperCase()))
  console.log('personsToShow',personsToShow)
  return ( 
    <div>
      <h2>Phonebook</h2>
      <Notification message = {notificationMessage} type = {notificationType}/>
        <Filter filterName={filterName} handleFilterChange={handleFilterChange}/>
      <h2>Add a new</h2>
        <PersonForm addName = {addName} newName = {newName} handleNameChange = {handleNameChange} newNumber = {newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <ul>
      {personsToShow.map(person => (<Person key = {person.number} person={person} removeName={removeName}/>))}
      </ul>
    </div>
  )

}

export default App