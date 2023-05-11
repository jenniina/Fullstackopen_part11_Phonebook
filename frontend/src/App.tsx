import { FormEvent, useEffect, useState } from 'react'
import Filter from './components/Filter'
import Person from './components/Person'
import NewPerson from './components/NewPerson'
import Notification from './components/Notification'
import { person } from './interfaces'
import personService from './services/persons'

type style = 'message' | 'error'

const App = () => {
  const [persons, setPersons] = useState<person[]>([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [q, setQ] = useState('')
  const [searchParam] = useState(['name', 'number'])
  const [message, setMessage] = useState<string | null>(null)
  const [style, setStyle] = useState<style>('message')

  useEffect(() => {
    personService.getAll().then((initialPersons: person[]) => {
      setPersons(initialPersons)
    })
  }, [])

  const addName = (event: FormEvent) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    //if (!validatePhoneNumber(newNumber)) alert("Please enter a valid phone number") else
    if (persons.find((person) => person.name === newName && person.number === newNumber))
      alert(`${newName} is already in the phonebook`)
    else if (
      persons.find((person) => person.name === newName && person.number !== newNumber)
    ) {
      const result = confirm(`Would you like to change the number of ${newName}?`)
      if (result === true) {
        const person = persons.find((person) => person.name === newName)
        changeNumber(person?.id)
        setNewName('')
        setNewNumber('')
        setMessage(`${newName}'s number was changed`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    } else {
      personService
        .create(nameObject)
        .then((returned: person) => {
          setPersons(persons.concat(returned))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${newName}, number ${newNumber}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch((error) => {
          setStyle('error')
          setMessage(`${error.response.data.error}`)
          setTimeout(() => {
            setMessage(null)
            setStyle('message')
          }, 5000)
        })
    }
  }
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNumber(event.target.value)
  }
  // function validatePhoneNumber(input: string) {
  //   var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  //   return re.test(input);
  // }
  function search(people: any[]) {
    return people.filter((person) => {
      return searchParam.some((newPerson) => {
        return person[newPerson].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
      })
    })
  }
  const removePerson = (id: number | undefined) => {
    const person = persons.find((person) => person.id === id)
    const result = confirm(
      `Do you wish to delete ${person ? person.name : 'this person'}?`
    )
    if (result === true) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id))
          setMessage(`${person ? person.name : 'Name'} was removed`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch((error: any) => {
          setStyle('error')
          setMessage(
            `${person ? person.name : 'Name'} has already been removed from server`
          )
          console.log(error)
          setTimeout(() => {
            setMessage(null)
            setStyle('message')
          }, 5000)
        })
    }
  }
  const changeNumber = (id: number | undefined) => {
    const person = persons.find((person) => person.id === id)
    const changedPerson: person = { ...person, number: newNumber }

    personService.update(id, changedPerson).then((returnedPerson: person) => {
      setPersons(persons.map((person) => (person.id !== id ? person : returnedPerson)))
    })
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <h2>Add to phonebook</h2>
      <NewPerson
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <Notification message={message} style={style} />

      <h2>Numbers</h2>

      <Filter q={q} setQ={setQ} />

      <div className='flex column'>
        <table className='phonebook'>
          <tbody>
            {search(persons).map((person: person) => {
              return (
                <Person key={person.name} person={person} removePerson={removePerson} />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
