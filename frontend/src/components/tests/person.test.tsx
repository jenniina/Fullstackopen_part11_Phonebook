import '@testing-library/jest-dom/extend-expect'
import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Person from '../Person'

describe('Testing rendering', () => {
  test('calls delete', () => {
    const person = {
      name: 'Name Namerson',
      number: '050-5050505',
    }

    const removePerson = vi.fn()

    render(
      <table>
        <tbody>
          <Person person={person} removePerson={removePerson} />
        </tbody>
      </table>
    )

    expect(screen.getByText(/Namerson/i)).toBeDefined()

    const deleteBtn = screen.getByText(/delete/i)

    fireEvent.click(deleteBtn)

    expect(removePerson).toBeCalledTimes(1)

    //screen.debug()
  })
})
