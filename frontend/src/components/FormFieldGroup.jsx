export default function FormFieldGroup({
                                           title = "Form field group title",
                                           intro = "This is some introductory text",
                                           style = null,
                                           children,
                                           align = "center",
                                       }) {

    return (<div className={`w-full block text-${align} pt-12`}>
        <h2 className="text-xl sm:text-2xl font-bold ">{title}</h2>
        <p className="text-neutral-700 text-lg mt-2">{intro}</p>
        <div className={`mt-6 flex flex-col items-${align}`}>
            {children}
        </div>
    </div>);
}