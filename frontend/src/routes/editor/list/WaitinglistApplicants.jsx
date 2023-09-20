import {useEffect, useState, Fragment} from "react";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import TitleWithDescription from "../../../components/TitleWithDescription.jsx";
import {api} from "../../../axios/index.js";
import Loading from "../../../components/Loading.jsx";
import {useDispatch, useSelector} from "react-redux";
import {loadApplications} from "../../../store/slices/editor.js";
import dayjs from "dayjs";
import ApplicationDetail from "../../../components/ApplicationDetail.jsx";
import Toast from "../../../components/Toast.jsx";

export default function WaitinglistApplicants() {
    const token = useSelector((state) => state.user.accessToken)
    const {listId} = useParams();
    const [loading, setLoading] = useState(true);
    const [expandedItemId, setExpandedItemId] = useState(null);
    const memberships = useSelector(state => state.editor.memberships)
    const [role, setRole] = useState(0)
    const dispatch = useDispatch();
    const applications = useSelector((state) => state.editor.applications);
    const countApplications = useSelector(
        (state) => state.editor.applicationsCount
    );
    const [searchTerm, setSearchTerm] = useState("");
    const waitingList = useSelector(state => state.editor.configuration);
    const [filter, setFilter] = useState("statusWaiting")
    const [sorting, setSorting] = useState("positionAsc")
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const filterOptions = {
        statusWaiting: {
            label: "Waiting",
            query: "status=waiting"
        },
        statusSelected: {
            label: "Already selected",
            query: "status=selected"
        },
        statusRemoved: {
            label: "Withdrawn",
            query: "status=removed"
        },
    }

    const sortingOptions = {
        positionAsc: {
            label: "Position (ascending)",
            query: "ordering=position"
        },
        positionDesc: {
            label: "Position (descending)",
            query: "ordering=-position"
        },
        selectedDateAsc: {
            label: "Selected date (ascending)",
            query: "ordering=selected_date"
        },
        selectedDateDesc: {
            label: "Selected date (descending)",
            query: "ordering=-selected_date"
        },
        firstNameAsc: {
            label: "First name (A-Z)",
            query: "ordering=applicant__user__first_name"
        },
        firstNameDesc: {
            label: "First name (Z-A)",
            query: "ordering=-applicant__user__first_name"
        },
        lastNameAsc: {
            label: "Last name (A-Z)",
            query: "ordering=applicant__user__last_name"
        },
        lastNameDesc: {
            label: "Last name (Z-A)",
            query: "ordering=-applicant__user__last_name"
        },
    }

    useEffect(() => {
        document.title = `${waitingList.name} Applications - fairQ`;
    }, [waitingList]);

    useEffect(() => {
        fetchApplications();
    }, [listId, filter, sorting, searchTerm]);

    useEffect(() => {
        if (memberships) {
            const orgId = waitingList.organisation.id; // assuming waitingList is in scope

            for (let i = 0; i < memberships.length; i++) {
                let membership = memberships[i];

                if (membership.organisation.id === orgId && membership.status === 2) { // only joined
                    setRole(membership.role);
                    break;
                }
            }
        }

    }, [memberships, waitingList]);


    const fetchApplications = async () => {
        setLoading(true)
        try {
            const response = await api.get(
                `list/${listId}/applications/?${filterOptions[filter].query}&${sortingOptions[sorting].query}&search=${searchTerm}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            dispatch(loadApplications(response.data))
            setLoading(false);
        } catch (error) {
            console.error("Error fetching applicants:", error);
        }
    };

    const handleSelectAction = async (applicationId) => {
        setLoading(true)
        try {
            const response = await api.post(
                `list/${listId}/applications/${applicationId}/select/`,
                {},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            setTimeout(() => {
                setLoading(true);
                Promise.all([
                    fetchApplications(),
                    setToastMessage("Application selected!"),
                    setToastType("success"),
                    setToastVisible(true)
                ]).then(() => setLoading(false));
            }, 1500);

        } catch (error) {
            console.error("Error fetching applicants:", error);
            setToastMessage("Application could not be selected!");
            setToastType("error");
            setToastVisible(true);
            setLoading(false)
        }
    }

    // Toggle the accordion item
    const toggleAccordion = (itemId) => {
        if (expandedItemId === itemId) {
            setExpandedItemId(null);
        } else {
            setExpandedItemId(itemId);
        }
    };

    if (!waitingList || !role) {
        return <Loading/>
    } else {
        return (
            <div className="max-w-[1180px] w-full mb-20">
                <div className="container">
                    <TitleWithDescription
                        title={`${countApplications} application${countApplications != 1 ? "s" : ""}`}
                        description="Easily manage and organize your list of participants in one central location.
                    Access, update, and review participant information, and perform necessary actions to ensure an
                    efficient and well-maintained waiting list."
                    />
                </div>
                <div className="flex flex-wrap flex-col md:flex-row gap-2 my-6 md:justify-between">
                    <div className="flex max-w-full flex-col sm:flex-row gap-2 justify-start">
                        {Object.keys(filterOptions).map((key) => {
                            return (
                                <button
                                    key={key}
                                    className={`btn btn-sm sm:btn-md ${
                                        filter === key
                                            ? "text-base-100 hover:text-base-100"
                                            : "btn-outline"
                                    } 
                                    ${key === "statusWaiting" && "btn-primary"}
                                    ${key === "statusSelected" && "btn-accent"}
                                    ${key === "statusRemoved" && "btn-secondary text-base-100"}
                                     rounded-lg max-w-full w-full sm:w-fit px-2 sm:px-8 `}
                                    onClick={() => setFilter(key)}
                                >
                                    {filterOptions[key].label}
                                </button>
                            )
                        })}
                    </div>
                    <div className="flex max-w-full flex-col sm:flex-row gap-2 justify-start items-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-grow w-full md:w-fit input input-sm sm:input-md input-secondary border rounded-lg focus:outline-none focus:ring ring-gray-400 focus:border-black-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            value={sorting}
                            onChange={(e) => setSorting(e.target.value)}
                            className="sm:px-4 sm:py-2 w-full md:w-fit input input-sm sm:input-md input-secondary border rounded-lg focus:outline-none focus:ring ring-gray-400 focus:border-black-300"
                        >
                            {Object.keys(sortingOptions).map((key) => {
                                return <option key={key} value={key}>{sortingOptions[key].label}</option>
                            })
                            }
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto mb-20">
                    {loading ? (
                        <Loading/>
                    ) : (
                        (!applications || countApplications === 0) ? (
                            <p>No applications found</p>
                        ) : (
                            <table className="table table-zebra text-sm sm:text-base lg:text-lg">
                                <thead>
                                <tr>
                                    {filter === "statusWaiting" && <th className="font-normal text-sm sm:text-base lg:text-lg">Position</th>}
                                    <th className="font-normal text-sm sm:text-base lg:text-lg">Name</th>
                                    {filter === "statusSelected" ? <th className="font-normal text-sm sm:text-base lg:text-lg">Selected</th> : <th className="font-normal text-sm sm:text-base lg:text-lg">Joined list</th>}
                                    <th className="text-right pr-12 justify-end font-normal text-sm sm:text-base lg:text-lg">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {applications.map((application, index) => {
                                    const isExpanded = expandedItemId === application.id;

                                    return (
                                        <Fragment key={`row-${application.id}`}>
                                            {!isExpanded ? (
                                                <tr className="">
                                                    {filter === "statusWaiting" && <td className="cursor-pointer"
                                                                                       onClick={() => toggleAccordion(application.id)}>{application.position}</td>}
                                                    <td className="cursor-pointer py-0 md:py-6"
                                                        onClick={() => toggleAccordion(application.id)}>
                                                        {application.applicant.user.first_name}{" "}
                                                        {application.applicant.user.last_name}
                                                    </td>
                                                    <td className="cursor-pointer py-0 md:py-6"
                                                        onClick={() => toggleAccordion(application.id)}>{filter === "statusSelected" ? (
                                                        <div className="tooltip"
                                                             data-tip={dayjs(application.selected_date).format('DD. MMMM YYYY HH:mm [(UTC]Z[)]')}>
                                                            <span
                                                                className="cursor-help">{dayjs().to(dayjs(application.selected_date))}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="tooltip"
                                                             data-tip={dayjs(application.waiting_since_time).format('DD. MMMM YYYY HH:mm [(UTC]Z[)]')}>
                                                            <span
                                                                className="cursor-help">{dayjs().to(dayjs(application.waiting_since_date))}</span>
                                                        </div>
                                                    )}
                                                    </td>
                                                    <td className="flex flex-col md:flex-row gap-x-2 gap-y-1 items-center text-right justify-end py-2 md:py-6">
                                                        {application.status === "waiting" && ( // Conditionally show buttons only if status is "waiting"
                                                            <div className="h-full">
                                                                {application.position <= waitingList.num_selectable ? (
                                                                    <div className="tooltip tooltip-left"
                                                                         data-tip={`Clicking this button will select ${application.applicant.user.first_name} ${application.applicant.user.last_name} from the list.`}>
                                                                        <button
                                                                            disabled={role<2}
                                                                            className="btn btn-accent btn-xs mx-2"
                                                                            onClick={(e) => handleSelectAction(application.id)}>Select
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="tooltip tooltip-left"
                                                                         data-tip={`This waiting list is configured to only allow selecting from the top ${waitingList.num_selectable} applications.`}>
                                                                        <button disabled={true}
                                                                                className="btn btn-xs mx-2 cursor-help">Select
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="tooltip tooltip-left"
                                                             data-tip={`Display details for ${application.applicant.user.first_name} ${application.applicant.user.last_name}`}>
                                                            <button
                                                                className="btn btn-xs btn-primary btn-outline mx-2"
                                                                onClick={() => toggleAccordion(application.id)}
                                                            >
                                                                details
                                                            </button>
                                                        </div>


                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr key={`details-${application.id}`}>
                                                    <td colSpan="5" className="p-0">
                                                        <ApplicationDetail application={application}
                                                                           closeFunc={() => toggleAccordion(application.id)}/>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                                </tbody>
                            </table>
                        )
                    )}
                </div>
                {toastVisible && (
                    <Toast
                        type={toastType}
                        onClose={() => setToastVisible(false)}
                    >
                        {toastMessage}
                    </Toast>
                )}
            </div>
        );
    }
}
