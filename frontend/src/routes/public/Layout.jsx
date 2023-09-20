import {Outlet} from "react-router-dom";
import PublicHeader from "../../components/PublicHeader.jsx";
import PublicFooter from "../../components/PublicFooter.jsx";

export default function PublicLayout() {

    return (
        <div className="min-h-screen flex flex-col items-center">
            <PublicHeader className="w-full"/>
            <div className="max-w-[1180px] w-full flex-grow overflow-auto flex">
                <Outlet/>
            </div>
            <PublicFooter className="w-full"/>
        </div>);
}

