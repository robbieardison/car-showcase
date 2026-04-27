interface SearchBarProps {
    query: string;
    onChange: (value: string) => void;
}

const SearchBar = ({ query, onChange }: SearchBarProps) => {
    return (
        <div className="searchbar">
            <div className="searchbar__item">
                <label htmlFor="carSearch" className="sr-only">
                    Search by make or model
                </label>
                <input
                    id="carSearch"
                    type="text"
                    placeholder="Cari berdasarkan merek atau model (contoh: Toyota, Civic)"
                    value={query}
                    onChange={(event) => onChange(event.target.value)}
                    className="searchbar__input rounded-full"
                />
            </div>
        </div>
    );
};

export default SearchBar;
