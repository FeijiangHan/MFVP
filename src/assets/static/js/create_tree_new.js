export function create_tree_new(d3,f_md5,tree_datas_all,place,fn){
    

    document.querySelector(place).innerHTML="";
    let md5s= f_md5;
    let uuids = tree_datas_all.unique_id;
    let funs_nums = 0;
    let op_pollu_fun_num =0;
    let data=tree_datas_all;
    var width =8000 ,//195-3200
        height = 600;
    // var filepath="byorder_8b073d9d0da207251453889115dc9f2f_5c17496e6d07513547c77dc435254126.json";

    /*var linear=d3.scale.linear()
        .domain([0.5,7])
        .range([0.6,2]);*/

    var svg = d3.
        select(place)
        .append("svg")
        .attr("width", width+80)
        .attr("height", height)
        //.attr("viewBox",[0,0,width*2,height*2])
        .append("g")
        .attr("transform", "translate(100,80)")
        

    var z = d3.scale
    .ordinal()
        //.domain(data.columns.slice(1))
    .domain(["130","132","129","134","135","131","133","136","137"])
    .range(["#FFA500", "#4682B4", "#B22222", "#8B008B","#FF00FF","#FFFF00","#9966FF","#996600","#CCFFFF"])
    var defs = svg.append("defs");
    var clipWrapper = defs.append("g").attr("class", "clip-group-wrapper");
    var filter = defs.append("filter")
    .attr("width", "300%")
    .attr("x", "-150%")
    .attr("height", "300%")
    .attr("y", "-150%")
    .attr("id","glow");
    filter.append("feGaussianBlur")
    .attr("class", "blur")
    .attr("stdDeviation","1.5")
    .attr("result","coloredBlur");
    var root=data; //数据外面有中括号 @cz去掉
    //var root=data; 
    // // console.log(data);
    
    var tree1 = d3.layout.tree()
        .size([width-100, height - 100])
        .separation(function (a, b) {
            //return (a.parent == b.parent ? 1 : 2);
            var aargc=a.argc*0.5;
            var bargc=b.argc*0.5;
            if(aargc==0){aargc=0.5}
            if(bargc==0){bargc=0.5}
            if((aargc+bargc)<=1.5){
                return 0.5;
            }else if((aargc+bargc)<=2){
                return 0.65
            }
            return 0.75
        });

    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.x, d.y];
        });

    var nodes1 = tree1.nodes(root);
    var links1 = tree1.links(nodes1);

    var newnode=[]


    var obj={};
    var objnum={};

    for(var ni=1;ni<nodes1.length;ni++){
        var item=nodes1[ni].depth;
        //var nodes1argc=nodes1[ni].argc
        if(obj[item]){
            obj[item]=(obj[item]+1)
            var tempnum=nodes1[ni].argc==0?1:nodes1[ni].argc;
            objnum[item]+=tempnum
        }else{
            obj[item]=1;
            objnum[item]=nodes1[ni].argc==0?1:nodes1[ni].argc;
        }
        //obj[item]=(obj[item]+1) || 1;

    }
    function getobjvalue(objnum) {
        var values = [];
        for (var property in objnum)
            values.push(objnum[property]);
        return values;
    }
    var values=getobjvalue(objnum)
    var keys=[];
    for (var property in objnum){
        if(objnum[property]==values){
            keys.push(property)
        }else{continue;}
    }

    // // console.log("obj: ");
    // // console.log(obj);
    // // console.log(objnum);
    var tree_h=Object.keys(obj).length;

    
    var maxargc=d3.max(values)
    // // console.log(maxargc)
    var maxwidth = maxargc*35;
    // // console.log(objnum[1]<maxargc&&objnum[2]<maxargc);
    if(objnum[1]<maxargc&&objnum[2]<maxargc&&objnum[3]<maxargc){
        maxwidth = maxargc*46;
    }else if(objnum[1]<maxargc/*&&objnum[2]<maxargc*/){
        maxwidth = maxargc*40;
    }else{
        maxwidth = maxargc*50;
    }
    // // console.log(6,maxwidth);
//maxwidth
    var tree = d3.layout.tree()
        .size([maxwidth+200, tree_h*55])
        .separation(function (a, b) {
            //return (a.parent == b.parent ? 1 : 2);
            var aargc=a.argc*0.5;
            var bargc=b.argc*0.5;
            if(aargc==0){aargc=0.5}
            if(bargc==0){bargc=0.5}
            if((aargc+bargc)<=1.5){
                return 0.5;
            }else if((aargc+bargc)<=2){
                return 0.7;
            }else if((aargc+bargc)<=3){
                return 0.85
            }
            return 1.2
        });
    var nodes = tree.nodes(root);
    var links = tree.links(nodes);

    // // console.log("nodes");
    // // console.log(nodes);



    //var layermap=[1,0,0,0,0,0,0,0,0];
    var issame=0;

    // // console.log(nodes);
    // // console.log(links);

    var link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        //.attr("marker-end", function(d) { return "url(#arrow)"; })
        .attr("d", diagonal)
        .attr("stroke-width", function(d) { 
            //// console.log(d.target.call_num);
            return Math.sqrt(Math.sqrt(d.target.call_num)); })
            //return Math.sqrt(d.target.call_num); })
        .append("title")
            .text(function(d){
                return "all_index: "+d.target.all_index+"\ntotal callnum: "+d.target.call_num;
        });

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })


    node.append("rect")
        .attr("rx",3)
        .attr("ry",3)
        .attr("width", function (d){
            if(d.depth==0||d.argc==0){
                return "22";
            }else{
                var w=d.argc*17+5;
                return w;
            }
        })//40
        .attr("height", 22)
        .attr("stroke",function(d){
            funs_nums+=1;
            if(d.is_sensitive==1){
                op_pollu_fun_num+=1;
                return "steelblue"//"#B22222"
            }
            return " steelblue";
        })
        .attr('stroke-width',"1px")
        
        .attr("fill",function(d){
            if(d.is_sensitive==1){
                return "#B0C4DE"//"#FFE4E1"
                //return "rgba(178,34,34,0.5)"
            }else{
                return "white";
            }
        })
        .attr("transform", function (d) {
            if(d.depth==0||d.argc==0){
                return "translate(" + -11 + "," + -11 + ")";
            }else{
                var tx=(-0.5)*(d.argc*17+5);
                return "translate(" + tx + "," + -11 + ")";//y 
            }      
        })
        .append("title")
            .text(function(d){
                return "name: "+d.name;
        });


    var gcircle = svg.append("g")
        .attr("transform","translate(0,0)");
    


    node.append("text")
        .attr("dx", 0)
        .attr("dy", -15)
        .style("text-anchor", "middle")
        .style("font-size","9.2px")
        .text(function (d) {
            //return d.name
            var funcname = d.name.split( '_' );
            if(d.name=="__main__"){
                return "main"                       
            }else if(d.name.length<=9){
                return d.name;
            }else if(funcname.length==1){
            return d.name.substr(0,9)

            }else{
                return d.name.substr(0,4)+"_"+funcname[funcname.length-1].substr(0,4)
            }
        });

    // // console.log(nodes.length);
    // // console.log(nodes.depth);
    // // console.log(nodes[1].x);
    var ispolluted=0;
    for(var i=1;i<nodes.length;i++){
        var temp=nodes[i];
        //layermap[temp.depth]++;
        var sensi=+temp.is_sensitive;
        /*if(sensi==1){
            newnode.push(temp);
            newnode.push(temp.parent);
        }*/
        var startx=temp.x-0.5*(temp.argc*17+5)+11;
        //(-0.5)*(d.argc*19.5+5.5)
        var dyna=temp.dynamic.substr(1,1);
        var dynamicstr=temp.dynamic.substr(1,temp.dynamic.length-2);
        var dynamicstr1 = dynamicstr.split( ', ' );
        for(var j=0;j<=temp.argc-1;j++){

            gcircle.append("circle")
                .attr("cx", startx)
                .attr("cy", temp.y)
                .attr("r", 6)
                .attr("fill", "white")
                .attr("filter",function(d){
                    var is_sen=+temp.period;
                    if(is_sen>0){

                        return "url(#glow)"
                    }else{
                        return null;
                    }
                })
                //.attr("filter","url(#glow)")
                .attr("stroke-width", "0.5px")
            gcircle.append("circle")
                .attr("cx", startx)
                .attr("cy", temp.y)
                .attr("r", 4.1)
                .attr("fill", "white")
                .attr("filter",function(d){
                    var is_sen=+temp.period;
                    if(is_sen>0){
                        defs.append("filter")
                        .attr("width", "300%")
                        .attr("x", "-150%")
                        .attr("height", "300%")
                        .attr("y", "-150%")
                        .attr("id",function(d){
                            return "glow"+i+j
                        })
                            .append("feGaussianBlur")
                            .attr("class", "blur")
                            .attr("stdDeviation",function(d){
                                return Math.sqrt(is_sen);
                            })
                            .attr("result","coloredBlur");

                        return "url(#glow"+i+j+")"
                    }else{
                        return null;
                    }
                })
                .attr("stroke-width", "0.5px")
            if(dynamicstr1[j]=="0"||dynamicstr1[j]==""||dynamicstr1.length<temp.argc){

            }else{
                ispolluted=1;
                /*newnode.push(temp);
                newnode.push(temp.parent);*/
                var endA=0;
                // // console.log("temp.dynamic_index: "+temp.dynamic_index);

                var indexset_arr = JSON.parse(temp.dynamic_index);
                

                var callnum=+temp.call_num;
                if(temp.df==0){
                    endA=2*Math.PI;
                    
                }else{
                    //// console.log("arr1.length:"+indexset_arr[j].length);
                    issame=1;
                    var calangle=2.0*Math.PI*(indexset_arr[j].length)/callnum;
                    //// console.log("arr1.angle:"+calangle);
                    endA=calangle;
                }
                var arc_in = d3.svg.arc()
                    .innerRadius(4.25)
                    .outerRadius(6.65)
                    .startAngle(0)
                    .endAngle(endA);
                var arcin=arc_in()
                gcircle.append('path')
                    .attr("d",arcin)
                    .attr("transform",function(d){
                        return "translate("+startx+","+temp.y+")";
                    })
                    //.attr("fill","#CCC")
                    .attr("fill", d => z(dynamicstr1[j]))
                    //.attr("filter","url(#glow)")
                    .attr("filter",function(d){
                        var is_sen=+temp.period;
                        if(is_sen>0){
                            return "url(#glow"+i+j+")";
                            //return "url(#glow)"
                        }else{
                            return null;
                        }
                    })
                    .append("title")
                    .text(function(d){
                        return "index: "+indexset_arr[j]+"\ntotal_callnum: "+callnum;
                    });
                // // console.log(dynamicstr1[j])
                if(temp.parent.depth!=0){
                    var dynamic_par_str=temp.parent.dynamic.substr(1,temp.parent.dynamic.length-2);
                    var dynamic_par_str1 = dynamic_par_str.split( ', ' );
                    var loc_x=temp.parent.x-0.5*(temp.parent.argc*17+5)+11;
                    for(var aa=0;aa<dynamic_par_str1.length;aa++){
                        if(dynamic_par_str1[aa]==dynamicstr1[j]&&temp.parent.depth!=0){
                            var new1=parseInt(dynamicstr1[j]);
                            gcircle.append("circle")
                                .attr("cx", startx)
                                .attr("cy", temp.y)
                                .attr("r", 3)
                                .attr("fill", d => z(dynamicstr1[j]))
                                .attr("stroke-width", "0px")
                                /*.attr("fill", function(d){
                                    
                                    //return "orange";
                                    return "rgb("+new1+",0,0)";
                                })*/

                            gcircle.append("circle")
                                .attr("cx", loc_x)
                                .attr("cy", temp.parent.y)
                                .attr("r", 3)
                                /*.attr("fill", function(d){
                                    return "rgb("+new1+",0,0)";
                                })*/
                                .attr("fill", d => z(dynamicstr1[j]))
                                .attr("stroke-width", "0px")
                                

                            gcircle.append("line")
                                .attr("x1", startx)
                                .attr("y1", temp.y)
                                .attr("x2", loc_x)
                                .attr("y2", temp.parent.y)
                                .attr("stroke", d => z(dynamicstr1[j]))
                                /*.attr("stroke", function(d){
                                    return "rgb("+new1+",0,0)";
                                })*/
                                .attr("stroke-width", "1.2px")
                                .append("title")
                                .text(function(d){
                                    return "argv: "+dynamicstr1[j];
                                });


                        }
                        loc_x+=17;
                    }
                }
            }
            startx+=17;
        }

    }
    
    gcircle.append("circle")
        .attr("cx", nodes[0].x)
        .attr("cy", nodes[0].y)
        .attr("r", 6.5)
        .attr("fill", function(d){
            if(ispolluted==0){
                return "white"; 
            }else{                              
                return "#CCCCCC";
            }
            
        })
    /*gcircle.append("text")
        .attr("dx", nodes[0].x) 
        .attr("dy", nodes[0].y-40)
        .style("text-anchor", "middle")
        .text(nodes[1].file_md5)*/
        //.text("md5:e470f609b15b96fdb5c40b3a30926105")

    // // console.log(issame);
    let options={
        md5s:md5s,
        uuids:uuids.slice(0,32),
        funs_nums:funs_nums,
        op_pollu_fun_num:op_pollu_fun_num,
      }
      
      fn(options);
    
}