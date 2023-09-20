import {getNeedsWhiteTextColor, hexToRgb} from "../utils";
import {useSelector} from "react-redux";
import {useEffect} from "react";

export default function LargeButton({
                                        customBranding = false,
                                        label,
                                        type = "submit",
                                        errorMessage,
                                        onClick,
                                        variant = "normal"
                                    }) {
    //const customBranding = useSelector(state => state.applicant.customBranding)
    const customStyle = (customBranding, variant) => {
        if (customBranding) {
            if (variant === "secondary") {
                const rgb = hexToRgb(customBranding.accent_color)
                return ({backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},0.5)`})
            } else {
                return ({backgroundColor: customBranding.accent_color})
            }
        }
    }


    const buttonClass = (customBranding, variant) => {
        if (!customBranding) {
            return `btn-${variant} text-base-100`
        } else {
            if (getNeedsWhiteTextColor(customBranding.accent_color)) {
                return `text-white`
            }
        }
    }

    useEffect(() => {
    }, [customBranding])

    if (customBranding !== undefined) {
        return (
            <>
                <button
                    style={customStyle(customBranding, variant)}
                    className={`btn btn-lg w-full rounded-lg normal-case ${buttonClass(customBranding, variant)}`}
                    type={type}
                    onClick={onClick}>{label}</button>
                <span className="text-error text-sm mt-2">{errorMessage}</span>
            </>
        )
    }

}