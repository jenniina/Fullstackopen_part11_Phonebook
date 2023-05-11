import { person } from '../interfaces'

interface persona {
  person: person
  removePerson: (id: number | undefined) => void
}

const Person = ({ person, removePerson }: persona) => {
  return (
    <tr key={person.id}>
      <th>{person.name}</th>
      <td>{person.number}</td>
      <td>
        <button
          onClick={() => removePerson(person.id)}
          className={person.name
            ?.replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .toLowerCase()}
        >
          delete
        </button>{' '}
      </td>
    </tr>
  )
}
export default Person
