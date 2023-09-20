import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {AiOutlineFileSearch} from "react-icons/ai";

export default function NotFound() {
    useEffect(() => {
        document.title = `Page not found - fairQ`;
    });

    return (
        <div className="hero flex flex-col items-center justify-center select-none">
            <div className="text-center">
                <AiOutlineFileSearch size="100" className="mx-auto opacity-50 text-error"/>
                <h1 className="text-3xl font-bold mt-4 opacity-90">Oops!</h1>
                <p className="text-xl mt-2">We couldn't find the page you're looking for.</p>
                <p className="text-md mt-2">The page may have been removed or is temporarily unavailable.</p>
                <NavLink to="/" className="mt-8 btn btn-neutral btn-outline rounded-md transition-all duration-300 cursor-pointer">Return to Home</NavLink>
            </div>
        </div>
    );
}
