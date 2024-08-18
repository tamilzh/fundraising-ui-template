import "../assets/css/spinner.css"
const Spinner = ({spinner}) => { if(!spinner) return <></>; return  (<div className="loader"></div>); };

export default Spinner;