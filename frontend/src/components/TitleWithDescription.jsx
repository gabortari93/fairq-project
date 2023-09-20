export default function TitleWithDescription({
                                                 title ="Title",
                                                 description="",
                                                 style ="",
                                                 text_style ="",
                                                 description_style="",
                                                 align="start"
                                             }) {
    return (
        <div className={`mt-8 mb-12 w-full text-${align}`}>
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold`}>{title}</h1>
            <p className={`pt-8 text-lg opacity-90 leading-relaxed text-${align}`}>{description}</p>
        </div>
    );

}