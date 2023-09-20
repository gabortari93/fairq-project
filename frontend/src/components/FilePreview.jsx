import {AiOutlineDelete} from "react-icons/ai";

export default function FilePreview({
                                        id,
                                        label,
                                        sublabel,
                                        url,
                                        errorMessage,
                                        interactive = true,
                                        onFileChange = () => {},
                                        onDelete = () => {},
                                    }) {

    const handleFileChange = (e) => {
        if (onFileChange) {
            onFileChange(e.target.id, e.target.files[0]);
        }
    }

    return <div className="form-control w-full">
        <label className="label h-8">
            <span className="label-text">
                {label}
                {sublabel && <span className="text-neutral-500"> - {sublabel}</span>}
            </span>
        </label>
        <div className="w-full max-w-xl flex flex-col text-start gap-2">
            {url && <div className="w-full flex justify-between items-start">
                <img
                    className="w-full  p-6 border-base-300 border rounded-lg"
                    src={url}
                />
                {interactive &&
                    <button
                        onClick={() => onDelete(id)}
                        className="btn btn-sm btn-circle btn-primary btn-outline text-lg relative right-4 -top-4 bg-base-100"
                    >
                        <AiOutlineDelete/>
                    </button>
                }
            </div>}
            {interactive &&
                <input
                    id={id}
                    accept="image/png, image/jpeg, image/gif"
                    type="file"
                    onChange={(e) => handleFileChange(e)}
                    className="file-input file-input-bordered file-input-md file-input-primary w-full rounded-lg"/>
            }
        </div>
        <span className="text-error text-sm h-8 block">{errorMessage}</span>
    </div>;
}
