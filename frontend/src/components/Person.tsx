import { person, user } from '../interfaces'

interface persona {
  person: person
  removePerson: (id: string | undefined) => void
  user: user | undefined
}

const Person = ({ person, removePerson, user }: persona) => {
  return (
    <tr key={person.id}>
      <th>{person.name}</th>
      <td>{person.number}</td>
      {user ? (
        <td>
          <button
            onClick={() => removePerson(person.id)}
            className={`delete ${person.name
              ?.replace(/\s+/g, '-')
              .replace(/[^a-zA-Z0-9 ]/g, '')
              .toLowerCase()}`}
          >
            delete
          </button>
        </td>
      ) : (
        ''
      )}
    </tr>
  )
}
export default Person
