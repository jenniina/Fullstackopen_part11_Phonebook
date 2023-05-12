import '@testing-library/jest-dom/extend-expect'
import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Person from '../Person'
import { user } from '../../interfaces'
import PersonList from '../PersonList'

describe('Testing rendering', () => {
  test('calls delete', () => {
    const person = {
      name: 'Name Namerson',
      number: '050-5050505',
      id: '3b92ba958876458e0a5dc613',
    }

    const user: user = {
      username: 'Testi',
      name: 'Testi Testaaja',
      people: [
        {
          id: '3b92ba958876458e0a5dc613',
          name: 'Name Namerson',
          number: '050-5050505',
        },
      ],
      id: '645dc92be0aa95613583b887',
    }
    const removePerson = vi.fn()

    render(
      <table>
        <tbody>
          <Person person={person} removePerson={removePerson} user={user} />
        </tbody>
      </table>
    )

    expect(screen.getByText(/Namerson/i)).toBeDefined()

    const deleteBtn = screen.getByText(/delete/i)

    fireEvent.click(deleteBtn)

    expect(removePerson).toBeCalledTimes(1)

    //screen.debug()
  })
  test('renders list', () => {
    const persons = [
      {
        name: 'Testi Testaaja1',
        number: '050-5050505',
        id: '3b92ba958876458e0a5dc613',
      },
      {
        name: 'Testi Testaaja2',
        number: '050-5050505',
        id: '6458e0a5dc6133b92ba95887',
      },
    ]

    const user: user = {
      username: 'Testi',
      name: 'Testi Testaaja',
      people: [
        {
          id: '3b92ba958876458e0a5dc613',
          name: 'Testi Testaaja1',
          number: '050-5050505',
        },
        {
          id: '6458e0a5dc6133b92ba95887',
          name: 'Testi Testaaja2',
          number: '050-5050505',
        },
      ],
      id: '645dc92be0aa95613583b887',
    }
    const search = vi.fn(() => persons)
    const removePerson = vi.fn()

    render(
      <table>
        <tbody>
          <PersonList
            persons={persons}
            search={search}
            removePerson={removePerson}
            user={user}
          />
        </tbody>
      </table>
    )

    expect(screen.getByText(/Testaaja1/i)).toBeDefined()
    expect(screen.getByText(/Testaaja2/i)).toBeDefined()
  })
})
