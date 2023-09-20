import {useEffect, useRef, useState} from "react";
import {BlockPicker} from "react-color"

export default function CustomColourPicker({id, value, label, sublabel, is_required, onColorChange, errorMessage}) {
    const [isDisplay, setIsDisplay] = useState(false);
    const [blockPickerColor, setBlockPickerColor] = useState(value);
    const firstUpdate = useRef(true);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        onColorChange(id, blockPickerColor);
    }, [blockPickerColor]);

    const handleColorPicker = (e) => {
        setIsDisplay(!isDisplay)
    };

    const suggestedColors = (usage) => {
        if (usage === "background_color") {
            return ['#FAFBFC', '#F1F8E9', '#F1FAFE', '#FFF5F5', '#FFF3EB', '#FBFBFB', '#ECF0F7', '#F5F8E1', '#E8F0F6'];
        } else if (usage === "font_color") {
            return ['#24292E', '#1B5E20', '#0D47A1', '#B71C1C', '#E65100', '#424242', '#1565C0', '#827717', '#0D47A1'];
        } else {
            return ['#3E4E3D', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8'];
        }
    }


    return <div className="form-control w-full">
        <label className="label h-8">
            <span className="label-text">
                {label}
                {is_required ? "*" : ""}
                {sublabel && <span className="text-neutral-500"> - {sublabel}</span>}
            </span>
        </label>
        <div
            className={"w-full flex flex-row items-center justify-between p-2 h-12 border border-gray-300 mt-1 rounded-lg cursor-pointer select-none bg-base-100"}
            onClick={(e) => {
                handleColorPicker(e)
            }}>

            < div
                className={"max-w-1/3 w-20 h-full"}>
                < div
                    className={`w-full h-full rounded-lg border border-gray-300`
                    }
                    style={{
                        backgroundColor: `${blockPickerColor}`
                    }}
                />
                {isDisplay && <div className={"mt-3"}><BlockPicker color={blockPickerColor} colors={suggestedColors(id)}
                                                                   onChange={(color) => {
                                                                       setBlockPickerColor(color.hex)
                                                                   }} onChangeComplete={(e) => {
                    handleColorPicker()
                }}/></div>}
            </div>
            <div className={"flex-grow ml-2 md:ml-6 text-sm md:text-base"}>
                <input
                    type="hidden"
                    id={id}
                    value={blockPickerColor}/>
                {blockPickerColor}
            </div>
        </div>
        <span className="text-error text-sm h-8 block">{errorMessage}</span>
    </div>
}
