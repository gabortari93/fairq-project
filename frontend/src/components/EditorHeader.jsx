import {NavLink} from "react-router-dom";
import {Fragment, useEffect, useRef, useState} from "react";
import useLogin from "../hooks/useLogin.js";
import {useSelector} from "react-redux";

export default function EditorHeader({className}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const {handleLogout} = useLogin()
    const userDetails = useSelector(state => state.user.details)
    const memberships = useSelector(state => state.editor.memberships)

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleMenuItemClick = () => {
        setIsOpen(false);
    };

    const handleLogoutClick = () => {
        handleLogout()
        setIsOpen(false)
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    if (!userDetails || !memberships) {
        return (<></>)
    } else {
        return (
            <div className={`px-4 md:px-8 max-w-[1180px] w-full`}>
                <div className="navbar w-full p-0 items-center">
                    <div className="navbar-start">
                        <NavLink to={"/editor"} className="normal-case text-3xl font-bold text-primary">fairQ</NavLink>
                    </div>
                    <div className="navbar-end">
                        <ul className="menu menu-horizontal items-center">
                            <li className="hidden sm:block">
                                <div className="avatar placeholder">
                                    <div className="bg-accent text-white rounded-full w-8">
                                        <NavLink
                                            to={"/editor/user/settings/personal"}>{userDetails.first_name[0]}{userDetails.last_name[0]}</NavLink>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <details open={isOpen} onClick={handleClick} ref={dropdownRef} className="z-40">
                                    <summary className="menu-dropdown-toggle">
                                        <button onClick={handleClick}>Account</button>
                                    </summary>
                                    <ul className="p-2 bg-base-100 right-[0] menu-dropdown">
                                        <li className="pt-4 pb-2 text-xs text-neutral-400 uppercase">Personal</li>
                                        <li><NavLink to={"/editor/user/settings/personal"}
                                                     onClick={handleMenuItemClick}>Update
                                            profile</NavLink></li>
                                        <li><NavLink to={"/editor/user/settings/password"}
                                                     onClick={handleMenuItemClick}>Change
                                            Password</NavLink></li>
                                        {memberships?.filter((m) => m.role > 1).map((membership, index) => {
                                            return <Fragment key={`membership-${index}-${membership.id}`}>
                                                <li className="pt-4 pb-2 text-xs text-neutral-400 uppercase"
                                                    onClick={handleClick}>{membership.organisation.name}
                                                </li>
                                                <li><NavLink
                                                    to={`/editor/org/${membership.organisation.id}/settings/general`}
                                                    onClick={handleMenuItemClick}>Update
                                                    information</NavLink>
                                                </li>
                                                <li><NavLink
                                                    to={`/editor/org/${membership.organisation.id}/settings/team`}
                                                    onClick={handleMenuItemClick}>Manage
                                                    team</NavLink></li>
                                                <li><NavLink
                                                    to={`/editor/org/${membership.organisation.id}/settings/branding`}
                                                    onClick={handleMenuItemClick}>Branding
                                                    (logo, colors,
                                                    fonts)</NavLink></li>
                                            </Fragment>
                                        })}

                                        <li className="pt-4 pb-2 text-xs text-neutral-400 uppercase">Logout</li>
                                        <li><a onClick={handleLogoutClick}>Log me out</a></li>
                                    </ul>
                                </details>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
