const TextAreaInput = ({ label, id, name }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <textarea
                id={id}
                name={name}
                rows="3"
                className="w-full rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
        </div>
    );
};

export default TextAreaInput;
