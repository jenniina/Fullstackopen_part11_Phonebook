import { person, user } from '../interfaces'
import Person from './Person'

interface persona {
  persons: person[]
  search: (people: person[]) => person[]
  removePerson: (id: string | undefined) => void
  user: user | undefined
}

const PersonList = ({ persons, search, removePerson, user }: persona) => {
  return (
    <div className='flex column'>
      <table className='phonebook'>
        <tbody>
          {search(persons).map((person: person) => {
            return (
              <Person
                key={person.name}
                person={person}
                removePerson={removePerson}
                user={user}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
export default PersonList
