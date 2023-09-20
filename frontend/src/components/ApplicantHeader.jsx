import {NavLink, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import useLogin from "../hooks/useLogin.js";

export default function ApplicantHeader() {
    const isLoggedIn = useSelector(state => state.user.accessToken)
    const customBranding = useSelector(state => state.applicant.customBranding)

    const {handleLogout} = useLogin()
    const {listSlug} = useParams()


    const handleLogoutClick = () => {
        handleLogout(`/list/${listSlug}`)
    }

    return (
        <div className="flex flex-col w-full">
            <div className={`px-4 md:px-8 max-w-[1180px] w-full`}>
                <div className="navbar w-full">
                    <div
                        className={`${isLoggedIn ? "navbar-start justify-start" : "navbar-center justify-center"} flex flex-grow gap-2 items-baseline w-full text-xs md:text-sm lg:text-base opacity-70`}>
                        <div>
                            <span className="block">powered by</span>
                        </div>
                        <NavLink to={"/"} className="normal-case font-bold font-sans">fairQ</NavLink>
                        <div>
                            <span className="hidden sm:block">- we make waiting transparent & efficient</span>
                        </div>
                    </div>
                    <div className="navbar-end w-fit">
                        {isLoggedIn && (
                            <button onClick={handleLogoutClick}
                                    className="btn btn-sm btn-outline rounded-md mx-3">
                                Log out
                            </button>
                        )}
                    </div>
                </div>

            </div>
            {(customBranding && customBranding.banner) &&
                <div
                    className="w-full h-40 bg-cover bg-no-repeat bg-center"
                    style={{backgroundImage: `url(${customBranding.banner})`}}
                >
                </div>
            }
        </div>

    )
}
