export default function SelectionField({
                                           is_required = false,
                                           label,
                                           sublabel,
                                           id,
                                           options,
                                           value,
                                           onChange,
                                           is_controlled = true,
                                           placeholder = "Select a value",
                                           errorMessage,
                                           disabled=false,
                                           size = "md"
                                       }) {

    return <div className="form-control w-full">
        <label className="label h-8">
            <span className="label-text">
                {label}
                {is_required ? "*" : ""}
                {sublabel && <span className="text-neutral-500"> - {sublabel}</span>}
            </span>
        </label>
        {is_controlled ? (
            <select id={id}
                    className={`select select-${size} select-bordered w-full rounded-lg font-normal disabled:border-opacity-100 disabled:border-neutral-200`}
                    onChange={onChange}
                    disabled={disabled}
                    value={value || ""}>
                <option value="" disabled className="font-normal">{placeholder}</option>
                {options ? (
                    options.map((option, index) => {
                        // If the option object has key and value properties
                        if (option.key !== undefined && option.value !== undefined) {
                            return <option value={option.key} key={option.key}>{option.value}</option>
                        }
                        // If the option object has a dynamic key-value pair
                        else {
                            const key = Object.keys(option)[0];
                            const value = option[key];
                            return <option value={key} key={key}>{value}</option>
                        }
                    })
                ) : (<option>No options available</option>)
                }
            </select>
        ) : (
            <select id={id}
                    className={`select select-${size} select-bordered w-full rounded-lg font-normal disabled:border-opacity-100 disabled:border-neutral-200`}
                    onChange={onChange}
                    disabled={disabled}
                    defaultValue={value || ""}>
                <option value="" disabled>{placeholder}</option>
                {options ? (
                    options.map((option, index) => {
                        // If the option object has key and value properties
                        if (option.key !== undefined && option.value !== undefined) {
                            return <option value={option.key} key={option.key}>{option.value}</option>
                        }
                        // If the option object has a dynamic key-value pair
                        else {
                            const key = Object.keys(option)[0];
                            const value = option[key];
                            return <option value={key} key={key}>{value}</option>
                        }
                    })
                ) : (<option>No options available</option>)
                }
            </select>
        )}
        <span className="text-error text-sm h-8 block">{errorMessage}</span>

    </div>;
}
