import {useSelector} from "react-redux";
import {NavLink} from "react-router-dom";

export default function ApplicantFooter({customBranding = false}) {
    const waitingList = useSelector(state => state.applicant.waitingList)

    return (
        <div className={`w-full ${customBranding? `opacity-70` : `bg-base-200`} flex flex-col items-center`}>
            <footer className={`footer p-10 max-w-[1180px] flex flex-col sm:flex-row justify-between text-base-content  ${customBranding && `text-inherit`}`}>
                <div>
                    <NavLink to={"/"} reloadDocument={true} className="text-xl pb-4 font-bold font-sans">fairQ</NavLink>
                    <p>© since 2023</p>
                    <NavLink to={"/privacy"} className="link link-hover">Privacy policy</NavLink>
                </div>
                <div className="">
                    <span className="footer-title">About</span>
                    <a href={waitingList.organisation.website_url} target="_blank" className="link link-hover">Learn
                        more about {waitingList.organisation.name}</a>
                    <NavLink to={"/"} className="link link-hover">Learn more about fairQ</NavLink>
                </div>
            </footer>
        </div>
    )
}
