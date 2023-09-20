import {useParams} from "react-router-dom";
import MediumButton from "../../components/MediumButton.jsx";
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import Loading from "../../components/Loading.jsx";
import {login} from "../../store/slices/user.js";
import {api} from "../../axios/index.js";

export default function ApplicantLoginLink() {
    const {listSlug} = useParams()
    useEffect(() => {
        document.title = `Waitinglist #${listSlug} Applicant Login - fairQ`;
    });

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null)

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');

        if (token) {
            api.get(`/auth/login/link/${token}/`)
                .then((response) => {

                    if (response.status === 200) {
                        // Store the token in local storage
                        localStorage.setItem('token', response.data.access);

                        // Store the token in redux
                        dispatch(login(response.data.access));

                        // Redirect to profile page
                        navigate(`/list/${listSlug}/dashboard`);

                    } else if(response.status === 400 && response.data.user) {
                        setUser(response.data.user)
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error)
                    setLoading(false);
                });
        }
    }, [location, history, dispatch]);

    if (loading) {
        return <Loading/>;
    }

    return (
        <div className="w-full h-full flex flex-row justify-center items-center justify-self-center self-center">
            <div className=" rounded flex flex-col justify-center items-center gap-4 sm:w-1/3 sm:h-[90%]">
                <span className="text-4xl font-semibold font-sans text-center sm:text-left 2xl:text-center">Error. Confirmation link not valid</span>
                <p className=" text-center sm:text-left 2xl:text-center">We could not successfully validate your confirmation link. If the problem persists, please get in
                    touch with us.</p>
                <div className="w-full flex justify-around gap-5 sm:justify-start 2xl:justify-center">
                    <MediumButton label={"Request new link"} onClick={(e)=>navigate(`/list/${listSlug}`)}/>
                    <MediumButton label={"Contact support"} onClick={(e)=>navigate("/support")}/>
                </div>
            </div>
        </div>
    );
}