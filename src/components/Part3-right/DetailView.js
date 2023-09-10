import FCTreePairVis from "./FCTreePairVis";
import FCTreePairControl from "./FCTreePairControl";
import './DetailView.css'

export default function DetailView(props) {
    return (
        <div className="column">
            <div className="summary-title">
                Detail View
            </div>
            {/* <ReloadOutlined onClick={()=>{PubSub.publish("reloadFCTreePairVis",true)}}/> */}
            <FCTreePairVis/>
            <FCTreePairControl/>
        </div>
    );
}