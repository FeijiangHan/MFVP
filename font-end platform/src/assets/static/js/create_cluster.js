
var _ = require('lodash/core');
export function create_cluster(d3v6, place, csvs, clusterClick, tag, filters_all, brushHandle, data_brush, find_node, word_cloud, data_rem) {
  // 
  // // console.log("cluster画图输出filter信息");
  // // console.log(csvs);

  // // console.log(place + '画图')
  document.querySelector(place).innerHTML = '';

  // // console.log("输出词云数据");
  // // console.log(word_cloud);
  var width = 600; //SVG绘制区域的宽度
  var height = 580; //SVG绘制区域的高度
  // if (document.querySelectorAll('.cluster-main').length < 2) {
  //   width = 800;
  // }

  let label_filter = (filters_all.class_filter == -2 ? -1 : filters_all.class_filter);
  let confidence_filter = filters_all.confidence_filter;
  let convex_hull = filters_all.convex_hull;
  let contour_flag = filters_all.Contour;//等高线
  let outlier_flag = filters_all.Outlier;//异常点
  let scatter_transparency = filters_all.scatter_transparency;
  let brush_data_filter = data_brush;

  let confidence_re = [1, 0.8, 0.6, 0.4, 0.2];

  let confidence_highest_num = 0;

// // console.log(confidence_filter);

  // 词云
  // // console.log(word_cloud);
  let datacloud_flag = word_cloud.flag;
  let datacloud = word_cloud.info;

  let center_arr;

  let class_num;
  // var class_op;
  let shownum;

  if (datacloud_flag) {
    // 用于绘制词云
    center_arr = {};
    // shownum = 1;
    class_num = Object.keys(datacloud.opcode_info).length;
    if(class_num >1){
      shownum = 1;
    }
    else{
      shownum = 5;
    }

    var shownum_z = d3v6.scaleLinear()
      .domain([1,10]).nice()
      .rangeRound([1,4])  //全局的地方加这个

    // class_op = datacloud.opcode_info[0];
  }

  // // console.log("输出画图页面接收到的词云数据");
  // // console.log(datacloud);

  var svg = d3v6
    .select(place) //选择<body>
    .append("svg") //在<body>中添加<svg>
    .attr("width", width) //设定<svg>的宽度属性
    .attr("height", height) //设定<svg>的高度属性


  // 没有节点处理
  if (csvs.length == 0) {
    svg.append('text')
      .attr("dx", 200)
      .attr("dy", 200)
      .style("text-anchor", "center")
      .text("this sample has no cluster infomation")
    // // console.log("no children")
    return 0;
  }


  svg.call(d3v6.zoom().scaleExtent([1, 8]).on('zoom', function (event) {
    // // console.log(event)
    var scale = event.transform.k,
      translate = [event.transform.x, event.transform.y]

    svg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
  }))
    .append('g')
    .attr('width', '100%')
    .attr('height', '100%')

  // 定义污点颜色
  var z = d3v6.scaleOrdinal()
        //.domain(data.columns.slice(1))
        .domain(["130","132","129","134","135","131","133","136","137"])
        .range(["#FFA500", "#4682B4", "#B22222", "#8B008B","#FF00FF","#FFFF00","#9966FF","#996600","#CCFFFF"])


  var margin = { top: 5, right: 5, bottom: 5, left: 5 };
  var color = d3v6.scaleOrdinal(d3v6.schemeCategory10);


  function category437() {
    return d3v6.scaleOrdinal(d3_category437);
  }

  var d3_category437 = [
    0xd3fe14,
    0xfec7f8,
    0x0b7b3e,
    0x0bf0e9,
    0xc203c8,
    0xfd9b39,
    0x888593,
    0xec9c88,
    0x98ba7f,
    0xfe6794,
    0x10b0ff,
    0xac7bff,
    0xfee7c0,
    0x964c63,
    0x1da49c,
    0x2f786e,
    0xbbd9fd,
    0xfe6cfe,
    0x297192,
    0xd1a09c,
    0x78579e,
    0x81ffad,
    0x739400,
    0xca6949,
    0xd9bf01,
    0x646a58,
    0xd5097e,
    0xbb73a9,
    0xccf6e9,
    0x9cb4b6,
    0xb6a7d4,
    0x9e8c62,
    0x6e83c8,
    0x01af64,
    0xa71afd,
    0xcfe589,
    0xd4ccd1,
    0xfd4109,
    0xbf8f0e,
    0x0ad811,
    0x4ed1a5,
    0xd8bb7d,
    0xa54509,
    0x6a9276,
    0xa4777a,
    0xfc12c9,
    0x606f15,
    0x3cc4d9,
    0xf31c4e,
    0x73616f,
    0xf097c6,
    0xfc8772,
    0x92a6fe,
    0x875b44,
    0x699ab3,
    0x94bc19,
    0x7d5bf0,
    0xd24dfe,
    0xc85b74,
    0x68ff57,
    0xb62347,
    0x994b91,
    0x646b8c,
    0x977ab4,
    0xd694fd,
    0xc4d5b5,
    0xfdc4bd,
    0x1cae05,
    0x7bd972,
    0xe9700a,
    0xd08f5d,
    0x8bb9e1,
    0xfde945,
    0xa29d98,
    0x1682fb,
    0x9ad9e0,
    0xd6cafe,
    0x8d8328,
    0xb091a7,
    0x647579,
    0x1f8d11,
    0xe7eafd,
    0xb9660b,
    0xa4a644,
    0xfec24c,
    0xb1168c,
    0x188cc1,
    0x7ab297,
    0x4468ae,
    0xc949a6,
    0xd48295,
    0xeb6dc2,
    0xd5b0cb,
    0xff9ffb,
    0xfdb082,
    0xaf4d44,
    0xa759c4,
    0xa9e03a,
    0x0d906b,
    0x9ee3bd,
    0x5b8846,
    0x0d8995,
    0xf25c58,
    0x70ae4f,
    0x847f74,
    0x9094bb,
    0xffe2f1,
    0xa67149,
    0x936c8e,
    0xd04907,
    0xc3b8a6,
    0xcef8c4,
    0x7a9293,
    0xfda2ab,
    0x2ef6c5,
    0x807242,
    0xcb94cc,
    0xb6bdd0,
    0xb5c75d,
    0xfde189,
    0xb7ff80,
    0xfa2d8e,
    0x839a5f,
    0x28c2b5,
    0xe5e9e1,
    0xbc79d8,
    0x7ed8fe,
    0x9f20c3,
    0x4f7a5b,
    0xf511fd,
    0x09c959,
    0xbcd0ce,
    0x8685fd,
    0x98fcff,
    0xafbff9,
    0x6d69b4,
    0x5f99fd,
    0xaaa87e,
    0xb59dfb,
    0x5d809d,
    0xd9a742,
    0xac5c86,
    0x9468d5,
    0xa4a2b2,
    0xb1376e,
    0xd43f3d,
    0x05a9d1,
    0xc38375,
    0x24b58e,
    0x6eabaf,
    0x66bf7f,
    0x92cbbb,
    0xddb1ee,
    0x1be895,
    0xc7ecf9,
    0xa6baa6,
    0x8045cd,
    0x5f70f1,
    0xa9d796,
    0xce62cb,
    0x0e954d,
    0xa97d2f,
    0xfcb8d3,
    0x9bfee3,
    0x4e8d84,
    0xfc6d3f,
    0x7b9fd4,
    0x8c6165,
    0x72805e,
    0xd53762,
    0xf00a1b,
    0xde5c97,
    0x8ea28b,
    0xfccd95,
    0xba9c57,
    0xb79a82,
    0x7c5a82,
    0x7d7ca4,
    0x958ad6,
    0xcd8126,
    0xbdb0b7,
    0x10e0f8,
    0xdccc69,
    0xd6de0f,
    0x616d3d,
    0x985a25,
    0x30c7fd,
    0x0aeb65,
    0xe3cdb4,
    0xbd1bee,
    0xad665d,
    0xd77070,
    0x8ea5b8,
    0x5b5ad0,
    0x76655e,
    0x598100,
    0x86757e,
    0x5ea068,
    0xa590b8,
    0xc1a707,
    0x85c0cd,
    0xe2cde9,
    0xdcd79c,
    0xd8a882,
    0xb256f9,
    0xb13323,
    0x519b3b,
    0xdd80de,
    0xf1884b,
    0x74b2fe,
    0xa0acd2,
    0xd199b0,
    0xf68392,
    0x8ccaa0,
    0x64d6cb,
    0xe0f86a,
    0x42707a,
    0x75671b,
    0x796e87,
    0x6d8075,
    0x9b8a8d,
    0xf04c71,
    0x61bd29,
    0xbcc18f,
    0xfecd0f,
    0x1e7ac9,
    0x927261,
    0xdc27cf,
    0x979605,
    0x906407,
    0x8c48a3,
    0x676769,
    0x546e64,
    0x8f63a2,
    0xb35b2d,
    0x7b8ca2,
    0xb87188,
    0x4a9bda,
    0xeb7dab,
    0xf6a602,
    0xcab3fe,
    0xddb8bb,
    0x107959,
    0x885973,
    0x5e858e,
    0xb15bad,
    0xe107a7,
    0x2f9dad,
    0x4b9e83,
    0xb992dc,
    0x6bb0cb,
    0xbdb363,
    0xccd6e4,
    0xa3ee94,
    0x9ef718,
    0xfbe1d9,
    0xa428a5,
    0x93514c,
    0x487434,
    0xe8f1b6,
    0xd00938,
    0xfb50e1,
    0xfa85e1,
    0x7cd40a,
    0xf1ade1,
    0xb1485d,
    0x7f76d6,
    0xd186b3,
    0x90c25e,
    0xb8c813,
    0xa8c9de,
    0x7d30fe,
    0x815f2d,
    0x737f3b,
    0xc84486,
    0x946cfe,
    0xe55432,
    0xa88674,
    0xc17a47,
    0xb98b91,
    0xfc4bb3,
    0xda7f5f,
    0xdf920b,
    0xb7bbba,
    0x99e6d9,
    0xa36170,
    0xc742d8,
    0x947f9d,
    0xa37d93,
    0x889072,
    0x9b924c,
    0x23b4bc,
    0xe6a25f,
    0x86df9c,
    0xa7da6c,
    0x3fee03,
    0xeec9d8,
    0xaafdcb,
    0x7b9139,
    0x92979c,
    0x72788a,
    0x994cff,
    0xc85956,
    0x7baa1a,
    0xde72fe,
    0xc7bad8,
    0x85ebfe,
    0x6e6089,
    0x9b4d31,
    0x297a1d,
    0x9052c0,
    0x5c75a5,
    0x698eba,
    0xd46222,
    0x6da095,
    0xb483bb,
    0x04d183,
    0x9bcdfe,
    0x2ffe8c,
    0x9d4279,
    0xc909aa,
    0x826cae,
    0x77787c,
    0xa96fb7,
    0x858f87,
    0xfd3b40,
    0x7fab7b,
    0x9e9edd,
    0xbba3be,
    0xf8b96c,
    0x7be553,
    0xc0e1ce,
    0x516e88,
    0xbe0e5f,
    0x757c09,
    0x4b8d5f,
    0x38b448,
    0xdf8780,
    0xebb3a0,
    0xced759,
    0xf0ed7c,
    0xe0eef1,
    0x0969d2,
    0x756446,
    0x488ea8,
    0x888450,
    0x61979c,
    0xa37ad6,
    0xb48a54,
    0x8193e5,
    0xdd6d89,
    0x8aa29d,
    0xc679fe,
    0xa4ac12,
    0x75bbb3,
    0x6ae2c1,
    0xc4fda7,
    0x606877,
    0xb2409d,
    0x5874c7,
    0xbf492c,
    0x4b88cd,
    0xe14ec0,
    0xb39da2,
    0xfb8300,
    0xd1b845,
    0xc2d083,
    0xc3caef,
    0x967500,
    0xc56399,
    0xed5a05,
    0xaadff6,
    0x6685f4,
    0x1da16f,
    0xf28bff,
    0xc9c9bf,
    0xc7e2a9,
    0x5bfce4,
    0xe0e0bf,
    0xe8e2e8,
    0xddf2d8,
    0x9108f8,
    0x932dd2,
    0xc03500,
    0xaa3fbc,
    0x547c79,
    0x9f6045,
    0x04897b,
    0x966f32,
    0xd83212,
    0x039f27,
    0xdf4280,
    0xef206e,
    0x0095f7,
    0xa5890d,
    0x9a8f7f,
    0xbc839e,
    0x88a23b,
    0xe55aed,
    0x51af9e,
    0x5eaf82,
    0x9e91fa,
    0xf76c79,
    0x99a869,
    0xd2957d,
    0xa2aca6,
    0xe3959e,
    0xadaefc,
    0x5bd14e,
    0xdf9ceb,
    0xfe8fb1,
    0x87ca80,
    0xfc986d,
    0x2ad3d9,
    0xe8a8bb,
    0xa7c79c,
    0xa5c7cc,
    0x7befb7,
    0xb7e2e0,
    0x85f57b,
    0xf5d95b,
    0xdbdbff,
    0xfddcff,
    0x6e56bb,
    0x226fa8,
    0x5b659c,
    0x58a10f,
    0xe46c52,
    0x62abe2,
    0xc4aa77,
    0xb60e74,
    0x087983,
    0xa95703,
    0x2a6efb,
    0x427d92,
  ].map(d3_rgbString);

  function d3_rgbString(value) {
    return d3v6.rgb(value >> 16, (value >> 8) & 0xff, value & 0xff);
  }

  var colour = category437();


  //定义渐变色
  var colors_gradient_contour;
  var colors_gradient_spot = ["#71AD48", "#95C475", "#AACCA9", "#A8BFE3", "#3484CC"]

  if (tag === 'left') {

    colors_gradient_contour = ["#FEF4F5", "#FBCCD1", "#F9C4CB", "#F5B9C1", "#F1A1AB"]
    // colors_gradient_contour = ["#FFFBEF", "#FFEEBD", "#FFECB1", "#FFE697", "#FFDA69"]//黄色

  }
  else {
    colors_gradient_contour = ["#FFFBEF", "#FFEEBD", "#FFECB1", "#FFE697", "#FFDA69"]//黄色
  }


  var linearColorScale = d3v6
    .scaleLinear()
    .domain(d3v6.range(0, 1, 1 / colors_gradient_contour.length))
    .range(colors_gradient_contour)
    .interpolate(d3v6.interpolateLab);

  var linearColorScale_spot = d3v6
    .scaleLinear()
    .domain(d3v6.range(0, 1, 1 / colors_gradient_spot.length))
    .range(colors_gradient_spot)
    .interpolate(d3v6.interpolateLab);


  // // console.log("输出类别信息");
  // // console.log(label_filter)
  // 刷选

  // // console.log( d3v6.brush());
  const brush = d3v6.brush()
    .filter((event) => { return event.ctrlKey && !event.button})
    .on("end", brushed);

  svg.call(brush);

  let data = [];
  csvs.forEach((item, index) => {
    // 统计置信度为1的节点个数 来判断是否为人工打标
    if (item[5] == 1.0) {
      confidence_highest_num += 1;
    }

    // 筛选类别
    if (label_filter !== '') {
      if (item[1] == label_filter) {
        // 筛选置信度
        if (confidence_filter != ''||confidence_filter===0) {
          let start = confidence_re[confidence_filter];
          let end = confidence_filter < 4 ? confidence_re[confidence_filter + 1] : 0;
          if (item[5] <= start && item[5] > end) {
            data.push({
              ids: item[0],
              x: item[2],
              y: item[3],
              labels: item[1],
              num: item[4],
              confidence: item[5]

            })
            // // console.log(item[5]);

          }
        }
        else {
          data.push({
            ids: item[0],
            x: item[2],
            y: item[3],
            labels: item[1],
            num: item[4],
            confidence: item[5]

          })
        }
      }
    }
    else {
      if (confidence_filter !== '') {
        let start = confidence_re[confidence_filter];
        let end = confidence_filter < 4 ? confidence_re[confidence_filter + 1] : 0;
        if (item[5] <= start && item[5] > end) {
          data.push({
            ids: item[0],
            x: item[2] + Math.random() * 2 -1,
            y: item[3] + Math.random() * 2 -1,
            labels: item[1],
            num: item[4],
            confidence: item[5]

          })

        }
      }
      else {
        data.push({
          ids: item[0],
          x: item[2] + Math.random() * 2 -1,
          y: item[3] + Math.random() * 2 -1,
          labels: item[1],
          num: item[4],
          confidence: item[5]

        })
      }
    }

  })

  const data1 = data;
  // // console.log('data');
  // // console.log(data1);

  var x = d3v6
    .scaleLinear()
    .domain(d3v6.extent(data1, (d) => d.x))
    .nice()
    .rangeRound([margin.left, width - margin.right]);
  var y = d3v6
    .scaleLinear()
    .domain(d3v6.extent(data1, (d) => d.y))
    .nice()
    .rangeRound([height - margin.bottom, margin.top]);

  var contours = d3v6
    .contourDensity()
    .x((d) => x(d.x))
    .y((d) => y(d.y))
    .size([width, height])
    .bandwidth(12)
    .thresholds(20)(data);
  var colorScale = d3v6
    .scaleOrdinal()
    .domain(contours.map((d) => d.value))
    .range(
      d3v6.quantize(linearColorScale, contours.map((d) => d.value).length)
    );

  // // console.log(contours);

  // 画等高线
  if (contour_flag) {
    svg
      .append("g")
      //.attr("fill", "none")
      .attr("stroke", "none")
      .attr("stroke-linejoin", "round")
      .selectAll("path")
      .data(contours)
      .join("path")
      .attr("stroke-width", 0.4)
      .attr("fill", (d) => colorScale(d.value))
      .style("fill-opacity", 0.8)
      .attr("d", d3v6.geoPath())
      .append("title")
      .text(function (d) {
        return "density value: " + d["value"];
      });

  }

  function unique(arr) {
    return Array.from(new Set(arr));
  }
  var groups = data.map((item) => item.labels);
  // // console.log(data);
  // // console.log(groups);
  var arr1 = unique(groups);
  // // console.log("arr1");
  // // console.log(arr1);

  var arr2 = new Array(44);
  for (var i = 0; i < arr2.length; i++) {
    arr2[i] = i;
  }
  //// console.log(arr2);

  _.each(data, (n, i) => {
    n.groupnum = data[i].labels;
  });
  // // console.log("each loading");
  // // console.log(data);

  function groupBy(array, f) {
    let group_set = {};
    array.forEach(function (o) {
      let group = JSON.stringify(f(o));
      group_set[group] = group_set[group] || [];
      group_set[group].push(o);
    });
    return Object.keys(group_set).map(function (group) {
      return group_set[group];
    });
  }
  let sorted = groupBy(data, function (item) {
    return [item.groupnum];
  });


  // 判断是否画凸包
  if (convex_hull) {
    const hulls = svg
      .append("g")
      .selectAll("path")
      .data(arr1)
      .enter()
      .append("path")
      .style("stroke", function (d, i) {
        //return "#808080";//"  #A9A9A9"
        return "#7E6CBE";
      })
      .style("fill", function (d, i) {
        return "transparent";
      })
      .style("stroke-width", 1)
      .style("stroke-opacity", 1)
      //.style('fill-opacity', 0.9)
      .attr("stroke-linejoin", "round");

    hulls.attr("d", (g, i) => {
      let hullPoints = sorted[i].map((n) => {
        return [x(n.x), y(n.y)];
      });

      const hullData = d3v6.polygonHull(hullPoints);

      if (hullData === null) {
        return;
      }

      hullData.push(hullData[0]);

      // 绘制词云
      if (datacloud_flag) {
        // 用于绘制词云
        var a = [0, 0];
        for (var l = 0; l < hullData.length; l++) {
          a[0] += hullData[l][0];
          a[1] += hullData[l][1];
        }
        a[0] /= hullData.length;
        a[1] /= hullData.length;
        // // console.log("输出出i");
        // // console.log(i);
        // // console.log(arr1[i]);
        var key = arr1[i]+'';
        // // console.log(center_arr);
        center_arr[key] = a;
      }




      return d3v6.line()(hullData);
    });

  }

var colorScale_spot = d3v6
    .scaleOrdinal()
    .domain([0, 1])
    .range(
      d3v6.quantize(
        linearColorScale_spot,
        data.map((d) => d.confidence).length
      )
    );
  var linear = d3v6.scaleLinear().domain([0, 1]).range([0, 1])

  //散点
  if(data_rem&&data_rem.length>0){
    // // console.log(data_rem)
    // 处理数据
    let data_rem_item = [];
    // // console.log(data);
    for(let i =0;i<data.length;i++){
      if(data_rem.indexOf(data[i].ids)!=-1){
        data_rem_item.push(data[i]);
      }
    }

    var circle1 = svg
    .append("g")
    .attr("stroke", "transparent")
    .selectAll("circle")
    .data(data_rem_item)
    .join("circle")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("fill", d => {
      if (tag === 'left') {
        if (brush_data_filter.indexOf(d.ids) !== -1 || find_node == d.ids) {
          return '#FCFC03';
        }
        else {
          if (d.num <= 20 && outlier_flag) {
            return "#C00000";
          } else {
            var co = d["confidence"];
            // // console.log(d);
            return linearColorScale_spot(linear(co));
          }
        }
      }
      else {
        // 刷选节点
        if (brush_data_filter.indexOf(d.ids) !== -1 || find_node == d.ids) {
          if(find_node == d.ids){
            // console.log("找到节点");
            // console.log(find_node)
          }
          return '#FF01BC';
        }
        else {
          // 人工打标节点
          if (confidence_highest_num == csvs.length) {
            return '#7E6CBE';
          }
          else {
            // 异常节点
            if (d.num <= 20 && outlier_flag) {
              return "#C00000";
            } else {
              var co = d["confidence"];
              // // console.log(d);
              return linearColorScale_spot(linear(co))
            }
          }
        }
      }

    })
    .attr('md5', (d) => d.ids)
    .on('click', (d) => { clusterClick(d.ids) })

    .attr("stroke", function (d) {
      if (d.num <= 20 && outlier_flag) {
        return "#C00000";
      } else {
        var co = d["confidence"];
        return linearColorScale_spot(linear(co))
      }
    })

    .style("stroke-width", 0.5)
    .style("fill-opacity", (d) => scatter_transparency)
    .style("stroke-opacity", 1)
    .attr("r", function (d) {
      if(label_filter!='' || label_filter == '0'){
        if(find_node == d.ids){
          return 7.5;
        }
        return 5;
      }
      if (d.num <= 20) {
        return 2.5;
      } else {
        return 2.5;
      }
    })
    .on("click", (d, item) => {   clusterClick(item.ids) })
    .append("title")
    .text(function (d) {
      return (
        "label: " + 'C' +
        d["labels"] +
        "\ncluster_num: " +
        d["num"] +
        '\nconfidence:' +
        d['confidence'].toFixed(2) + ' ' +
        "\nmd5:" +
        d["ids"]
      );
    })
  }
  else{
    // // console.log("data");
    // // console.log(data);
    var circle1 = svg
    .append("g")
    .attr("stroke", "transparent")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("fill", d => {
      if (tag === 'left') {
        if (brush_data_filter.indexOf(d.ids) !== -1 || find_node == d.ids) {
          return '#FCFC03';
        }
        else {
          if (d.num <= 20 && outlier_flag) {
            return "#C00000";
          } else {
            var co = d["confidence"];
            // // console.log(d);
            return linearColorScale_spot(linear(co));
          }
        }
      }
      else {
        // 刷选节点
        if (brush_data_filter.indexOf(d.ids) !== -1 || find_node == d.ids) {
          return '#FF01BC';
        }
        else {
          // 人工打标节点
          if (confidence_highest_num == csvs.length) {
            return '#7E6CBE';
          }
          else {
            // 异常节点
            if (d.num <= 20 && outlier_flag) {
              return "#C00000";
            } else {
              var co = d["confidence"];
              // // console.log(d);
              return linearColorScale_spot(linear(co))
            }
          }
        }
      }

    })
    .attr('md5', (d) => d.ids)
    .on('click', (d) => { clusterClick(d.ids) })

    .attr("stroke", function (d) {
      if (d.num <= 20 && outlier_flag) {
        return "#C00000";
      } else {
        var co = d["confidence"];
        return linearColorScale_spot(linear(co))
      }
      // if(d.ids == find_node){
      //   return "#C00000";
      // }
    })

    .style("stroke-width", 0.5)
    .style("fill-opacity", (d) => scatter_transparency)
    .style("stroke-opacity", 1)
    .attr("r", function (d) {
      if(label_filter!=''  || label_filter == '0'){
        if(find_node == d.ids){
          return 7.5;
        }
        return 5;
      }
      if (d.num <= 20) {
        return 2.5;
      } else {
        return 2.5;
      }
    })
    .on("click", (d, item) => {  clusterClick(item.ids) })
    .append("title")
    .text(function (d) {
      return (
        "label: " + 'C' +
        d["labels"] +
        "\ncluster_num: " +
        d["num"] +
        '\nconfidence:' +
        d['confidence'].toFixed(2) + ' ' +
        "\nmd5:" +
        d["ids"]
      );
    })
  }


  

  // 画词云
  var textsize = d3v6.scaleLinear()
    .domain([0, 1]).nice()
    .rangeRound([7, 10])
  
    // // console.log(center_arr);
    // // console.log(datacloud.opcode_info);
  if (datacloud_flag) {
    for (let a in datacloud.opcode_info) {
      // // console.log(a);
      var class_op = datacloud.opcode_info[a];
      var class_dy = datacloud.dy_info[a];
      var class_xy = center_arr[a];
      if(class_xy){
        for(var xi=0;xi<shownum;xi++){
          svg.append('text')
             .text(function(d){
              // // console.log("name"+nodes_info[nodes_info.length-1].name+","+starty)
               return class_op[xi][0];
             })
             .style('font-size',function(d){
               //// console.log("shownum_z(shownum): "+shownum_z(shownum))
               var tsize=textsize(class_op[xi][1])*shownum_z(shownum)
               return tsize+"px"
             })
             .style('font-weight',"bold")
             .attr('dx', class_xy[0]+xi*(Math.random()*120-60))
             .attr('dy', class_xy[1]+xi*(Math.random()*120-60))
             .style('fill', "#1C1C1C")
             .style("text-anchor", "middle");
           }
   
   
         if (datacloud.dy_info[a].length > 0) {
           var class_dy=datacloud.dy_info[a];
           svg.append('text')
             .text(function(d){
               return class_dy[0][0];
             })
             .style('font-size',function(d){
               var tsize=textsize(class_dy[0][1])*shownum_z(shownum)*0.7
               return tsize+"px"
             })
             .style('font-weight',"bold")
             .attr('dx', class_xy[0]+3+Math.random()*15*shownum)
             .attr('dy', class_xy[1]+3+Math.random()*15*shownum)
             //.style('fill', "#1C1C1C")
             .attr("fill",d => z(String(class_dy[0][0])))
             .style("text-anchor", "middle");
         }
      }
      // // console.log(a);
      // // console.log(class_xy);
      
    }

  }



  function brushed({ selection }) {
    let value = [];
    if (selection) {
      const [[x0, y0], [x1, y1]] = selection;
      value = circle1
        .filter(d => x0 <= x(d.x) && x(d.x) < x1 && y0 <= y(d.y) && y(d.y) < y1)
        .data();
    }
    svg.property("value", value).dispatch("input");
    let brush_ids = [];
    for (let i = 0; i < value.length; i++) {
      brush_ids.push(value[i].ids);
    }
    brushHandle(brush_ids);
  }
}
