
interface form {
    newName: string,
    newNumber: string,
    addName: (event: React.FormEvent) => void,
    handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleNumberChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Filter = ({ addName, newName, handleNameChange, newNumber, handleNumberChange }: form) => {
    return (
        <form onSubmit={addName}>
            <table>
                <tbody>
                    <tr>
                        <th><label htmlFor="inputName">name: </label></th>
                        <td>
                            <input
                                id="inputName"
                                required
                                value={newName}
                                onChange={handleNameChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th><label htmlFor="inputNumber">number: </label></th>
                        <td><input
                            id="inputNumber"
                            required
                            value={newNumber}
                            onChange={handleNumberChange}
                        />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button type="submit">
                add
            </button>
        </form>


    )
}
export default Filter