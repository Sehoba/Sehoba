export default function CategorySelect({ categories, styles, value, onChangeCategory, onChangeStyle }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectField
        label="Kategorie"
        options={categories}
        value={value.category}
        onChange={onChangeCategory}
      />
      <SelectField
        label="Stil"
        options={styles}
        value={value.style}
        onChange={onChangeStyle}
      />
    </div>
  );
}

function SelectField({ label, options, value, onChange }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <select
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
