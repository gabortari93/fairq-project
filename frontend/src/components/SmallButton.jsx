export default function SmallButton({label, style, onClick}) {
    return <button className={`btn w-2/6 rounded-lg normal-case ${style}`} onClick={onClick}>{label}</button>;
}