
export function GridTreeNew(d3,item,json,place,fn,fn2,disabledInteraction=false){
    // const dispatch = useDispatch();
    //console.log(store.getState())
    document.querySelector(place).innerHTML = '';
    // console.log(document.querySelector(place));
    var widthd ='98%' ,//195-3200
        heightd = '98%';

    if(item){
        var label = d3.select(place).append("div")
        .classed("htree-family",true)
        .text(item)
    }

    const svg = d3.select(place).append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")  // 可自适应缩放
        .attr("width", widthd)
        .attr("height", heightd)
        .call(d3.behavior.zoom().scaleExtent([0.5, 8]).on('zoom', function (event) {
            let scale = d3.event.scale;
            let translate = d3.event.translate
        
            svg.attr('transform', 'translate(' + translate + ') scale(' + scale + ')');
            }))
            .append("g")
            .attr("transform", `translate(30,20)`)


            // 初始加入main节点
  let tree = [ [{
    allIndex:[],
    callCount:0,
    callee:"__main__",
    caller:"",
    children: json.children,
    isSensitive: false,
    id: 0,
    color:"#888888",
    eindex: 0,
    layer: 0,
    windex: 0,
    x: 0,
    y: 0,
  }] ];

  let l = 1; // 层级
  let links = []; // 父节点与第一个子节点之间的连线
  let max = 0; // 最大的index 
  let max_call_num = 0; 
  let tindex = 1;
  const width = 60, height = 60;

  let md5 = json._id;
 
  let new_links = [] // 存储选中路径连线的数组
  let select_path = [] // 记录选中的路径
  let layer_maxmin = []; // 层级的最大最小值
  let click_check = 0; // 是否选择路径

  let colorMap = [
      [['chmod', 'copy', 'fclose', 'file_exists', 'file_get_contents', 'file_put_contents', 'fopen', 'fputs', 'glob', 'opendir', 'pclose', 'popen', 'rename', 'rmdir', 'touch', 'unlink'] ,"#703DAD"],
      [['assert', 'eval', 'exec', 'execute', 'passthru', 'proc_close', 'proc_open', 'shell_exec', 'system'],"#FF83B1"],
      [[ 'hexdec', 'htmlspecialchars', 'strtr', 'substr'],"#00CDEC"],
      [[ '__construct', 'call_user_func', 'call_user_func_array', 'create_function'],"#8685EF"],
      [[ 'base64_decode', 'gzinflate', 'str_rot13'],"#00C896"],
      [[ 'preg_match'],"#96BA2E"],
      [[ 'define', 'ini_set', 'set_time_limit'],"#FFC715"]
  ]; // 染色的颜色


  const draw_paper = svg.append("g")

  // 颜色比例尺
const color = d3.scale.linear()
  .domain([1, max_call_num])
  .range(["rgb(245,245,245)","rgb(200,200,200)"]);

BFS(json);


// 层次遍历
function BFS(arr) {
    let next_visit = [];
    let counter = 0;

    // 初始json数据外层是{}，需要转换为[]包围的
    if (arr.caller === "__main__") {
        // console.log("arr: ",arr.caller);
        arr = [arr]
    }
    
    for (let i = 0; i < arr.length; i++) {

        let children = arr[i].children;
        // console.log("children: ",children)
        let p = i === 0 ? 1 : arr[i].eindex;

        // if (arr[i].caller === '__main__') return;
  
        if (children && children.length !== 0) {
            // 父节点与第一个子节点的连边
            links.push([[arr[i].x, arr[i].y], [counter * (width + 8), l * (height + 24)]]);

            // eslint-disable-next-line no-loop-func
            children.forEach(d => {
                max = Math.max(max, ...d.allIndex); // 平分区间画条带的时候用到
                max_call_num = Math.max(max_call_num, d.callCount); // 染色背景深度的
                d.x = counter * (width + 8); // 偏移一个方格大小+空白
                d.y = l * (height + 24);
                d.layer = l; // 层级
                counter += 1; // 同一层水平排布
                next_visit.push(d);
                // console.log("d: ",d)
                d.windex = p; // 父节点索引
                // 根据敏感度记录颜色
                let flag = 0;
                if(d.isSensitive) {
                    colorMap.forEach(i => {
                        i[0].forEach(j => {
                            if(j === d.callee) {
                                flag = 1;
                                d.color = i[1];
                            }
                        })
                    })// end of forEach
                } 
                if (!d.isSensitive || flag === 0) {
                    d.color = "#888888";
                }
  
                // 记录索引信息
                if(d.children && d.children.length !== 0) {
                    tindex += 1;
                    d.eindex = tindex; // 全局索引
                } else{
                    d.eindex = 0;
                }
            })
            counter += 1;  // 留空用
        }
    }
    if (next_visit.length === 0) {
        links[0][0] = [0,0];
        // console.log("tree: ",tree)
        // console.log("links: ",links)
        drawTree(tree);
        drawLinks(links);
        return;
    }
    tree.push(next_visit); // 某一层
    l += 1; // y反向只有遍历完一层后再增1
    BFS(next_visit);
}

  
// 层次遍历
function BFS2(arr) {
  let next_visit = [];
  let counter = 0;
  for (let i = 0; i < arr.length; i++) {
    
      let children = arr[i].children;
      let p = i === 0 ? 1 : arr[i].eindex;
      

      if (children && children.length !== 0) {
          
          // 父节点与第一个子节点的连边
          links.push([[arr[i].x, arr[i].y], [counter * (width + 8), l * (height + 24)]]);
          //// console.log("links:",links);
          // eslint-disable-next-line no-loop-func
          children.forEach(d => {
              d.allIndex = JSON.parse(d.allIndex);
              //// console.log("加工后：",d.allIndex)
              max = Math.max(max, ...d.allIndex); // 平分区间画条带的时候用到
              max_call_num = Math.max(max_call_num, d.callCount); // 染色背景深度的
              //// console.log(max_call_num)
              d.x = counter * (width + 8); // 偏移一个方格大小+空白
              d.y = l * (height + 24);
              d.layer = l; // 层级
              counter += 1; // 同一层水平排布
              next_visit.push(d);
              d.windex = p; // 父节点索引
              // 根据敏感度记录颜色
              //// console.log(d)
              let flag = 0;
              if(d.isSensitive) {
                  colorMap.forEach(i => {
                      i[0].forEach(j => {
                          if(j === d.callee) {
                              flag = 1;
                              d.color = i[1];
                          }
                      })
                  })// end of forEach
              } 
              if (!d.isSensitive || flag === 0) {
                  //// console.log(d.name+"不敏感，要染色#888888")
                  d.color = "#888888";
              }

              // 记录索引信息
              if(d.children &&d.children.length !== 0) {
                  tindex += 1;
                  d.eindex = tindex; // 全局索引
              } else{
                  d.eindex = 0;
              }
          })
          counter += 1;  // 留空用
      }
  }
  if (next_visit.length === 0) {
      // Draw_selection();
      drawTree(tree);
      drawLinks(links);
      return;
  }
  tree.push(next_visit);
  l += 1; // y反向只有遍历完一层后再增1
  BFS(next_visit);
}



function myScale(index, low, max)
{
  let my_inner_height = (height/(max-low+1));
  return my_inner_height * index;
}


let selected_nodes = [];
for (let i = 0; i < l; i++) {
    selected_nodes.push([]);
}

const initOutlines = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
let outline = initOutlines;

// 绘制树图
function drawTree(tree) {
//   // 比例尺
//   const scale = d3.scale.linear()
//   .domain([0, max+1]) // 保证最后一个index可以映射到底部
//   .range([0, height]);

  let inner_height = (height/(max+1)).toFixed(16); // 内层条带的高度

  draw_paper.selectAll("g")
  .data(tree) // 一个元素就是一层
  .enter()
  .append("g")
  .each(function(data,l) { // data 是一个list
      let indexs = [];
      //// console.log(data)
      const g = d3.select(this); // 一层的g
      //// console.log(data,l)
      g.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("id", d => `rect${place[10]}${d.id}`)
          .attr("x", (d, i) => d.x)
          .attr("y", (d, i) => d.y)
          .attr("width", width)
          .attr("height", height)
          .attr("fill", d => color(0.7))
          .attr("stroke", d => color(0.7))
          .attr("stroke-width", 0.2)
          .append("title")
          .text(d=>d.callee)
          .attr("id", function(d,i){ return "rect"+d.eindex; });

        //let outline = {};
        if (!disabledInteraction) {
            // console.log("exec");
            g.selectAll("rect")
            .on("mouseover",function(d,c){
                d3.select(`#rect${place[10]}${d.id}`)
                .attr('fill',color(0.5))
                // console.log("over-c,d: ",c,d)
            })
            .on("mouseout",function(d,c){
                d3.select(`#rect${place[10]}${d.id}`)
                .attr('fill',color(0.7))
                // console.log("out-c,d: ",c,d)
            })
            .on("click",function(c,d){ // 单次点击时：加方框
                const selected_msg = { // 选择的id信息
                    md5: md5, // 树的md5
                    id: c.id // 选中节点的id
                }
                if(outline[c.id]===0)
                {
                    outline[c.id]=1;
                    g.append("rect")
                    .attr("x",c.x)
                    .attr("y",c.y )
                    .attr("id",`outline${place[10]}${c.id}`)
                    .attr("class","outline")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1.2)
                    // dispatch(addNodes(selected_msg))
                    fn({type:'add',data: selected_msg});
                    selected_nodes[c.layer].push(c);
                } else if (outline[c.id]===1){
                    outline[c.id]=0;
                    d3.selectAll(`#outline${place[10]}${c.id}`).remove();
                    // dispatch(removeNodes(selected_msg))
                    fn({type:'remove',data: selected_msg});
                    selected_nodes[c.layer] = selected_nodes[c.layer].filter(item => item.id !== c.id)
                }
                fn2(md5,selected_nodes);
             })
        }

    
      //let error = 0;
      const g3 = svg.append("g")
        //   .attr("transform", "translate(150,50)")
          .attr("id","global_innerRect");
      data.forEach(d => { // d是list中的一个元素

          d.allIndex.forEach(c => { // 取出allIndex列表中的单个index
              const offset_Y = myScale(c,0,max); // 偏移量
              g3.append("rect")
              .attr("x", d.x)
              .attr("y", d.y + offset_Y + 0.25) // 偏移量，0.00001是为了避免重叠
              .attr("width", width)
              .attr("height", inner_height)
              .attr("fill",d.color)
              .attr("stroke", d.color)
              .attr("stroke-width", 0.5)
              .on("click",function(){ // 单次点击时：加方框
                if (disabledInteraction) return;
                const selected_msg = { // 选择的id信息
                    md5: md5,
                    id: d.id
                }
                if(outline[d.id]===0)
                {
                    outline[d.id]=1;
                    //son_trees.push(selected_msg)
                    // console.log(son_trees)
                    g.append("rect")
                    .attr("x",d.x)
                    .attr("y",d.y )
                    .attr("id",`outline${place[10]}${d.id}`)
                    .attr("class","outline")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1.2)
                    // dispatch(addNodes(selected_msg))
                    fn({type:'add',data: selected_msg});
                    selected_nodes[d.layer].push(d);
                } else if (outline[d.id]===1){
                    outline[d.id]=0;
                    d3.selectAll(`#outline${place[10]}${d.id}`).remove();
                    // dispatch(removeNodes(selected_msg))
                    fn({type:'remove',data: selected_msg});
                    selected_nodes[d.layer] = selected_nodes[d.layer].filter(item => item.id !== d.id)
                }
                fn2(md5,selected_nodes);
            })

          }) // end of forEach
      }) // end of forEach
      const gt = svg.append("g")
      .attr("id","global_text");

  gt.selectAll(".name")
      .data(data)
      .enter()
      .append("text")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("x", d => d.x + width / 2)
      .attr("y", d => d.y + height / 2 - 2)
      .text(d => d.callee.substring(0, 10))
      .style("text-width",2);

      gt.selectAll(".name")
      .data(data)
      .enter()
      .append("text")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("x", d => d.x + width / 2)
      .attr("y", d => d.y + height / 2 + 8)
      .text(d => d.callee.substring(11, 21))
      .style("text-width",2);


      gt.selectAll(".name")
      .data(data)
      .enter()
      .append("text")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("x", d => d.x + width / 2)
      .attr("y", d => d.y + height / 2 + 18)
      .text(d => d.callee.substring(22, 25))
      .style("text-width",2);


  // extent(indexs) 返回数组中最大值和最小值的数组
  data.forEach(d => {
      indexs = indexs.concat(d.allIndex); // concat是拼接数组
  });
  let [imax, imin] = d3.extent(indexs);
  layer_maxmin.push([imax,imin]); // 存储每一层最大值和最小值
  // 不是main节点：
  if (imin !== -1 && imin !== -1) {
    gt.append("text")
    .attr("x",-2)
    .attr("y",data[0].y + 8)
    .attr("font-size", "10px")
    .attr("text-anchor", "end")
    .text(imax);
    gt.append("text")
        .attr("x",-2)
        .attr("y",data[0].y + height)
        .attr("font-size", "10px")
        .attr("text-anchor", "end")
        .text(imin);  
  }
            
  })
}


// 绘制连线
function drawLinks(links) {
  draw_paper
  .selectAll('path')
  .data(links)
  .enter()
  .append('path')
  .each(function(d,i) // 1.遍历每个元素
  {
    const path = d3.select(this); // 2.选中绑定的本元素
          let [[x1, y1], [x2, y2]] = [d[0],d[1]];
          path.attr("d", `M${x1 + width / 2},${y1 + height + 2} L${x1 + width / 2},${y1 + height + 12} L${x2 + width / 2},${y1 + height + 12} L${x2 + width / 2},${y2 - 2}`)
              .attr("stroke", color(0.5))
              .attr("stroke-width", 1.5)
              .attr("fill", "none"); // 3.添加属性
  }) // end of each
}



// 绘制连线2
function drawLinks2(links) {
  const g = svg
      .append("g")
    //   .attr("transform", "translate(150,50)");
  for (let i = 0; i < links.length; i++) {
      let [[x1, y1], [x2, y2]] = links[i];
      g.append("path")
          .attr("d", `M${x1 + width / 2},${y1 + height + 2} L${x1 + width / 2},${y1 + height + 15} L${x2 + width / 2},${y1 + height + 15} L${x2 + width / 2},${y2 - 2}`)
          .attr("stroke", color(0.5))
          .attr("stroke-width", 1.5)
          .attr("fill", "none");
  }
}

  }