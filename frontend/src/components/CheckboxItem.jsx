import {FiExternalLink} from "react-icons/fi";

export default function CheckboxItem({
                                         label = "Default label",
                                         id,
                                         checked = false,
                                         is_controlled = true,
                                         disabled = false,
                                         style,
                                         onClick,
                                         onChange,
                                         errorMessage,
                                         linkURL,
                                         linkTitle = "open",
                                         linkTarget = "_self",
                                     }) {


    return (
        <div className={`pt-2.5 ${style}`}>
            <div className="form-control">
                <label htmlFor={id} className="flex justify-start items-center gap-2.5 cursor-pointer select-none">
                    {is_controlled ? (
                        <input type="checkbox"
                               checked={checked}
                               disabled={disabled}
                               id={id}
                               className="checkbox checkbox-primary"
                               onClick={onClick}
                               onChange={onChange}/>
                    ) : (
                        <input type="checkbox"
                               defaultChecked={checked}
                               disabled={disabled}
                               id={id}
                               className="checkbox"
                               onClick={onClick}
                               onChange={onChange}/>
                    )}
                    <span className="label-text text-left inline">{label}

                        {linkURL &&
                            <>
                                <span className="opacity-50 mx-1 text-sm text-primary">-</span>
                                <a className="inline-flex flex-row justify-start items-center gap-1 text-sm text-primary"
                                   href={linkURL} target={linkTarget}>
                                    {linkTitle}
                                    <FiExternalLink/>
                                </a>
                            </>
                        }
                    </span>

                </label>
                <span className="text-error text-sm mt-2 ml-8">{errorMessage}</span>
            </div>


        </div>
    );
}