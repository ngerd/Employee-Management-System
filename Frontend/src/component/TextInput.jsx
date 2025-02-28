const TextInput = ({ label, id, name }) => {
    return (
        <div className="col-span-6 sm:col-span-3">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="text"
                id={id}
                name={name}
                className="m-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );
};

export default TextInput;
