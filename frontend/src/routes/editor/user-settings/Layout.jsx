import {Outlet} from "react-router-dom";
import TabNavigation from "../../../components/TabNavigation.jsx";

export default function UserSettingsLayout() {
    const tabs = [
        {to: "/editor/user/settings/personal", label: "Profile"},
        {to: "/editor/user/settings/password", label: "Change password"},

    ];

    return (
        <div className="max-w-[1180px] w-full px-4 md:px-8">
            <TabNavigation tabs={tabs} title="Personal settings"/>
            <Outlet/>
        </div>);
}

