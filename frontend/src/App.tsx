import { FormEvent, useEffect, useRef, useState } from 'react'
import Filter from './components/Filter'
import Person from './components/Person'
import NewPerson from './components/NewPerson'
import Notification from './components/Notification'
import { person, user } from './interfaces'
import personService from './services/persons'
import loginService from './services/login'
import Accordion from './components/Accordion'
import FormLogin from './components/FormLogin'
import PersonList from './components/PersonList'

type style = 'message' | 'error'

const App = () => {
  const [persons, setPersons] = useState<person[]>([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [q, setQ] = useState('')
  const [searchParam] = useState(['name', 'number'])
  const [message, setMessage] = useState<string | null>(null)
  const [style, setStyle] = useState<style>('message')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<user | undefined>(undefined)
  const formLoginRef = useRef(null)
  const formPersonRef = useRef(null)

  const LoggedIn = 'loggedPhonebookAppUser'

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
  const removePerson = (id: string | undefined) => {
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
  const changeNumber = (id: string | undefined) => {
    const person = persons.find((person) => person.id === id)
    const changedPerson: person = { ...person, number: newNumber }

    personService.update(id, changedPerson).then((returnedPerson: person) => {
      setPersons(persons.map((person) => (person.id !== id ? person : returnedPerson)))
    })
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(LoggedIn)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      personService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      personService.setToken(user.token)
      window.localStorage.setItem(LoggedIn, JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (e) {
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    personService.setToken(null)
    window.localStorage.removeItem(LoggedIn)
    setUser(undefined)
  }

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={message} style={style} />

      {!user ? (
        <>
          <Accordion className='' text='login' ref={formLoginRef}>
            <FormLogin
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Accordion>
        </>
      ) : (
        <>
          <p>
            {user?.name} is logged in <button onClick={handleLogout}>logout</button>
          </p>
          <div className='accordion-wrapper'>
            <Accordion className='right' text='Add to phonebook' ref={formPersonRef}>
              <h2>Add to phonebook</h2>
              <NewPerson
                addName={addName}
                newName={newName}
                handleNameChange={handleNameChange}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
              />
            </Accordion>
          </div>
        </>
      )}
      <h2>Numbers</h2>

      <Filter q={q} setQ={setQ} />

      <PersonList
        persons={persons}
        search={search}
        removePerson={removePerson}
        user={user}
      />
    </div>
  )
}

export default App
