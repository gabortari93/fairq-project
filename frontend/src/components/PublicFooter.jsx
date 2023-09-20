import {NavLink} from "react-router-dom";

export default function PublicFooter() {
    return (
        <div className="w-full flex flex-col bg-secondary bg-opacity-20 items-center">
            <footer className="footer p-10 max-w-[1180px] text-neutral-700">
                <div>
                    <p className="text-xl pb-4">fairQ</p>
                    <p>© since 2023</p>
                    <NavLink to="/privacy" reloadDocument={true}  className="link link-hover">Privacy policy</NavLink>
                </div>
                <div>
                    <span className="footer-title">Product</span>
                    <a className="link link-hover">Features</a>
                    <a className="link link-hover">Pricing</a>
                    <a className="link link-hover">Roadmap</a>
                </div>
                <div>
                    <span className="footer-title">Use Cases</span>
                    <a className="link link-hover">For sports clubs</a>
                    <a className="link link-hover">For community gardens</a>
                    <a className="link link-hover">For public resources</a>
                </div>
                <div>
                    <span className="footer-title">Resources</span>
                    <a className="link link-hover">Help center</a>
                    <a className="link link-hover">API</a>
                    <a className="link link-hover">Legal</a>
                </div>
                <div>
                    <span className="footer-title">Company</span>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Careers</a>
                </div>
            </footer>
        </div>
    )
}
