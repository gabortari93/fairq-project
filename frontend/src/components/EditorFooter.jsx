import {NavLink} from "react-router-dom";

export default function EditorFooter() {
    return (
        <div className="w-full bg-secondary bg-opacity-100 flex flex-col items-center">
            <footer className="footer p-10 max-w-[1180px] text-base-100">
                <div>
                    <p className="text-xl pb-4">fairQ</p>
                    <p>© since 2023</p>
                    <NavLink to="/privacy" reloadDocument={true} className="link link-hover">Privacy policy</NavLink>
                </div>
                <div>
                    <a className="link link-hover font-bold">Help Center</a>
                </div>
                <div>
                    <a className="link link-hover font-bold">Contact support</a>
                </div>
                <div>
                    <a className="link link-hover font-bold">Legal</a>
                </div>
                <div>
                    <a className="link link-hover font-bold">About fairQ</a>
                </div>
            </footer>
        </div>
    )
}
