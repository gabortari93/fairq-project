import {useEffect} from "react";
import {NavLink} from "react-router-dom";

export default function Home() {
    useEffect(() => {
        document.title = `Home - fairQ`;
    });

    return (
        <div className="hero min-h-screen w-full">
            <div className="hero-content text-center">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-bold">Fair, transparent and efficient waiting experiences</h1>
                    <p className="py-12">Welcome to FairQ, the cutting-edge queue management solution designed
                        to
                        revolutionize how you handle queues. Say goodbye to opaque waiting processes and hello
                        to fairness, transparency, and efficiency. With FairQ, managing your queues has never
                        been easier.</p>
                    <NavLink to="/sign-up" className="btn btn-accent rounded-md">Get Started</NavLink>
                </div>
            </div>
        </div>
    );
}