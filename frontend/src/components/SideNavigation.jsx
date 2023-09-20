import SelectionField from "./SelectionField.jsx";

export default function SideNavigation({menuItems, className, type = "list"}) {
    const handleMenuClick = (target) => {
        const targetElement = document.getElementById(target);
        if (targetElement) {
            targetElement.scrollIntoView({behavior: "smooth"});
        }
    };

    if (type === "list") {
        return (
            <div className="sticky top-12 pr-12">
                <ul className="menu menu-md w-full h-40 block p-0">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <a
                                onClick={(e) => handleMenuClick(item.target)}
                                className={item.className}
                            >
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    } else {
        return (
            <div className="sticky top-0 z-20">
                <select className="select select-bordered select-lg w-full rounded-lg font-normal z-20"
                        onChange={(e) => handleMenuClick(e.target.value)}>
                    <option value="" disabled className="font-normal">Select</option>
                    {menuItems ? (
                        menuItems.map((item, index) => {
                            return <option value={item.target} key={index}>Jump to: {item.name}</option>
                        })
                    ) : (<option>No options available</option>)
                    }
                </select>
            </div>
        )
    }


}
