interface YearFilterProps {
    years: number[];
    selectedYear: string;
    onChange: (year: string) => void;
}

const YearFilter = ({ years, selectedYear, onChange }: YearFilterProps) => {
    return (
        <div className="w-full max-w-[220px]">
            <label htmlFor="yearFilter" className="sr-only">
                Filter cars by year
            </label>
            <select
                id="yearFilter"
                value={selectedYear}
                onChange={(event) => onChange(event.target.value)}
                className="custom-filter__btn"
            >
                <option value="all">All years</option>
                {years.map((year) => (
                    <option key={year} value={String(year)}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default YearFilter;
