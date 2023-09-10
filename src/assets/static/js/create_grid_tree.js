export function create_grid_tree(d3,f_md5,data,place,fn){
    let md5s= f_md5;
    let uuids = data.unique_id;
    let funs_nums = 0;
    let op_pollu_fun_num =0;
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
        "func":['__lambda_func', '__construct', 'ceil', 'class_exists', 'class_uc_key', 'date'
            , 'date_default_timezone_set', 'debuginfo', 'define', 'defined', 'each', 'error_reporting', 'set_time_limit',
            'strftime', 'extension_loaded', 'flush', 'fmod', 'func_get_args', 'function_exists', 'getCode', 'sleep', 'sort'
            , 'getElementsByTagName', 'hexdec', 'intval', 'mail', 'microtime', 'mt_rand', 'rand', 'strval'
            , 'natcasesort', 'ob_end_clean', 'ob_end_flush', 'ob_get_contents', 'round', 'set_error_handler', 'time']
      }
    ];
    const config = {
        margins: {top: 0, left: 0, bottom: 40, right: 40},
        textColor: '#303133',
        title: 'family abs',
        hoverColor: 'red',
        //startTime: '2018-01-01',
        //endTime: '2018-05-31',
        cellWidth: 20,
        cellHeight: 20,
        cellmaxLevel:4,
        cellmaxNum:18,
        cellPadding: 1,
        cellColor1: '#F9F9F9',
        cellColor2: '#F3F3F3',
        cellColor3: '#C5C5C5',
        cellColor4: '#9D9D9D',
        lineColor: 'white',
        lineColorSen:'#8685EF',
        lineWidth: 1,
        circleR:3
    }
    // // console.log(document.querySelector(place))
    document.querySelector(place).innerHTML="";
    var width  = 300;	//SVG绘制区域的宽度
    var height = 160;	//SVG绘制区域的高度
        
    const svg = d3.select(place)			//选择<body>
                .append("svg")			//在<body>中添加<svg>
                .attr("width", width)	//设定<svg>的宽度属性
                .attr("height", height)//设定<svg>的高度属性
                .attr("transform","translate(-20,0)")

                
    var color = d3.scale.linear()
        .domain([0, 1, 5,15])
        .range([config.cellColor1, config.cellColor2, config.cellColor3,config.cellColor4]);
    var z = d3.scale.ordinal()
        //.domain(data.columns.slice(1))
        .domain(["CALL","SYS","ZEND","STR","ARRAY","CODE","FILE","NET","ENV","COMP","OTHER","USER"])
        .range(["#F1A069", "#FF83B1", "#8685EF", "#00CDEC","#63A3A5","#00C896","#703DAD","#BF9484","#705F4F","#96BA2E","#FFC000","#F0D668"])
        //#D0E9CC 莫兰迪绿

//../opcode/20220308-casestudy/c7-7d52a26b3b6fe30d4602029030f8aa66_4c2c955cccdc0d8521de8666c2b291b4.json
//  ../opcode/tree-20211115/byorder_87866b12be9ab5fa27023483210a822_c94f98a24abe0c72e9df4b358bf2caa2.json
//  ../opcode/tree-20211115/byorder_275dd599576872fecd2556ebbd8eac47_5b4852f55ca44af32fc909a67d0cbfdf.json
//  ../opcode/tree-20211115/byorder_6292036085811560dc0e10d7b23122f3_c3f97518ace39a0fe5bfed20947763e7.json
//  "../opcode/tree-20211115/byorder_8b073d9d0da207251453889115dc9f2f_5c17496e6d07513547c77dc435254126.json"
//  "../opcode/tree-20211115/byorder_6523ed998ffd028b6a30b335e3afff29_83903657c2c2827946a007dd3d45eefa.json"
  var root = data
  //var root = data
  // // console.log(data);
  root.call_num=1;
  root.is_sensitive=false

  var tree1 = d3.layout.tree()
      .size([width-100, height - 100])
      .separation(function (a, b) {
          return (a.parent == b.parent ? 1 : 2)/a.depth;
      });

  var nodes1 = tree1.nodes(root);
  var links1 = tree1.links(nodes1);
  // // console.log(nodes1)
  // // console.log(links1)


  //https://wintc.top/article/20  树结构的广度遍历
  function treeForeach (tree,id=0,arr=[]) {
    let node, list = [...tree]
    var nodeNum_map = {}; //创建一个字典保存每一层的节点数
    while (node = list.shift()) {
      //func(node)
      //node.firstC={};
      var typekey=node.depth;
      if(!nodeNum_map.hasOwnProperty(typekey)){
          nodeNum_map[typekey] = 0; 
      }
      node.id_inLevel=++nodeNum_map[typekey];
      node.y=node.depth*config.cellHeight;
      node.x=node.id_inLevel*config.cellWidth;
      if(node.is_sensitive==true){
          node.funcT=senFunType(node.name,func_type)
        }
      //node.id=id++;
      arr.push(node)
      // // console.log(node.name + " : " +node.depth + " : " +node.id_inLevel)
      //node.children && list.push(...node.children)
      if(node.children){
        var Parents_map = {}; //创建一个字典保存父节点有几个孩子
        if(!Parents_map.hasOwnProperty(typekey)){
          node.children[0].isfirstC= node
          // // console.log(node.firstC) //打印每个父节点的第一个孩子节点
        }
        list.push(...node.children)
      }
    }
    // // console.log(nodeNum_map)
    return arr
  }
  var arr1=treeForeach([data],0,[])
  // // console.log(arr1)
  //arr1.shift()
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
  // var startx=arr1[0].x;
  // var starty=arr1[0].y;
  // for(var x=0;x<config.cellmaxNum;x++){
  //   for(var y=0;y<config.cellmaxLevel;y++){
  //     bottom.append("rect")
  //       .attr("x", startx-config.lineWidth)
  //       .attr("y", starty-config.lineWidth)
  //       .attr("width", config.cellWidth)
  //       .attr("height", config.cellHeight)
  //       .style("fill", config.cellColor1)
  //       .attr("stroke", config.lineColor)
  //       .attr('stroke-width',config.lineWidth)
  //     starty+=config.cellHeight
  //   }
  //   starty=arr1[0].y;
  //   startx+=config.cellWidth
  // }


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
      .text(d => d.name+"："+d.call_num)

  //直线画法
  /*rects.selectAll(".link")
      .data(links1)
      .enter()
      .append('line')
      .attr("class", "link")
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr("stroke",function(d){
        if(!d.target.hasOwnProperty("isfirstC")){
          return "transparent"
        }
        if(d.source.is_sensitive==false){
          return "#00C896"
        }else{
          return config.lineColorSen
        }
      })
      .attr("stroke-width", function(d) { 
          return 0.6
      })*/
  function elbow(d) {
      let sourceX = d.source.x-config.cellPadding+config.cellWidth*0.5,
          sourceY = d.source.y + config.circleR+config.cellWidth*0.5,
          targetX = d.target.x-config.cellPadding+config.cellWidth*0.5,
          targetY = d.target.y - config.circleR+config.cellWidth*0.5;

      return "M" + sourceX + "," + sourceY +
          "V" + ((targetY - sourceY-2) / 2 + sourceY) +
          "H" + targetX +
          "V" + targetY;

  }
  rects.selectAll(".link")
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
          return 0.5
      })
      .attr("fill","transparent")



  //再添加一个g，把圆圈画在这上面，确保圆能遮挡住链接
  var rects1 = svg.append("g")
    .selectAll("g")
    .data(arr1)
    .enter().append("g")
    .attr("transform", function (d) {
        return "translate(" + config.margins.left + "," + config.margins.top + ")";
    })

  rects1.append("circle")
      .attr("cx", d => d.x-config.cellPadding+config.cellWidth*0.5)
      .attr("cy", d => d.y+config.cellWidth*0.5)
      .attr("r", config.circleR)
      .attr("fill",function(d){
        if(d.is_sensitive==false){
          //return "transparent"
          return "white"
        }else{
          //d.funcT=senFunType(d.name,func_type)
          return z(d.funcT)
        }
      })
      /*.attr("stroke",function(d){
        if(d.is_sensitive==false){
          return "#595959"
        }else{
          //d.funcT=senFunType(d.name,func_type)
          return z(d.funcT)
        }
      })
      .attr("stroke-width", function(d) { 
          return 0.5
      })*/


  // rects.append("text")
  //     .attr("dx", config.margins.left)
  //     .attr("dy", -config.cellHeight*0.35)
  //     .style("text-anchor", "start")
  //     .style("font-size","9px")
  //     .text(function (d) {
  //       return nodes1[1].file_md5
  //     })
  rects1.append("text")
    .attr("dx", d => d.x+config.cellWidth*0.45)
    .attr("dy", d => d.y+config.cellWidth*0.225)
    .style("text-anchor", "middle")
    .style("font-size","5.25px")
    .text(function (d) {
        var funcname = d.name.split( '_' );
        if(d.name=="__main__"){
            return "main"
        }else if(d.name.length<=6){
            return d.name;
        }else if(funcname.length==1){
           return d.name.substr(0,6)

        }else{
            return d.name.substr(0,2)+"_"+funcname[funcname.length-1].substr(0,3)
        }
    })
    function senFunType(name,func_type){
      for(var j=0;j<func_type.length;j++){
        if(func_type[j].func.indexOf(name)!=-1){
          return func_type[j].name;
        }
      }
    }
    let options ={
      md5s:md5s,
      uuids:uuids.slice(0,32),
      funs_nums:funs_nums,
      op_pollu_fun_num:op_pollu_fun_num,
    }
    fn(options);
}