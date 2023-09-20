import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import TitleWithDescription from "../../../components/TitleWithDescription.jsx";
import LineChart from "../../../chartjs/components/LineChart";
import BarChart from "../../../chartjs/components/BarChart";
import AgeDistribution from "../../../chartjs/components/AgeDistribution.jsx";
import {api} from "../../../axios/index.js";
import dayjs from "dayjs";
import GenderChart from "../../../chartjs/components/GenderChart.jsx";

const WaitinglistAnalytics = () => {
    const {listId} = useParams();

    const [waitingListStats, setWaitingListStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = `Waitinglist #${listId} Analytics - fairQ`;
    }, [listId]);

    useEffect(() => {
        api.get(`stats/waitinglist_stats_data/${listId}/`)
            .then(response => {
                setWaitingListStats(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                setIsLoading(false);
            });
    }, [listId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (waitingListStats.length === 0) {
        return <div>No data available</div>;
    }

    let latestStats;
    if (waitingListStats && waitingListStats.length > 0) {
        latestStats = waitingListStats[waitingListStats.length - 1];
    }

    const barChartData = Array.isArray(waitingListStats) && waitingListStats.length > 0 ? {
        labels: waitingListStats.map((entry) => dayjs(entry.date).format('MMMM DD')),
        datasets: [
            {
                label: 'Joined the waiting list',
                data: waitingListStats.map((entry) => entry.new_applicants),
                backgroundColor: '#4b6bfb',
            },
            {
                label: 'Selected from the waiting list',
                data: waitingListStats.map((entry) => entry.new_selected * -1),
                backgroundColor: '#67cba0',
            },
        ],
    } : null;

    const lineChartData = Array.isArray(waitingListStats) && waitingListStats.length > 0 ? {
        labels: waitingListStats.map((entry) => dayjs(entry.date).format('MMMM DD')),
        datasets: [
            {
                label: '',
                data: waitingListStats.map((entry) => entry.total_waiting),
                fill: false,
                backgroundColor: '#4b6bfb',
                borderColor: '#4b6bfb',
            },
        ],
    } : null;

    const ageGroupData = [
        {label: "<18", value: latestStats.age_0_18},
        {label: "19-25", value: latestStats.age_19_25},
        {label: "26-35", value: latestStats.age_26_35},
        {label: "36-50", value: latestStats.age_36_50},
        {label: "51-65", value: latestStats.age_51_65},
        {label: "65+", value: latestStats.age_65_plus},
    ]

    const genderData = [
        {label: "female", value: latestStats.female_count || 38},
        {label: "male", value: latestStats.male_count || 23},
        {label: "other", value: latestStats.other_count || 2},

    ]

    const ageDistributionData = latestStats ? {
        labels: ageGroupData.map((entry) => entry.label),
        datasets: [
            {
                label: '',
                data: ageGroupData.map((entry) => entry.value),
                fill: false,
                backgroundColor: '#4b6bfb',
                borderColor: '#4b6bfb',
            },
        ],
    } : null;

    return (
        <div className="max-w-[1180px] w-full mb-20">
            <TitleWithDescription
                title="Analytics"
                description="Our analytics dashboard provides a comprehensive overview of your organization's waiting lists and applicant data. Track key metrics, monitor trends, and gain valuable insights to effectively manage and optimize your waitlist management process."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div
                    className="lg:col-span-2  p-3 w-full h-200 rounded-lg shadow-lg hover:shadow-xl bg-white flex flex-col justify-start items-center">
                    <div className="flex flex-row flex-wrap justify-center items-start bg-white">
                        <div className="stat place-items-center w-fit">
                            <div className="stat-title">People waiting</div>
                            <div className="stat-value text-primary">{latestStats.total_waiting}</div>
                            <div
                                className="stat-desc text-secondary">{latestStats.new_applicants > 0 ? `+${latestStats.new_applicants} since
                                yesterday` : "no change since yesterday"}
                            </div>
                        </div>
                        {latestStats.average_current_waiting_time &&
                            <div className="stat place-items-center w-fit">
                                <div className="stat-title">Waiting since</div>
                                <div
                                    className="stat-value text-primary">{latestStats.average_current_waiting_time || 8}</div>
                                <div
                                    className="stat-desc text-secondary">days on average
                                </div>
                            </div>
                        }
                        <div className="stat place-items-center w-fit">
                            <div className="stat-title">People selected</div>
                            <div className="stat-value text-accent">{latestStats.total_selected}</div>
                            <div
                                className="stat-desc">{latestStats.new_selected ? `+${latestStats.new_selected} since yesterday` : `no change since yesterday`}</div>
                        </div>

                        {latestStats.average_waiting_time_of_selected_applicants &&
                            <div className="stat place-items-center w-fit">
                                <div className="stat-title">Effective waiting time</div>
                                <div
                                    className="stat-value text-accent">{latestStats.average_waiting_time_of_selected_applicants}</div>
                                <div
                                    className="stat-desc text-secondary">days on average
                                </div>
                            </div>
                        }
                        <div className="stat place-items-center w-fit">
                            <div className="stat-title">Pending</div>
                            <div className="stat-value text-secondary">{latestStats.total_pending}</div>
                            <div
                                className="stat-desc text-secondary">not fully registered
                            </div>
                        </div>
                    </div>
                </div>


                <div
                    className="p-3 w-full h-300 rounded-lg shadow-lg hover:shadow-xl bg-white flex flex-col justify-start items-center">
                    <h2 className="mt-2 p-2 text-xl font-semibold text-center">Number of people waiting</h2>
                    <span
                        className="text-neutral-500 text-sm">How many people were on your waiting list over time</span>
                    <div className="p-3 w-full h-full flex justify-center items-center">
                        <LineChart data={lineChartData}/>
                    </div>
                </div>

                <div
                    className="p-3 w-full h-300 rounded-lg shadow-lg hover:shadow-xl bg-white flex flex-col justify-start items-center">
                    <h2 className="my-2 p-2 text-xl font-semibold text-center">New added / selected</h2>
                    <span className="text-neutral-500 text-sm">How many people signed up or were selected</span>
                    <div className="p-3 w-full h-full flex justify-center items-center">
                        <BarChart data={barChartData}/>
                    </div>
                </div>
                <div
                    className="p-3 w-full h-300 rounded-lg shadow-lg hover:shadow-xl bg-white flex flex-col justify-start items-center">
                    <h2 className="my-2 p-2 text-xl font-semibold text-center">Age</h2>
                    <span className="text-neutral-500 text-sm">What&apos;s the age of your applicants?</span>
                    <div className="p-3 w-full h-full flex justify-center items-center">
                        <AgeDistribution data={ageDistributionData}/>
                    </div>
                </div>
                <div
                    className="p-3 w-full h-300 rounded-lg shadow-lg hover:shadow-xl bg-white flex flex-col justify-start items-center">
                    <h2 className="my-2 p-2 text-xl font-semibold text-center">Gender</h2>
                    <span className="text-neutral-500 text-sm">What are the genders of your applicants?</span>
                    <div className="p-3 w-full px-32 py-1 flex justify-center items-center">
                        <GenderChart data={genderData}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitinglistAnalytics;