import {NavLink} from "react-router-dom";
import {BiErrorAlt} from "react-icons/bi";

export default function Error({title, explanation, resolution, resolutionFunc}) {

    return (
        <div className="hero flex flex-col items-center justify-center select-none">
            <div className="text-center">
                <BiErrorAlt size="100" className="mx-auto opacity-50 text-error"/>
                <h1 className="text-3xl font-bold mt-4 opacity-90">{title}</h1>
                <p className="text-xl mt-2">{explanation}</p>
                {resolution && <button className="mt-8 btn btn-neutral btn-outline rounded-md transition-all duration-300 cursor-pointer"
                                       onClick={() => resolutionFunc()}>{resolution}</button>}

            </div>
        </div>
    );
}
