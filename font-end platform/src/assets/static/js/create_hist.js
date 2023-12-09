export function create_hist(d3,place,width,height,data,xType,title,fn){
    // console.log("data: ",data)
    // // console.log("create_hist_data",data);
    var {xTitle,yTitle}=title;
    // // console.log(document.querySelector(place));
    document.querySelector(place).innerHTML = '';
    var width=width;
    var height=height;        // length=800;
    var margin={left:14,right:14,top:10,bottom:15};
    //data 
    var svg=d3.select(place).append("svg")
            // .attr("width",width)
            // .attr("height",height)
            // .attr("transform","translate(0,0)")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", `0 0 ${width} ${height}`);
    var x;
    x = d3.scaleLinear()
        .domain([0, d3.max(data)+9.5]) //按照数据来
        .range([margin.left, width - margin.right])
        
    // // console.log(d3.max(data))
    var thresholds = x.ticks(20)
    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(thresholds)(data);
    
    // // console.log(bins);
    
    var y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)])
    .range([height - margin.bottom, margin.top])

    //Axis
    var xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("color","#555")
    .call(d3.axisBottom(x).ticks(5).tickSize(3,8))
    .call(g => g.append("text")
        .attr("x", width-14)
        .attr("y", -2)
        .attr("fill", "#555")
        .attr("font-weight", 500)
        .attr("font-size",9)
        .text(xTitle))
    //增加一个if判断 纵坐标为两位数的加大margin-left;
    var ymax= d3.max(bins, d => d.length);
    function range(a,b,d){
        let arr=[]
        let i=1;
        while(a+i*d<=b){
            arr.push(a+i*d);
            i++;
        }
        return arr;
    }
    // // console.log(range(0,ymax,15))
    var yAxis = g => g
    .attr("color","#555")
    .attr("transform", `translate(${margin.left},0)`)
    // .call(d3.axisLeft(y).ticks(ymax>10?[15,30,45,60]:4))
    .call(ymax>10?d3.axisLeft(y).tickValues(range(0,ymax,Math.round(ymax/4))).tickSize(3,6):d3.axisLeft(y).ticks(4).tickSize(3,6))
    // .call(g => g.select(".domain").remove()) 
    .call(g => g.append("text")
        .attr("x", yTitle==="Groups"?(margin.left+15):(margin.left+20))
        .attr("y", margin.top-2)
        .attr("fill", "#555")
        .attr("text-anchor", "end")
        .attr("font-weight", 500)
        .attr("font-size",10)
        // rotate(angle,centerX,centerY)
        // .attr("transform", "rotate(90)")
        .text(yTitle))
    var bandwidth=4;
    var density = kde(epanechnikov(), thresholds, data)
    // // console.log(density);
    //直方图
    svg.append("g")
        .attr("fill","#ccc")
        .selectAll("rect")
        .data(bins)
        .join("rect")
            .attr("x",d=>x(d.x0)+1)
            .attr("y",d=>y(d.length))
            .attr("width",d=>x(d.x1)-x(d.x0))
            .attr("height",d=>y(0)-y(d.length))
            .on('click',(d,item)=>{
                if(fn){
                    fn(item.x0,item.x1);
                }
            })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", "#ABB1DF");
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", "#CCC");
            })
    //核密度    
    var line = d3.line()
    .curve(d3.curveBasis)
    .x(d => x(d[0]))
    .y(d => y(d[1]))   
    // svg.append("path")
    //   .datum(density)
    //   .attr("fill", "none")
    //   .attr("stroke", "#888")
    //   .attr("stroke-width", 1.4)
    //   .attr("stroke-linejoin", "round")
    //   .attr("d", line);

    svg.append("g")
        .call(xAxis)
        .attr("font-size",8)

    svg.append("g")
        .call(yAxis)
        .attr("font-size",8);

    function kde(kernel, thresholds, data) {
        return thresholds.map(t => {
            return [t, d3.mean(bins, d => d.length)*d3.mean(data, d => kernel(t - d))]});
    }
    function epanechnikov(bandwidth=0.1) {
        return x => Math.abs(x /= bandwidth) <= 1 ? 1.5 * (1 - x * x) / bandwidth : 0;
    }
}