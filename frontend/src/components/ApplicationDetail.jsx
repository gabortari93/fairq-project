import {AiOutlineClose} from 'react-icons/ai';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function ApplicationDetail({application, closeFunc}) {
    // Group fields by section and order them
    const sections = application.fields.reduce((acc, field) => {
        const section = field.waiting_list_field.section;
        if (!acc[section]) {
            acc[section] = [];
        }
        acc[section].push(field);
        acc[section].sort((a, b) => a.waiting_list_field.order - b.waiting_list_field.order);
        return acc;
    }, {});


    const formatField = (field) => {
        const {type, data} = field.waiting_list_field;
        const {value} = field

        if (type === "date") {
            return <span>{dayjs(value).format("DD.MM.YYYY")} ({dayjs().to(dayjs(value),true)})</span>
        } else if (type === "email") {
            return <a href={`mailto:${value}`}>{value}</a>
        } else if (type === "phone") {
            return <a href={`tel:${value}`}>{value}</a>
        } else if (type === "select") {
            return <span>{getDataValue(data, value)}</span>
        } else {
            return value
        }


    }

    function getDataValue(fieldData, value) {
        for (let i = 0; i < fieldData.length; i++) {
            if (fieldData[i][value]) {
                return fieldData[i][value];
            }
        }
        return value;
    }

    return (
        <div className="collapse flex flex-col justify-start items-start bg-base-100 rounded-none text-sm sm:text-base">
            <input
                type="radio"
                name={`accordion-${application.id}`}
                defaultChecked
                className="hidden"
            />
            <div className="flex justify-between items-center w-full cursor-pointer" onClick={() => closeFunc()}>
                <div className="flex justify-start items-center">
                    <span
                        className="collapse-title text-2xl ">{application.applicant.user.first_name + " " + application.applicant.user.last_name}</span>
                    <span className={`badge badge-lg ${application.status==="waiting" && "btn-primary"} ${application.status==="selected" && "btn-accent"} ${application.status==="removed" && "btn-secondary"} text-base-100`}>{application.status}</span>
                </div>
                <div onClick={() => closeFunc()} className="p-4 cursor-pointer">
                    <AiOutlineClose size={20}/>
                </div>
            </div>
            <div
                className="collapse-content w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start items-start px-4 py-6">
                <div className="w-full">
                    <div className="font-bold text-lg my-3">
                        General
                    </div>
                    <div className="w-full space-y-2">
                        <div className="flex flex-column items-start gap-1">
                            <span className="text-neutral-400">Registered</span>
                            <span
                                className="">{dayjs().to(dayjs(application.created_date))} ({dayjs(application.created_date).format('DD.MM.YYYY')})</span>
                        </div>
                        <div className="flex items-start gap-1">
                            <span className="text-neutral-400">Waiting since</span>
                            <span
                                className="">{dayjs().to(dayjs(application.waiting_since_date))} ({dayjs(application.waiting_since_date).format('DD.MM.YYYY')})</span>
                        </div>
                        {application.status == "selected" &&
                            <div className="flex items-start gap-1">
                                <span className="text-neutral-400">Selected</span>
                                <span
                                    className="">{dayjs().to(dayjs(application.selected_date))} ({dayjs(application.selected_date).format('DD.MM.YYYY')})</span>
                            </div>
                        }
                        {application.status == "waiting" &&
                            <>
                                <div className="flex items-start gap-1">
                                    <span className="text-neutral-400">Waiting position</span>
                                    <span className="">{application.position} out of 100</span>
                                </div>
                                <div className="flex items-start gap-1">
                                    <span className="text-neutral-400">Estimated remaining waiting time</span>
                                    <span
                                        className="">{dayjs().from(dayjs(application.estimated_selection_date), true)}</span>
                                </div>
                            </>
                        }
                    </div>

                </div>

                {Object.keys(sections).map((section, i) => (
                    <div key={i} className="w-full">
                        <div className="font-bold text-lg my-3 capitalize">
                            {section}
                        </div>
                        <div className="w-full space-y-2">
                            {section === "contact" &&
                                <div className="flex flex-column items-start gap-1">
                                    <span className="text-neutral-400">Email</span>
                                    <span
                                        className=""><a
                                        href={`mailto:${application.applicant.user.email}`}>{application.applicant.user.email}</a></span>
                                </div>
                            }
                            {sections[section].map(field => (
                                <div key={field.id} className="flex items-start gap-1">
                                    {field.waiting_list_field.type === "textarea" ? (
                                        <>
                                            {field.value}
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-neutral-400">{field.waiting_list_field.label}</span>
                                            <span className="">{formatField(field)}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
