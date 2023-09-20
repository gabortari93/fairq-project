import {useState, useEffect} from "react";
import {NavLink, useLocation} from "react-router-dom";

export default function TabNavigation({className, tabs, title, customFontColor, customAccentColor}) {
    const [activeTab, setActiveTab] = useState(0);
    const location = useLocation();

    useEffect(() => {
        // Find the index of the tab whose 'to' prop matches the current URL
        const index = tabs.findIndex((tab) => tab.to === location.pathname);
        if (index !== -1) {
            setActiveTab(index);
        }
    }, [location.pathname, tabs]);

    const handleClick = (index) => {
        setActiveTab(index);
    };

    const customFontStyle = (customFontColor, customAccentColor) => {
        if (customFontColor && customAccentColor) {
                return ({color: customFontColor, borderColor:customAccentColor})
        }
    }

    return (
        <div className="mt-8">
            {title && <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12">{title}</div>}
            <div className="tabs flex w-full sm:border-b-2 gap-x-8 flex-col sm:flex-row md:gap-x-12 lg:gap-x-20">
                {tabs.map((tab, index) => (
                    <NavLink
                        key={index}
                        style={customFontStyle(customFontColor, customAccentColor)}
                        to={tab.to}
                        className={`tab font-semibold tab-lg  p-0 w-full sm:w-fit ${
                            activeTab === index ? "text-neutral font-semibold border-b-accent border-b-4 border-solid" : ""
                        }`}
                        onClick={() => handleClick(index)}
                    >
                        {tab.label}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
