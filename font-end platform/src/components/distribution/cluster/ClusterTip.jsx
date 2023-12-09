export default function ClusterTip(props){
    const {data_tips,data_tips_index}=props;
    return(
        <div className="cluster-tip">
            <p className="cluster-tip-title">{data_tip_index.title}</p>
            <p>DRM:  <span>{data_tips_index.dimension_reduction}</span></p>
            <p>Confidence Index:  <span>{data_tips_index.confidence_type}</span></p>
            <p>Calinski-Harabaz(CH):  <span>{data_tips_index.CH}</span></p>
            <p>DBI:  <span>{data_tips_index.DBI}</span></p>
            <p>SI:  <span>{data_tips_index.SI}</span></p>
            <p>Total Number:  <span>{data_tips.circle_nums}</span></p>
            <p>Categories:  <span>{data_tips.label_nums}</span></p>
            <p>Small Family Famples:  <span>{data_tips.small_family}</span></p>
            <p>Global Confidence:  <span>{data_tips.confidence_global}</span></p>
            <p> Confidence:  <span>0-&gt;1</span></p>
        </div>
    )
}