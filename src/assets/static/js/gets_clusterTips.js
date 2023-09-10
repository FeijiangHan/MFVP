
// 用于计算聚类图 tips部分
export function gets_cluster_tips(csvs) {
    let csvs_item = csvs;
    let re = {};
    let confidence_all = 0;
    let small_family = 0;
    let predict = [1, 1, 1];
    let predict_id = [1, 1, 1];
    let label_nums_sort = []; //用于记录某个类的总个数
    let abnormals = [];//记录异常点
    let abnormal_label = 0;//记录异常点类信息

    let cluster_sum = [0, 0, 0, 0, 0];//用于记录一个类的所有置信区间的数目

    // 统计每一类 置信区间 节点个数
    for (let i = 0; i < csvs_item.length; i++) {
        // console.log("label: ",csvs_item[i]['labels'])
        if (!label_nums_sort[csvs_item[i]['labels']]) {
            // 异常点
            if(csvs_item[i]['labels']===-1){
                abnormal_label += 1;//异常点类个数不断增加
            }
            else{
                // 非异常点
                label_nums_sort[csvs_item[i]['labels']] = [];
                label_nums_sort[csvs_item[i]['labels']].push(csvs_item[i]['labels']); //类
                label_nums_sort[csvs_item[i]['labels']].push(1); //类个数,初始值为1
            }
        }
        else{
            // 异常点
            if(csvs_item[i]['labels']===-1){
                abnormal_label += 1;//异常点类个数不断增加
            }
            else{
                // 非异常点
                label_nums_sort[csvs_item[i]['labels']][1] += 1; //类个数,累加
            }
        }
        let item = csvs_item[i]['labels'] + ""; //类名
        confidence_all += csvs_item[i]['confidence']; //置信度
        let confidence = parseFloat(csvs_item[i]['confidence']).toFixed(3);
        if (csvs_item[i]['num'] < 20) small_family += 1;
        if (re[item]) {
            if (confidence > 0.8 && confidence <=1) {
                re[item][0] = re[item][0] + 1;
                cluster_sum[0] += 1;
            } else if (confidence > 0.6 && confidence <=0.8) {
                re[item][1] = re[item][1] + 1;
                cluster_sum[1] += 1;
            } else if (confidence > 0.4 && confidence <=0.6) {
                re[item][2] = re[item][2] + 1;
                cluster_sum[2] += 1;
            } else if (confidence > 0.2 && confidence <=0.4) {
                re[item][3] = re[item][3] + 1;
                cluster_sum[3] += 1;
            } else {
                re[item][4] = re[item][4] + 1;
                cluster_sum[4] += 1;
            }
            for (let j = 0; j < 3; j++) {
                if (confidence < predict[j]) {
                    predict[j] = confidence;
                    predict_id[j] = csvs_item[i]['ids'];
                    break;
                }
            }
        } else {
            re[item] = [0, 0, 0, 0, 0]; //置信区间
            if (confidence > 0.8 && confidence < 1.0) {
                re[item][0] = re[item][0] + 1;
                cluster_sum[0] += 1;
            } else if (confidence > 0.6 && confidence < 0.8) {
                re[item][1] = re[item][1] + 1;
                cluster_sum[1] += 1;
            } else if (confidence > 0.4 && confidence < 0.6) {
                re[item][2] = re[item][2] + 1;
                cluster_sum[2] += 1;
            } else if (confidence > 0.2 && confidence < 0.4) {
                re[item][3] = re[item][3] + 1;
                cluster_sum[3] += 1;
            } else {
                if(item==='2'){
                    // console.log(confidence);
                }
                re[item][4] = re[item][4] + 1;
                cluster_sum[4] += 1;
            }
            for (let j = 0; j < 3; j++) {
                if (confidence < predict[j]) {
                    predict[j] = confidence;
                    predict_id[j] = csvs_item[i]['ids'];
                    break;
                }
            }
        }
    }



    let obj = [];
    // 考虑是否存在异常点 若是存在则加入
    if(abnormal_label !== ''){
        label_nums_sort.push(['abnormal',abnormal_label])
    }

    // 进行排序
    label_nums_sort.sort((a, b) => b[1] - a[1]);
    obj.push({
        names: 'C_ALL',
        dataset: cluster_sum,
    })
    
    // 统计类别最多的个数-不包括ALL
    let max_item = label_nums_sort[0];
    let max_num = max_item[1];


    // 对label_nums_sort中不存在的类别信息进行处理
    let label_null = 0;
    for (let j = 0; j < label_nums_sort.length; j++) {
        if (label_nums_sort[j]) {
                let k = label_nums_sort[j][0]+'';
                // // console.log(k);
                let item = {};
                item["names"] = "C" + k;
                if(k==='abnormal'){
                    item["dataset"] = re['-1'];
                }
                else{
                    item["dataset"] = re[k];
                }

                obj.push(item);
        }
        else {
            // 不存在的节点
            label_null++;
        }
    }

    // // console.log(obj);

    let data_rect = obj;

    let circle_nums = csvs_item.length;
    let label_nums = obj.length-1;//减去全局C_ALL的数目
    let confidence_global = ((confidence_all / csvs_item.length) * 100).toFixed(2);
    // // console.log(confidence_all / csvs_item.length);

    // 得到聚类信息
    let data_tips = {
        circle_nums: circle_nums,
        label_nums: label_nums,
        confidence_global: confidence_global,
        small_family:small_family,
        predict_id: predict_id,
    };

    return {
        data_rect: data_rect,
        data_tips: data_tips,
        label_nums: label_nums,
        max_num:max_num,
        // cluster_sum:cluster_sum
    }
}

export function gets_clusterManual_tips(csvs){

    // 统计类的个数
    // 节点个数
    // 小家族样本数
    // 排序后的矩形个数
    let csvs_item = csvs;
    let re = {};
    let small_family = 0;
    let label_nums_sort = []; //用于记录某个类的总个数
    let cluster_sum = [0, 0, 0, 0, 0];//用于记录一个类的所有置信区间的数目

    // 统计每一类个数情况
    for (let i = 0; i < csvs_item.length; i++) {
        if (!label_nums_sort[csvs_item[i]['labels']]) {
            // 非异常点
            label_nums_sort[csvs_item[i]['labels']] = [];
            label_nums_sort[csvs_item[i]['labels']].push(csvs_item[i]['labels']); //类
            label_nums_sort[csvs_item[i]['labels']].push(1); //类个数,初始值为1
        }
        else{
            // 非异常点
            label_nums_sort[csvs_item[i]['labels']][1] += 1; //类个数,累加
        }

        // 小家族样本数计算
        if (csvs_item[i]['num'] < 50) small_family += 1;
    }

    //生成置信区间情况
    for(let i=0;i<label_nums_sort.length;i++){
        if(label_nums_sort[i]){
            let confidence_item = label_nums_sort[i][1];//该类 置信度为1的个数
            re[label_nums_sort[i][0]] = [confidence_item,0,0,0,0];

        }
    }


    let obj = [];
    // 进行排序
    label_nums_sort.sort((a, b) => b[1] - a[1]);
    obj.push({
        names: 'C_ALL',
        dataset: [csvs_item.length,0,0,0,0],
    })
    
    let max_item = label_nums_sort[0]
    let max_num = max_item[1];

    // 对label_nums_sort中不存在的类别信息进行处理
    let label_null = 0;
    for (let j = 0; j < label_nums_sort.length; j++) {
        if (label_nums_sort[j]) {
                let k = label_nums_sort[j][0]+'';
                // // console.log(k);
                let item = {};
                item["names"] = "C" + k;
                if(k==='abnormal'){
                    item["dataset"] = re['-1'];
                }
                else{
                    item["dataset"] = re[k];
                }

                obj.push(item);
        }
        else {
            // 不存在的节点
            label_null++;
        }
    }

    let data_rect = obj;

    let circle_nums = csvs_item.length;
    let label_nums = obj.length-1;//减去全局C_ALL的数目
    let confidence_global = 100;

    // 得到聚类信息
    let data_tips = {
        circle_nums: circle_nums,
        label_nums: label_nums,
        confidence_global: confidence_global,
        small_family:small_family,
        predict_id: [],
    };

    return {
        data_rect: data_rect,
        data_tips: data_tips,
        label_nums: label_nums,
        max_num:max_num,
    }

}