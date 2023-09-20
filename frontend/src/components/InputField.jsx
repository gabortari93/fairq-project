import {FiExternalLink} from "react-icons/fi";

export default function InputField({
                                       type = "text",
                                       placeholder = "Enter a value",
                                       is_required = false,
                                       is_controlled = true,
                                       label,
                                       sublabel,
                                       id,
                                       onBlur,
                                       onChange,
                                       errorMessage,
                                       value,
                                       browser_validate = true,
                                       size = "md",
                                       linkURL,
                                       linkTitle = "open",
                                       linkTarget = "_self",
                                       disabled=false
                                   }) {

    return (
        <div className={`w-full`}>
            <div className="flex h-16 sm:h-8 justify-start items-baseline">
                <label className="label inline">
                    {label &&
                        <span className="label-text leading-tight text-neutral">{label}
                            {is_required ? "*" : ""}
                            {sublabel && <span className="text-neutral-500"> - {sublabel}</span>}
                    </span>
                    }
                </label>
                {linkURL &&
                    <>
                        <span className="opacity-50 mx-1 text-sm text-primary">-</span>
                    <a className="flex flex-row justify-start items-center gap-1 text-sm text-accent" href={linkURL} target={linkTarget}>
                        {linkTitle}
                        <FiExternalLink/>
                    </a>
                    </>
                }
            </div>

            {
                is_controlled ? (<input
                    value={value}
                    type={type}
                    placeholder={placeholder}
                    required={(is_required && browser_validate)}
                    className={`input input-${size} w-full input-bordered rounded-lg disabled:border-opacity-100 disabled:border-neutral-200`}
                    id={id}
                    disabled={disabled}
                    onBlur={onBlur}
                    onChange={onChange}
                />) : (<input
                    defaultValue={value}
                    type={type}
                    placeholder={placeholder}
                    required={(is_required && browser_validate)}
                    className={`input input-${size} w-full input-bordered rounded-lg disabled:border-opacity-100 disabled:border-neutral-200`}
                    id={id}
                    disabled={disabled}
                    onBlur={onBlur}
                    onChange={onChange}
                />)
            }
            <span className="text-error text-sm h-8 block text-left">{errorMessage}</span>
        </div>)
        ;
}