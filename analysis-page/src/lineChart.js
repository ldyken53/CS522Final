import React, {useEffect, useRef, useMemo} from 'react';
import useSVGCanvas from './useSVGCanvas.js';
import * as d3 from 'd3';


export default function PlotLineChart(props){
    // //this is a generic component for plotting a d3 plot
    const d3Container = useRef(null);
    const [svg, height, width, tTip] = useSVGCanvas(d3Container);
    // console.log(svg, height, width, tTip);

    const chartSelection = useMemo(()=>{
        if(svg === undefined | props.data === undefined){ return }
        let categoriesTrue = [... new Set(props.data.map(x=>x.category))];
        categoriesTrue = categoriesTrue.filter(e => e !== 'testing');

        props.data.unshift({
            URL: "https://www.testcontent.com",
            category: "testing",
            child_feedback: "none",
            content: "testing",
            content_type: "image",
            date: "2023-11-1",
            feedback: "none",
            time: "00:00:00",
            type: "text",
            url: "https://www.testcontent.com",
            user_id: "000000000000"
        });

        let categories = [... new Set(props.data.map(x=>x.category))];

        const dates =  props.data.map(d => d.date);
        const padding = 40;

        const counts = {};
        for (const d of dates) {
          counts[d] = counts[d] ? counts[d] + 1 : 1;
        }

        const allDates = Object.keys(counts);

        const data = [] 
        for (var k in allDates){
            for (var c in categories){
                var res = props.data.filter(function (d) {
                    return d.date == allDates[k] &&
                    d.category == categories[c];
                });

                let entry = {
                    'date': allDates[k],
                    'category': categories[c],
                    'count': res.length,
                }

                data.push(entry);
            }
        }

        const sumstat = d3.group(data, d => d.category); 

        const dateLen = Object.keys(counts).length;

        var x = d3.scaleBand()
            .domain(allDates)       
            .range([0, width - padding*3]); 

        svg.append("g")
                .attr("transform", "translate(" + padding + ',' + (height-1.5*padding) + ") ")
                .call(d3.axisBottom(x).ticks(dateLen))
                .selectAll("text")
                .attr("transform", "translate(-10,20)rotate(-45)")
                .style("text-anchor", "middle")
                .style("font-size", 10);

        var y = d3.scaleLinear()
                  .domain([0, d3.max(data, function(d) { return +d.count; })])
                  .range([ height - padding*2.5, 0 ]);
  
        svg.append("g")
            .attr("transform", "translate(" + padding + ',' + (padding) + ")")
            .call(d3.axisLeft(y));

        const color = d3.scaleOrdinal()
            .range(['#999999', '#377eb8','#e41a1c','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])


          // Draw the line
          svg.selectAll(".line")
              .data(sumstat)
              .join("path")
                .attr("fill", "none")
                .attr("stroke", function(d){ return color(d[0]) })
                .attr("stroke-width", 1.5)
                .attr("d", function(d){
                    console.log(d)
                    if (d[0] == "testing") {
                        return
                    } else {
                        return d3.line()
                        .x(function(d) { return x(d.date); })
                        .y(function(d) { return y(+d.count); })
                        (d[1])
                    }
                })
                .on('mouseover',(e,d)=>{
                    let text = 'Category: ' + d[0] + '</br>';
                    tTip.html(text);
                }).on('mousemove',(e)=>{
                    props.ToolTip.moveTTipEvent(tTip,e);
                }).on('mouseout',(e,d)=>{
                    props.ToolTip.hideTTip(tTip);
                })
                .attr("transform", "translate(" + (padding + x.bandwidth()/2) + ',' + padding + ")");;


        var legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (width - padding*2) + ", " + padding + ')' );

        var legend_colors = ['#377eb8','#e41a1c','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'];
        // draw legends
        legend.selectAll('rect')
              .data(categoriesTrue)
              .enter()
              .append('rect')
              .attr('x', 0)
              .attr('y', function(d, i){ return i * 18; })
              .attr('width', 12)
              .attr('height', 12)
              .attr('fill', function(d, i){
                  return legend_colors[i];
              });

        legend.selectAll('text')
              .data(categoriesTrue)
              .enter()
              .append('text')
              .text(function(d){ return d; })
              .attr('x', 19)
              .attr('y', function(d, i){ return i * 19;})
              .attr('text-anchor', 'start')
              .attr('alignment-baseline', 'hanging')
              .style("font-size", 7);

        svg.append("text")
           .attr("class", "x-label")
           .attr("x", width - padding)
           .attr("y", height - padding)
           .attr("text-anchor", "middle")
           .text("Date")

        // lable of y axis
        svg.append("text")
           .attr("class", "y-label")
           .attr("text-anchor", "middle")
           .attr("x", -height/2)
           .attr("y", 2)
           .attr("dy", ".75em")
           .attr("transform", "rotate(-90)")
           .text("Access Count");


    });

    return (
        <div
            className={"d3-component"}
            style={{'height':'99%','width':'99%'}}
            ref={d3Container}
        ></div>
    );
}


