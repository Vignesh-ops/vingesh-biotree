

const Inputfield = ({ type = 'text', value, onChange, label,placeholder,autoComplete="" }) => {
    return (
        <div className="mb-4" >
            {label && <label className="text-md font-medium text-white-700 mb-1">{label}</label>}
            <input className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
            />
        </div>

    )

}



export default Inputfield;