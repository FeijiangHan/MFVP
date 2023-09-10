import axios from 'axios'
axios.defaults.timeout = 30 * 1000; // 30s




function get_test(uuid_md5='98c4a591bb02715d6497e0fa36247671|fb786e03822fb4aa0eab29a891260825'){
  let user={
    uuid_md5
  }
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getSampleTree/", user).then(
    function (res) {
      // // console.log("test!",res.data)
      // fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}


function getSampleTree(options,fn){
  let user={
    uuid_md5:options.uuid+'|'+options.md5
  }
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getSampleTree/", user).then(
    function (res) {
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}
// 根据md5获取uuid（快速）
function getsUuid(options,fn){
  let user = {
    md5:options.md5,
  };
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getMd52uuidByResultF/", user).then(
    function (res) {
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}
function getsOpcode(options,fn){
  let uuid_md5=options.uuid+'|'+options.md5
  let user = {
    uuid_md5
  };
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getsCompleteOpcodeByUuidMd5/", user).then(
    function (res) {
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}
// 根据uuid,md5画所有节点的opcode树
function gets_tree(options, fn) {
  let user = {
    uuid: options.choose_uuid,
    file_md5: options.choose_md5,
    tree_type: (options.tree_type == 'all' ? "all_point" : "stain"),
  };
  // // console.log("请求opcode数据 uuid");
  // // console.log(user);
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getOpcodeTreeMap", user).then(
    function (res) {
      // // console.log("tree",res.data)
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}

// 通过md5 得到其的opcode信息
function getsOpcodeBymd5(options, fn) {
  let user = {
    md5: options.md5,
    tree_type: (options.tree_type == 'all' ? "all_point" : "stain"),
  };
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getsOpcodeByMd5/", user).then(
    function (res) {
      // // console.log(res.data)
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}
function getsOpcodeBymd5New(options, fn) {
  let user = {
    md5: options.md5,
    tree_type: (options.tree_type == 'all' ? "all_point" : "stain"),
  };
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getsOpcodeByMd5New/", user).then(
    function (res) {
      // // console.log(res.data)
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}
function getsOpcodeBymd5_2(options, fn) {
  let user = {
    md5: options.md5,
    tree_type: (options.tree_type == 'all' ? "all_point" : "stain"),
  };
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/gets_opcodeBymd5_two/", user).then(
    function (res) {
      // // console.log(res.data)
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}
// 相似结构
function gets_same_part(options, fn) {
  let user = {
    uuid: options.uuids,
    file_md5: options.md5s,
    tree_type: (options.modes == 'all' ? "all_point" : "stain"),
  };
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getSimilarityOpcodeTreeMap/", user).then(
    function (res) {
      // console.log(res)
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}



// 获得时间信息
function getsTimeInfo(options, fn) {
  let user = {
    md5: options.md5s,
    uuid: options.uuids,
  };

  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getsTimeInfo/", user).then(
    function (res) {
      // // console.log(res)
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}

// 根据uuid，md5得到msv数据
function getsMsv(options, fn) {
  let user = {
    md5: options.md5s,
    uuid: options.uuids,
  };

  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getMsvInfo/", user).then(
    function (res) {
      // // console.log("msv",res);
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}



// 根据数据处理方法以及聚类方法 得到评价指标
function getsClusterIndex(options, fn) {
  let user = {
    handle: options.handle.toLowerCase(),
    cluster: options.cluster.toLowerCase()
  };
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getEvaluationIndex/", user).then(
    function (res) {
      // // console.log(res)
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}


// 污点过滤--增加降维信息
function polluted_filter(options, fn) {
  let user = {
    pollutedType: options.pollutedType,
    handle: options.handle,
    cluster: options.cluster,
    dimension_reduction:options.dimension_reduction,
    confidence_type: options.confidence_type!=''? options.confidence_type:'SVM',
  };
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getsPollutedFileMd5/", user).then(
    function (res) {
      // // console.log(res)
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}

// 根据md5，uuid，聚类信息，得到该节点的类别信息以及置信度  --增加降维信息
function getslabelsbymd5(options, fn) {
  let user = {
    md5: options.md5,
    uuid: options.uuid,
    handle: options.handle,
    cluster: options.cluster,
    dimension_reduction:options.dimension_reduction,
    confidence_type: options.confidence_type!=''? options.confidence_type:'SVM',
    is_get_truth : options.is_get_truth
  };
  // // console.log(user);
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getsClusterInfoBymd5s/", user).then(
    function (res) {
      // // console.log(res)
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );

}

// 根据md5得到uuid
function getsuuidBymd5(options, fn) {
  let user = {
    md5: options.md5,
  };
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getsInfoByMd5/", user).then(
    function (res) {
      // // console.log(res)
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}

// 根据聚类信息，类别信息得到词云信息--增加降维
function getswordcloud(options,fn){
    let user = {
      handle:options.handle,
      cluster:options.cluster,
      class:options.classinfo,
      dimension_reduction:options.dimension_reduction,
      confidence_type:options.confidence_type!=''? options.confidence_type:'SVM',
    };
    // // console.log(user);
  user = JSON.stringify(user);
  axios.post("http://127.0.0.1:8000/getsCloudInfo/", user).then(
    function (res) {
      // // console.log("请求request接收到词云信息");
      // // console.log(res)
      fn(res.data);
    },
    function (err) {
      // console.log(err);
    }
  );
}

// 弦图--增加降维
function getsChordalDiagramInfo(options,fn){
  let user = {
    handle:options.handle,
    cluster:options.cluster,
    class:parseInt(options.classinfo),
    dimension_reduction:options.dimension_reduction,
    confidence_type: options.confidence_type!=''? options.confidence_type:'SVM',
    is_get_truth:options.is_get_truth
  };
  // console.log(user);
user = JSON.stringify(user);
axios.post("http://127.0.0.1:8000/getsChordalDiagramInfo/", user).then(
  function (res) {
    // // console.log("请求request接收到弦图信息");
    // // console.log(res)
    fn(res.data);
  },
  function (err) {
    // console.log(err);
  }
);
}

// 推荐关键点
function get_important_point(options,fn){
  let user = {
    handle:options.handle,
    cluster:options.cluster,
    dimension_reduction:options.dimension_reduction,
    confidence_type: options.confidence_type!=''? options.confidence_type:'SVM',
  };
    // // console.log(user);
user = JSON.stringify(user);
axios.post("http://127.0.0.1:8000/getImportantPoint/", user).then(
  function (res) {
    // // console.log("请求request接收到弦图信息");
    // console.log(res)
    fn(res.data);
  },
  function (err) {
    // console.log(err);
  }
);
}



/*
Args:
    datasetName: String; // 待分析的数据集名称，可选："DS1"、"DS2"、"DS3"、"DS4"
Return:
    res: Map<attrName: String, attrValue: Object>
    result: True,
    message:   String
*/
function createModel(data,request_cluster_data,request_md5_data) {
  // 请求的参数
  let user={
    datasetName: data.datasetName,
    queryStrategy: data.queryStrategy,
    trainStrategy: data.trainStrategy,
    numOfIterations: data.numOfIterations,
    numOfSamplePairs: data.numOfSamplePairs,
  }
  user = JSON.stringify(user);
  // post请求
  axios.post("http://114.132.228.197:8002/createModel/", user).then(
    function (res) {
      request_cluster_data(data);
      request_md5_data(data);
      return res.data.result;
    },
    function (err) {
      console.log(err);
    }
  );
}




function gets_cluster(fn, params) {
  let user = {
    datasetName: params.datasetName,
    clusterMethod: params.clusterMethod,
    DRMethod: params.DRMethod,
  }
  user = JSON.stringify(user);
  axios.post("http://114.132.228.197:8002/getClusteringResult/", user).then(
    function (res) {
      // console.log('getCluster-success');
      fn(res.data);
    },
    function (err) {
      console.log("gets_cluster "+err);
    }
  );
}



// 得到FCTree绘图需要的json文件
function getFCtree(fn,name,md5) {
    let user = {
      datasetName: name,
      fileMD5: md5,
    };
    user = JSON.stringify(user);
    axios.post("http://114.132.228.197:8002/getFCtree/", user).then(
    function (res) {
        fn(res.data);
    },
    function (err) {
      console.log(err);
    }
  );
}

// 获取样本对
function getNextQuery(fn, data) {
  // query_num = params["queryNum"]   # 要返回的样本对数量
  // collection_name = params["datasetName"]
  let user = {
    queryNum: data.numOfSamplePairs,
    datasetName: data.datasetName,
    queryStrategy: data.queryStrategy,
  };
  user = JSON.stringify(user);
  axios.post("http://114.132.228.197:8002/getNextQuery/",user).then(
    function (res) {
      // console.log("getNextQuery: ",res.data)
      fn(res.data);
    },
    function (err) {
      console.log(err);
    }
  );
}


function upDataPairwiseConstraints(data,md5_data,request_cluster_data,request_md5_data,isEnd){
// Args:
//     file1MD5: String; // 样本1对应Webshell文件的fileMD5
//     file2MD5: String; // 样本2对应Webshell文件的fileMD5
//     isSame: boolean; // 样本1和样本2是否同属一个家族
//     similarSubgraph: Map<attrName: string, attrValue: Object>[]; // 样本1和样本2中含义相近的子图
//     attrName : attrValue
//         graph1Ids: int[];
//         graph2Ids: int[];
  const user = JSON.stringify(data);
  axios.post("http://114.132.228.197:8002/updataPairwiseConstraints/", user).then(
  function (res) {
    if (res.data.result) {
      if (!isEnd) {
        request_md5_data(md5_data);
      }
      request_cluster_data();
    }
  },
  function (err) {
    // console.log(err);
  }
);

}

export {
  createModel, // 根据数据集创建模型
  getFCtree, // md5->json
  getNextQuery, // 改变md5
  upDataPairwiseConstraints, // 传给后端结果
  gets_cluster, // 获取聚类结果
  getSampleTree,
  getsUuid,
  getsOpcode,
  getsOpcodeBymd5_2,
  get_test,
  gets_tree,
  
  getsOpcodeBymd5,
  getsOpcodeBymd5New,
  getsClusterIndex,
  gets_same_part,
  polluted_filter,
  getsTimeInfo,
  getsMsv,
  getslabelsbymd5,
  getsuuidBymd5,
  getswordcloud,
  getsChordalDiagramInfo,
  get_important_point,
}