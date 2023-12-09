export function create_grid_tree_new(d3,data,place,fn){
  
  document.querySelector(place).innerHTML="";
    var config = {
        margins: {top: 8, left: 20, bottom: 40, right: 40},
        textColor: '#303133',
        cellWidth: 30,
        cellHeight: 30,
        cellmaxLevel:5,
        cellmaxNum:11,
        cellPadding: 1,
        pointWidth:5,
        pointHeight:5,
        cellColor1: '#F9F9F9',
        cellColor2: '#F3F3F3',
        cellColor3: '#C5C5C5',
        cellColor4: '#9D9D9D',
        lineColor: 'white',
        lineColorSen:'#8685EF',
        lineWidth: 2,
        circleR:3,
        timelineWidth:1.5
    }
    var func_type=[
        {
          "name": "CALL",
          "func":['call_user_func_array', 'call_user_func', 'array_filter', 'array_walk', 'array_map',
                            'register_shutdown_function']
        },
        {
          "name": "SYS",
          "func":['create_function', 'eval', 'assert', 'exec', 'ob_start', 'preg_replace', 'system'
              , 'include', 'include_once', 'require', 'require_once', 'zend_compile_file', 'unserialize']
        },
        {
          "name": "ZEND",
          "func":['zend_fetch_r_cookie', 'zend_fetch_r_post', 'zend_fetch_r_session', 'zend_fetch_r_request'
              , 'zend_fetch_r_files', 'zend_fetch_func_arg_globals', 'zend_compile_string', 'zend_fetch_r_get'
              , 'zend_fetch_r_server', 'zend_fetch_func_arg_server', 'zend_fetch_r_globals','zend_fetch_r_env']
        },
        {
          "name": "STR",
          "func":['chop', 'chr', 'crypt', 'explode', 'hex2bin', 'htmlentities', 'htmlspecialchars', 'implode', 'join',
                          'rtrim', 'str_rot13', 'strrev', 'strtolower', 'strtoupper', 'strtr', 'substr', 'md5',
                          'number_format', 'ord', 'sprintf', 'str_ireplace', 'str_pad', 'str_repeat', 'str_replace',
                          'str_shuffle', 'str_split', 'stripos', 'stristr', 'strlen', 'strncmp', 'strpos',
                          'strrpos', 'substr_count', 'trim', 'ereg', 'ereg_replace', 'eregi', 'preg_match', 'preg_match_all']
      
        },
        {
          "name": "ARRAY",
          "func":['array_merge', 'array_pop', 'array_push', 'array_slice',
                        'count', 'end', 'eof', 'error_get_last', 'extract', 'is_array', 'range']
        },
        {
          "name": "CODE",
          "func":['base64_decode', 'base64_decode', 'iconv', 'json_decode', 'json_encode',
                            'parse_url', 'rawurldecode', 'urldecode', 'urlencode']
        },
        {
          "name": "COMP",
          "func":['gzinflate', 'gzuncompress', 'pack', 'sh_decrypt',
                              'sh_decrypt_phase', 'unpack']
        },
        {
          "name": "FILE",
          "func":['basename', 'chdir', 'chmod', 'clearstatcache', 'closedir', 'closelog', 'copy', 'dirname',
                       'fclose', 'file', 'file_exists', 'file_get_contents', 'file_put_contents', 'filectime',
                       'filemtime', 'fileperms', 'filesize', 'fopen', 'fperms', 'fputs', 'fread', 'getcwd',
                       'highlight_file', 'is_dir', 'is_file', 'is_link', 'is_readable', 'is_writable', 'is_writeable', '',
                       'link', 'lstat', 'opendir', 'pathinfo', 'readdir', 'realpath', 'scandir', 'unlink', ]
        },
        {
          "name": "NET",
          "func":['fsockopen', 'header', 'session_start', 'setcookie']
        },
        {
          "name": "USER",
          "func":['_5mn8', '_add', '_bootstrap_9aa9897eca661b71ff8b79d47475eb3d', '_dcpev3tlg1rytwzsere',
                       '_gqg92wu8jjomukx0uvgy', '_iy7p', '_ppft', '_qerd', '_rs1rllfrnrxrd7h', '_rshift', '_str2long',
                       '_tcblt7g6lhaqn', 'a2148', 'aedbn', 'af9a3', 'ap', 'b', 'bf46ac6b', 'block_decrypt', 'bqk', 'bzct',
                       'ch_color', 'clsi', 'd0bb7d8da', 'd7f1', 'dodcc', 'dxesp', 'e', 'e1fc41', 'e389c7',
                       'echoend', 'edv', 'encrypt', 'errorhandler', 'exect', 'fd58b', 'File_Str', 'findsysfolder',
                       'fkqzeq', 'fltdic', 'font', 'g79f13b1a', 'get_contents', 'getadress', 'getdircontents',
                       'getDirContents', 'getFileCont', 'getinfo', 'getip', 'getpageruntime', 'gfe6a149',
                       'good_link', 'gpskuv', 'h8d82', 'hate',
                       'hdefso', 'home', 'html_n', 'http_get',
                       'i', 'i3e655f', 'ImZtkmSvEGpMsqDKpCAXONttMUynVckEp', 'initiate',
                       'islogin', 'iuqb940', 'jsp', 'k176f',
                       'kb4d237', 'key_setup', 'l8394cc6', 'load',
                       'load_compatibility_classes', 'login', 'loginpage', 'lsjbzx',
                       'm', 'm5362e56', 'm97934', 'main',
                       'mainbottom', 'maintop', 'make_love', 'mc',
                       'n', 'o35c4', 'o71bbbefa', 'oo00oo',
                       'ouwnuz', 'pe_domain', 'perms', 'ppohsb',
                       'pre_term_name', 'q1a9', 'qpfq321', 'qzlqvh',
                       'r548cadf', 'rebirth', 'root_login', 'rupsvusiwzqmwazghqaq',
                       's', 'sadb44f', 'strdir', 'test_file',
                       'twlp466', 'u03ede18f', 'vConn', 'vkjpoh',
                       'vqfy539', 'w', 'w20db60d', 'whhcwf',
                       'WinMain', 'x199', 'xclean', 'xcleanpath',
                       'xdir', 'xeifdd', 'xfilelastmodified', 'xfileperms',
                       'xfilesize', 'xlou2', 'xparsefilesize', 'ylozdv',
                       'yprr503', 'z835']
        },
        {
          "name": "ENV",
          "func":['get_cfg_var', 'get_current_user', 'get_magic_quotes_gpc', 'getenv', 'gethostbyname',
                      'ignore_user_abort', 'info', 'ini_get', 'ini_restore', 'ini_set', 'php_uname', 'phpinfo',
                      'phpversion', 'posix_geteuid', 'posix_getgid', 'posix_getgrgid', 'posix_getpwuid', 'posix_getuid',
                      'posix_uname', 'set_magic_quotes_runtime']
        },
        {
          "name": "OTHER",
          "func":['__lambda_func', 'hexdec', '__construct', 'ceil', 'class_exists', 'class_uc_key', 'date'
              , 'date_default_timezone_set', 'debuginfo', 'define', 'defined', 'each', 'error_reporting', 'set_time_limit',
              'strftime', 'extension_loaded', 'flush', 'fmod', 'func_get_args', 'function_exists', 'getCode', 'sleep', 'sort'
              , 'getElementsByTagName', 'intval', 'mail', 'microtime', 'mt_rand', 'rand', 'strval'
              , 'natcasesort', 'ob_end_clean', 'ob_end_flush', 'ob_get_contents', 'round', 'set_error_handler', 'time']
        }
      ];

var width  = 1000;	//SVG绘制区域的宽度
var height = 300;	//SVG绘制区域的高度
	
const svg = d3.select(place)			//选择<body>
			.append("svg")			//在<body>中添加<svg>
			.attr("width", width)	//设定<svg>的宽度属性
			.attr("height", height);//设定<svg>的高度属性

			
// // console.log("loading dataset...");
var color = d3.scale.linear()
    .domain([0, 1, 5,15])
    .range([config.cellColor1, config.cellColor2, config.cellColor3,config.cellColor4]);
var cellH = d3.scale.linear()
    .domain([4.5, 7,15])
    .range([20,60,100]);

var z = d3.scale.ordinal()
    //.domain(data.columns.slice(1))
    .domain(["CALL","SYS","ZEND","STR","ARRAY","CODE","FILE","NET","ENV","COMP","OTHER","USER"])
    .range(["#FF0066", "#FF83B1", "#8685EF", "#00CDEC","#63A3A5","#00C896","#703DAD","#BF9484","#705F4F","#96BA2E","#FFC715","#F0D668"])
  var root = data;
  //var root = data
//   // console.log(data);
  root.call_num=1;
  root.is_sensitive=false
  root.all_index="[-1]"
  root.children[0].all_index="[0]"
  root.children[0].index=0
  //config.cellHeight=cellH(Math.log2(root.maxindex))

  var tree1 = d3.layout.tree()
      .size([width-100, height - 100])
      .separation(function (a, b) {
          return (a.parent == b.parent ? 1 : 2)/a.depth;
      });

  var nodes1 = tree1.nodes(root);
  var links1 = tree1.links(nodes1);
//   // console.log(nodes1)
//   // console.log(links1)
  //统计函数格式、敏感函数个数、记录每一层的index区间、全局最大的index
  var totalfunc_map = {};
  var sensifunc_map = {};
  var levelrange_map={};
  var global_maxindex=0;
  
  function funcName(fname,fnamelen){

  var funcname = fname.split( '_' );
        if(fname=="__main__"){
            return "main"
        }else if(fname.length<=7){
            return fname;
        }else if(funcname.length==1){
           return fname.substr(0,7)

        }else{
            return fname.substr(0,3)+"_"+funcname[funcname.length-1].substr(0,3)
        }
}

  //https://wintc.top/article/20  树结构的广度遍历
  function treeForeach (tree,id=0,arr=[]) {
    let node, list = [...tree]
    var nodeNum_map = {}; //创建一个字典保存每一层的节点数
    var parent_b=1;
    while (node = list.shift()) {
      
      //给每个函数节点定位
      var typekey=node.depth;
      if(!nodeNum_map.hasOwnProperty(typekey)){
          nodeNum_map[typekey] = 0; 
          levelrange_map[typekey] = []; 
      }
      // // console.log("json parse:",node.all_index);
      node.all_index=JSON.parse(node.all_index) //把字符串格式的数组转换成真正的数组
      node.id_inLevel=++nodeNum_map[typekey];
      levelrange_map[typekey].push.apply(levelrange_map[typekey],node.all_index)
      node.y=(node.depth-1)*config.cellHeight;
      node.x=node.id_inLevel*config.cellWidth;
      node.ib=0;
      node.ia=0;
      if(node.name!="__main__"){
        node.ia=node.parent.ib;
      }

      //统计函数格式、敏感函数个数
      if(!totalfunc_map.hasOwnProperty(node.name)){
        totalfunc_map[node.name]=0
      }
      totalfunc_map[node.name]++;

      if(node.is_sensitive==true){
          node.funcT=senFunType(node.name,func_type)
          if(!sensifunc_map.hasOwnProperty(node.name)){
            sensifunc_map[node.name]=0
          }
          sensifunc_map[node.name]++;
      }
      node.shortname=funcName(node.name)
      if(node.hasOwnProperty("isfirstC")){
        node.shortname="↑ "+node.shortname
      }
      
      //node.id=id++;
      arr.push(node)
      if(node.children){
        node.ib=parent_b++;
        var Parents_map = {}; //创建一个字典保存父节点有几个孩子
        if(!Parents_map.hasOwnProperty(typekey)){
          node.children[0].isfirstC= node
          node.shortname=node.shortname+" ↓"
          //node.children[0].shortname="↑"+node.children[0].shortname
          //// console.log(node.firstC) //打印每个父节点的第一个孩子节点
        }
        list.push(...node.children)
      }
    }
    // // console.log(nodeNum_map)

    Object.keys(levelrange_map).forEach( function(key) {
      var range=[]
      var maxi=Math.max.apply(null, levelrange_map[key])
      range.push(Math.min.apply(null, levelrange_map[key]))
      range.push(maxi)
      global_maxindex=global_maxindex<maxi?maxi:global_maxindex
      levelrange_map[key]=range
    });
    // // console.log(levelrange_map)//每一层的index区间
    //// console.log(Object.keys(totalfunc_map).length)
    //// console.log(sensifunc_map)
    return arr
  }
  var arr1=treeForeach([data],0,[])
  arr1[0].x=arr1[1].x-config.cellWidth
  arr1[0].y=arr1[1].y
  arr1[0].totalfunc=Object.keys(totalfunc_map).length;
  arr1[0].sensifunc=Object.keys(sensifunc_map).length;
  arr1[0].indexran=levelrange_map;
  arr1[0].indexmax=global_maxindex
  const arr1_0=arr1[0]
  arr1.shift()
//   // console.log(arr1)
//   // console.log(arr1_0)
  
  var bottom = svg.append("g")
    .selectAll("g")
    .data(arr1)
    .enter().append("g")
    .attr("transform", function (d) {
        return "translate(" + config.margins.left + "," + config.margins.top + ")";
    })

  var rects = svg.append("g")
    .selectAll("g")
    .data(arr1)
    .enter().append("g")
    .attr("transform", function (d) {
        return "translate(" + config.margins.left + "," + config.margins.top + ")";
    })

  //绘制最底层的格子
  /*var startx=arr1[1].x;
  var starty=arr1[1].y;
  for(var x=0;x<config.cellmaxNum;x++){
    for(var y=0;y<config.cellmaxLevel;y++){
      bottom.append("rect")
        .attr("x", startx-config.lineWidth)
        .attr("y", starty-config.lineWidth)
        .attr("width", config.cellWidth)
        .attr("height", config.cellHeight)
        .style("fill", config.cellColor1)
        .attr("stroke", config.lineColor)
        .attr('stroke-width',config.lineWidth)
      starty+=config.cellHeight
    }
    starty=arr1[0].y;
    startx+=config.cellWidth
  }*/


  rects.append("rect")
      .attr("x", d => d.x-config.lineWidth)
      .attr("y", d => d.y-config.lineWidth)
      .attr("width", config.cellWidth)
      .attr("height", config.cellHeight)
      /*.style("fill", d => color(1+Math.log2(d.call_num)))*/
      .style("fill",function(d){
        return Math.log2(d.call_num)<0?color(0):color(1+Math.log2(d.call_num))
      })
      .attr("stroke", config.lineColor)
      .attr('stroke-width',config.lineWidth)
      .append("title")
      .text(d => d.name+"："+d.call_num+"："+d.all_index)


  function elbow(d) {
      let sourceX = d.source.x-config.lineWidth+config.cellWidth*0.5,
          sourceY = d.source.y+config.cellWidth*0.5,
          targetX = d.target.x-config.lineWidth+config.cellWidth*0.5,
          targetY = d.target.y+config.cellWidth*0.5;

      return "M" + sourceX + "," + sourceY +
          "V" + ((targetY - sourceY-2) / 2 + (sourceY)) +
          "H" + targetX +
          "V" + targetY;
  }
  

  //再添加一个g，把圆圈画在这上面，确保圆能遮挡住链接
  var rects1 = svg.append("g")
    .selectAll("g")
    .data(arr1)
    .enter().append("g")
    .attr("transform", function (d) {
        return "translate(" + config.margins.left + "," + config.margins.top + ")";
    })

  for(var t0=0;t0<arr1.length;t0++){   
    var temp_arr1_t0=arr1[t0]
    var temp_ir=arr1_0.indexran[temp_arr1_t0.depth]
    var t_height=(config.cellHeight-config.lineWidth)/(1+temp_ir[1]-temp_ir[0])

    for(var t1=0;t1<temp_arr1_t0.all_index.length;t1++){

      rects.append("rect")
        .attr("x", function(d){
          return temp_arr1_t0.x-config.lineWidth*0.44
        })
        .attr("y", function(d){
          return temp_arr1_t0.y+(temp_arr1_t0.all_index[t1]-temp_ir[0])*t_height-config.lineWidth*0.5
        })
        .attr("width", config.cellWidth-config.lineWidth*1.16)
        .attr("height", t_height)
        /*.attr("fill",function(d){
          return "black";
          //return Math.log2(temp_arr1_t0.call_num)<0?color(0):color(1+Math.log2(temp_arr1_t0.call_num))
        })*/
        .attr("fill",function(d){
          if(temp_arr1_t0.is_sensitive==false){
            return "#888888"
          }else{
            return z(temp_arr1_t0.funcT)
          }
        })
        //.style('fill-opacity', 0.1)

      
    }
  }
  /*rects.selectAll(".link")
      .data(links1)
      .enter()
      .append('path')
      .attr("class", "link")
      .attr("d", elbow)
      .attr("stroke",function(d){
        if(!d.target.hasOwnProperty("isfirstC")){
          return "transparent"
        }
        if(d.source.is_sensitive==false){
          return "#595959"
        }else{
          return z(d.source.funcT)
        }
      })
      .attr("stroke-width", function(d) { 
          return 0.4
      })
      .attr("fill","transparent")*/


//   rects.append("text")
//       .attr("dx", nodes1[1].x)
//       .attr("dy", -config.cellHeight*0.25)
//       .style("text-anchor", "start")
//       .style("font-size","8px")
//       .text(function (d) {
//         return nodes1[1].file_md5
//       })
  rects1.append("text")
    .attr("dx", d => d.x+config.cellWidth*0.455)
    .attr("dy", d => d.y+config.cellHeight*0.4)//0.5
    .style("text-anchor", "middle")
    .style("font-size","6px")
    //.attr("dx", d => d.x+config.cellWidth*0.2)
    //.attr("dy", d => d.y+config.cellHeight*0.47)
    //.style('writing-mode','tb-rl')
    .text(function (d) {
        //return d.shortname;
        return funcName(d.name)
    })

    rects1.append("text")
      .attr("dx", d => d.x+config.cellWidth*0.455)
      .attr("dy", d => d.y+config.cellHeight*0.675)//0.5
      .style("text-anchor", "middle")
      .style("font-size","6px")
      .text(function (d) {
          return "↑"+d.ia+" - "+d.ib+"↓";
      })
    arr1_0.indexran['0'] = undefined
    delete arr1_0.indexran['0'] 
    Object.keys(arr1_0.indexran).forEach( function(key) {
      rects1.append("text")
      .attr("dx", nodes1[1].x-3.5)
      .attr("dy", function(d){
        return (key-1)*config.cellHeight+3.5;
      })//0.5
      .style("text-anchor", "end")
      .style("font-size","5px")
      .style("fill","#888888")
      .text(function (d) {
         var temp_indexran=arr1_0.indexran[key]
          return temp_indexran[0]
      })

      rects1.append("text")
      .attr("dx", nodes1[1].x-3.5)
      .attr("dy", function(d){
        return (key)*config.cellHeight-3.5;
      })//0.5
      .style("text-anchor", "end")
      .style("font-size","5px")
      .style("fill","#888888")
      .text(function (d) {
         var temp_indexran=arr1_0.indexran[key]
          return temp_indexran[1]
      })
    });



function senFunType(name,func_type){
  for(var j=0;j<func_type.length;j++){
    if(func_type[j].func.indexOf(name)!=-1){
      return func_type[j].name;
    }
  }
}
fn(arr1_0);
}