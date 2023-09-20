export default function TextareaField({
                                          placeholder = "Enter a value",
                                          is_required = false,
                                          onBlur,
                                          onChange,
                                          is_controlled = true,
                                          label, sublabel, id, style, errorMessage, value,
                                            size="md"

                                      }) {
    return <div className={`form-control w-full ${style}`}>

            <label className="label h-8">
                {label &&
                <span className="label-text">
                    {label}
                    {is_required ? "*" : ""}
                    {sublabel && <span className="opacity-50 ml-1">- {sublabel}</span>}
                </span>
                    }
            </label>

        {
            is_controlled ? (<textarea className={`textarea textarea-${size} textarea-bordered h-36 rounded-lg px-4 py-2 text-${size}`}
                                       id={id}
                                       value={value}
                                       placeholder={placeholder}
                                       onChange={onChange}
                                       onBlur={onBlur}/>) : (
                <textarea className={`textarea textarea-${size} textarea-bordered h-36 rounded-lg px-4 py-2 text-${size}`}
                          id={id}
                          defaultValue={value}
                          placeholder={placeholder}
                          onChange={onChange}
                          onBlur={onBlur}/>)
        }

        <span className="text-error text-sm h-8 block text-left">{errorMessage}</span>
    </div>;
}