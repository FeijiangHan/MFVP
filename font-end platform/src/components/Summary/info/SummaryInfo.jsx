
import './index.less';

export default function SummaryInfo({sampleNum,familyNum,normalNum,outLiers}) {
  return (
    <div>
      
      <div className="summary-info">
        <div className="summary-info-part">
          <div className="info-item  info-sample">
            <span className="info-title">Samples: </span>
            <span className="info-content">{sampleNum}</span>
          </div>
          <div className="info-item">
            <span className="info-title">Groups: </span>
            <span className="info-content">{familyNum}</span>
          </div>
          <div className="info-item">
            <span className="info-title">Outliers: </span>
            <span className="info-content">{outLiers}</span>
          </div>
        </div>
        {/* <div className="summary-info-part">
          <div className="info-item">
            <span className="info-title">Normal Samples: </span>
            <span className="info-content">{normalNum}</span>
          </div>
          <div className="info-item">
            <span className="info-title">Outliers: </span>
            <span className="info-content">{outLiers}</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
