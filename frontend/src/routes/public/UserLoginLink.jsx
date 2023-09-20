import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import Loading from "../../components/Loading.jsx";
import {login} from "../../store/slices/user.js";
import {api} from "../../axios/index.js";
import TitleWithDescription from "../../components/TitleWithDescription.jsx";
import MediumButton from "../../components/MediumButton.jsx";

export default function UserLoginLink() {
    useEffect(() => {
        document.title = `Log-in link - fairQ`;
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
                        navigate('/editor');

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

    else {
        return <div className="max-w-[1180px] w-full px-4 md:px-8 mb-20 h-full flex flex-col justify-center items-center justify-self-center self-center">
            <TitleWithDescription style={"mb-6 text-center"} text_style={"text-4xl"} description_style={"text-xl font-bold"}
                                  title={"We could not log you in"}
                                  description={"Unfortunately, this login link is not valid"}/>
            <p className="text-lg">Please request a new login link. If the problem persists, please get in touch with us.</p>
            <MediumButton label={"Contact support"} style={"mt-6"} onClick={(e)=>navigate("/support")}/>

        </div>;

    }
}