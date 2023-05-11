import { person } from '../interfaces'
interface q {
    q: string,
    setQ: React.Dispatch<React.SetStateAction<string>>
}

const Filter = ({ q, setQ }: q) => {
    return (
        <label htmlFor="search-form" className="flex column">
            <span>Search phonebook: </span>
            <input
                type="search"
                name="search-form"
                id="search-form"
                placeholder="Search for..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />
        </label>
    )
}
export default Filter