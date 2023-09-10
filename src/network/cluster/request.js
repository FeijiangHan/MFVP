// 有关 cluster 的数据请求
import axios from 'axios'

/*
getClusteringResult(String datasetName, String clusterMethod, String DRMethod){}
Args:
    datasetName: String; // 待分析的数据集名称，可选："DS1"、"DS2"、"DS3"、"DS4"
    clusterMethod: String; // 使用的聚类方法，可选："kmeans"、"gmm"、"agg"
    DRMethod: String; // 使用的降维方法，可选："tsne"、"umap"

Return:
    res: Map<fileMD5: String, attr: Map<attrName: String, attrValue: Object>>;
    fileMD5: String; // 样本对应Webshell文件的fileMD5，用于唯一标识id
    attrName : attrValue
        label: int; // 当前样本所属家族的编码
        x: double; // 当前样本x坐标
        y: double; // 当前样本y坐标
        familySize: int; // 当前样本所属家族的样本数
        uncertainty: double; // 当前样本的不确定性 范围：[0, 1]
 */
function gets_cluster(fn, params) {
    let user = {
      datasetName: params.datasetName,
      clusterMethod: params.clusterMethod,
      DRMethod: params.DRMethod,
    }
    user = JSON.stringify(user);
    axios.post("http://114.132.228.197:8002/getClusteringResult/", user).then(
      function (res) {
        fn(res.data);
      },
      function (err) {
        console.log("gets_cluster "+err);
      }
    );
  }


  export {
    gets_cluster
  }