import {Outlet, useParams} from "react-router-dom";
import ApplicantFooter from "../../components/ApplicantFooter.jsx";
import ApplicantHeader from "../../components/ApplicantHeader.jsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {api} from "../../axios/index.js";
import Loading from "../../components/Loading.jsx";
import {loadWaitingList, setCustomBranding} from "../../store/slices/applicant.js";
import NotFound from "../public/NotFound.jsx";
import PublicFooter from "../../components/PublicFooter.jsx";
import PublicHeader from "../../components/PublicHeader.jsx";
import {hexToRgb} from "../../utils/index.js";

export default function ApplicantLayout() {
    const {listSlug} = useParams()
    const dispatch = useDispatch()
    const waitingList = useSelector(state => state.applicant.waitingList)
    const [notFound, setNotFound] = useState(false)
    const customBranding = useSelector(state => state.applicant.customBranding)

    const customColorsAndFontsBody = (customBranding) => {
        if (customBranding) {
            return ({
                backgroundColor: customBranding.background_color,
                fontFamily: customBranding.font,
                color: customBranding.font_color
            })
        }
    }

    const customColorsAndFontsFooter = (customBranding) => {
        if (customBranding) {
            const aRgb = hexToRgb(customBranding.accent_color)
            return ({
                backgroundColor: `rgba(${aRgb.r},${aRgb.g},${aRgb.b},0.1)`,
                fontFamily: customBranding.font,
                color: customBranding.font_color
            })
        }
    }

    const customColorsAndFontsHeader = (customBranding) => {
        if (customBranding) {
            const aRgb = hexToRgb(customBranding.accent_color)
            return ({
                backgroundColor: `rgba(${aRgb.r},${aRgb.g},${aRgb.b},0.1)`,
                fontFamily: customBranding.font,
                color: customBranding.font_color
            })
        }
    }

    useEffect(() => {
        const loadPublicWaitingList = async () => {
            try {
                const res = await api.get(`list/${listSlug}/public`)
                dispatch(loadWaitingList(res.data))

                const org = res.data.organisation
                if (org.custom_branding) {
                    dispatch(setCustomBranding({
                        font: org.font,
                        background_color: org.background_color,
                        font_color: org.font_color,
                        accent_color: org.accent_color,
                        logo: org.logo,
                        banner: org.banner,
                    }))
                } else {
                    dispatch(setCustomBranding(false))
                }

            } catch (e) {
                setNotFound(true)
            }
        }
        loadPublicWaitingList()
    }, [listSlug])


    if (notFound) {
        return (<div className="min-h-screen w-full flex flex-col items-center">
            <PublicHeader/>
            <div className="max-w-[1180px] w-full flex-grow overflow-auto flex flex-col items-center justify-center">
                <NotFound/>
            </div>
            <PublicFooter/>
        </div>)
    } else if (!waitingList || customBranding === undefined) {
        return <Loading/>
    } else {
        return (
            <div
                style={customColorsAndFontsBody(customBranding)}
                className="min-h-screen w-full flex flex-col items-center"
            >
                <div
                    style={customColorsAndFontsHeader(customBranding)}
                    className="w-full flex items-center justify-center"
                >
                    <ApplicantHeader/>
                </div>
                <div
                    style={customColorsAndFontsBody(customBranding)}
                    className={`max-w-[1180px] w-full flex-grow overflow-auto flex flex-col ${customBranding ? `font-font${customBranding.font}` : `font-sans`}`}
                >
                    <Outlet/>
                </div>
                <div
                    style={customColorsAndFontsFooter(customBranding)}
                    className={`w-full bg-opacity-40`}
                >
                    <ApplicantFooter customBranding={customBranding}/>
                </div>
            </div>);
    }
}

