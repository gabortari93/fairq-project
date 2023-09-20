import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import FormFieldGroup from "../../../components/FormFieldGroup.jsx";
import SelectionField from "../../../components/SelectionField.jsx";
import {api} from "../../../axios/index.js";
import {useSelector} from "react-redux";
import {saveAs} from 'file-saver';
import MediumButton from "../../../components/MediumButton.jsx";
import Loading from "../../../components/Loading.jsx";
import TitleWithDescription from "../../../components/TitleWithDescription.jsx";

export default function WaitinglistImportExport() {
    const {listId} = useParams()
    const token = useSelector((state) => state.user.accessToken);
    const [selected, setSelected] = useState("all");
    const [loading, setLoading] = useState(false)

    const options = [
        {key: 'all', value: 'All applications'},
        {key: 'waiting', value: 'Applications on the waiting list'},
        {key: 'select', value: 'Applications that were selected'},
    ];
    useEffect(() => {
        document.title = `Waitinglist #${listId} Import / Export - fairQ`;
    });


    const handleSelect = async (e) => {
        setSelected(e.target.value)
    };

    const handleDownload = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await api.get(`/list/${listId}/export/${selected}/`, {
                responseType: 'blob',
                headers: {Authorization: "Bearer " + token},
            });
            let filename = response.headers['content-disposition'].split('filename=')[1];
            filename = filename.replace(/"/g, '').trim();
            saveAs(new Blob([response.data]), filename);
            setLoading(false)
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="max-w-[1180px] mb-20 flex flex-col">
            <TitleWithDescription
                title={`Export your waiting list`}
                description="Download the data of waiting list, so that you can use it in your CRM or ERP."
            />
            <form className="w-full md:w-2/3 lg:w-1/2"
                  onSubmit={(e) => handleDownload(e)}>
                <div className="container mx-auto h-auto" id="export">
                    <div className={"w-full flex flex-col sm:flex-row justify-between items-center gap-x-5"}>
                        <SelectionField size={"md"} value={selected} options={options} onChange={(e) => {
                            handleSelect(e)
                        }}/>
                        <button type="submit"
                                disabled={loading}
                                className={`btn btn-primary w-full sm:w-fit md:w-fit md:px-8 rounded-lg normal-case my-2 md:my-8`}>
                            {loading ? 'Generating file...' : 'Download CSV'}
                        </button>
                    </div>
                </div>
            </form>
        </div>)

}