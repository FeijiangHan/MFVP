import './xy_new.css';

export function create_xy_new(d3,place,width,height,data,title){
    document.querySelector(place).innerHTML = '';

    // 定义数据，d3有d3.json 和 d3.csv 获取json和表格数据，后面章节会涉及
    // let graphData = [];
    // for (let i = 0; i < data.length; i++) {
    //     graphData.push({
    //         name: ,
    //         value: data[i],
    //     })
    // }
    //console.log(data)
    let graphData = [];
    for (let i = 0; i < data.length; i++) {
        
        let label = i < 10 ? `G0${i}` : `G${i}`;
        for (let j = 0; j < data.length; j++) {
            if (data[j].key === label) {
                graphData.push({
                    key: i,
                    number: data[j].number,
                })
            }
        }
    }
    graphData.push({
        key: "",
        number: 0,
    })

    graphData.push({
        key: "",
        number: 0,
    })

    // console.log(graphData)
    // 获取y轴的值
    const yValue = (d) => d.number;
    // 获取x轴的值
    const xValue = (d) => d.key;

    const dimensions = {
        width: width, // 画布宽度
        height: height, // 画布高度
        margin: {left:20,right:18,top:10,bottom:20}
    }
    // 图表宽度
    dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
    // 图表高度
    dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
    
    const svg = d3
    .select(place)
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")  // 可自适应缩放
    .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
    // .attr("width", dimensions.width)
    // .attr("height", dimensions.height);

    // y轴为线性比例尺
    const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(graphData, (d) => yValue(d))+5])
    .range([dimensions.boundedHeight, 0])
    .nice();

        
    // d3.max 取最大值，d3.min 取最小值
    
    // 序数比例尺 可以通过 xScale.bandwidth() 获取柱状图的宽度
    const xScale = d3.scaleBand()
    .domain(graphData.map((d) => xValue(d)))
    .range([0, dimensions.boundedWidth])
    .padding(0); // padding 百分比的值

    // 颜色比例尺
    const color = d3.scaleOrdinal(d3.schemePastel2);

    const chartG = svg
        .append("g")
        .style("transform",`translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

    chartG.selectAll("rect")
        .data(graphData)
        .join("rect")
        .attr("x", (d) => xScale(xValue(d)))
        .attr("y", (d) => yScale(yValue(d)))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => dimensions.boundedHeight - yScale(yValue(d)))
        .attr("fill", "lightgrey");

    // d3 提供了 axisBottom axisLeft 来绘制坐标轴
    const xAxis = g => g
    .attr("color","#555")
    .call(d3.axisBottom(xScale).tickSize(3,8).tickSizeOuter(0))
    .call(g => g.append("text")
        .attr("x", width-38)
        .attr("y", 14)
        .attr("fill", "gray")
        .attr("font-weight", 500)
        .attr("font-size",10)
        .text(title.xTitle))

    // const xAxis = d3.axisBottom(xScale);

    chartG.append("g")
        .call(xAxis)
        // x 轴 默认位置在(0,0)，所以需要往下移
        .attr("transform", `translate(0, ${dimensions.boundedHeight})`);

    // 我们把 y轴的 刻度线延长(tickSize)
    const yAxis = g => g
    .attr("color","#555")
    .call(d3.axisLeft(yScale).tickSize(-dimensions.boundedWidth).tickSizeOuter(0))
    .call(g => g.append("text")
        .attr("x", dimensions.margin.left+19)
        .attr("y", dimensions.margin.top-11)
        .attr("fill", "gray")
        .attr("text-anchor", "end")
        .attr("font-weight", 500)
        .attr("font-size",10)
        .text(title.yTitle));

    chartG.append("g").call(yAxis)
    
}

