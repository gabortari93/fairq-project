import {NavLink} from "react-router-dom";

export default function PublicHeader() {
    return (
        <div className={`px-4 py-2 md:px-8 bg-primary w-full flex flex-col items-center`}>
                <div className="navbar w-full p-0 items-center max-w-[1180px]">
                <div className="navbar-start">
                    <NavLink to={"/"} className="normal-case text-3xl font-bold text-base-100">fairQ</NavLink>

                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 text-base-100 text-base">
                        <li className="px-10"><a>Features</a></li>
                        <li className="px-10"><a>Solutions</a></li>
                        <li className="px-10"><a>Pricing</a></li>
                        <li className="px-10"><a>Support</a></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <NavLink to={"/sign-in"} className="btn bg-base-100 rounded-md mx-3">Log in</NavLink>
                    <NavLink to={"/sign-up"} className="btn bg-base-100 rounded-md mx-3">Sign up</NavLink>
                </div>
            </div>
        </div>
    )
}
