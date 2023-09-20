import {getNeedsWhiteTextColor, hexToRgb} from "../utils/index.js";

export default function MediumButton({
                                         label,
                                         customBranding=false,
                                         onClick,
                                         type = "submit",
                                         disabled = false,
                                         variant = "primary"
                                     }) {

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
            return `btn-${variant}`
        } else {
            if (getNeedsWhiteTextColor(customBranding.accent_color)) {
                return `text-white`
            }
        }
    }


    return (
        <button
            style={customStyle(customBranding)}
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`btn w-full sm:w-fit md:w-fit md:px-8 rounded-lg normal-case my-2 md:my-8 ${buttonClass(customBranding,variant)}`}
        >
            {label}
        </button>);
}