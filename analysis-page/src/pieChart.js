import React, {useEffect, useRef, useMemo} from 'react';
import useSVGCanvas from './useSVGCanvas.js';
import * as d3 from 'd3';


export default function PlotPieChart(props){
    // //this is a generic component for plotting a d3 plot
    const d3Container = useRef(null);
    const [svg, height, width, tTip] = useSVGCanvas(d3Container);
    // console.log(svg, height, width, tTip);

    const chartSelection = useMemo(()=>{
        if(svg === undefined | props.data === undefined){ return }

        let categories = [... new Set(props.data.map(x=>x.category))];

        var cag_counts = new Array(categories.length).fill(0);
        for(let d of props.data){
            var index = categories.indexOf(d.category);
            cag_counts[index] += 1;
        }

        var pieData = [];
        var tCount = 0;
        for (let i =0; i < categories.length; i++) {
            let entry = {
                'category': categories[i],
                'count': cag_counts[i],
            }
            tCount += cag_counts[i];
            pieData.push(entry);
        }

        // console.log(pieData);

        const radius = width*0.2;

        var ordScale = d3.scaleOrdinal()
                        .domain(pieData)
                        .range(['#ffd384','#94ebcd','#fbaccc','#d3e0ea','#fa7f72']);

        let pieChart = svg.append("g")
                            .attr('class','stack')
                            .attr("transform", "translate(" + (width/3 + radius) + ", " + (radius + 20)  + ")");

        var pie = d3.pie().value(function(d) { 
                return d.count; 
            });

        var arc = pieChart.selectAll("arc")
                   .data(pie(pieData))
                   .enter();

        var path = d3.arc()
                     .outerRadius(radius)
                     .innerRadius(0);

        arc.append("path")
           .attr("d", path)
           .attr("fill", function(d) { return ordScale(d.data.category); })
           .attr('stroke','black')
           .attr('stroke-width',0.2)
           .on('mouseover',(e,d)=>{
                let text = 'Category: ' + d.data.category + '</br>'
                    + '</br>'
                    + 'Count: ' + d.data.count + '</br>'
                    + 'Percent: ' + (d.data.count/tCount * 100).toFixed(0) + '%' + '</br>';
                tTip.html(text);
            }).on('mousemove',(e)=>{
                props.ToolTip.moveTTipEvent(tTip,e);
            }).on('mouseout',(e,d)=>{
                props.ToolTip.hideTTip(tTip);
            });

        var label = d3.arc()
                      .outerRadius(radius)
                      .innerRadius(0);

        var label2 = d3.arc()
                      .outerRadius(radius*2.1)
                      .innerRadius(0);
            
        arc.append("text")
           .attr("transform", function(d) { 
                var rotation = (d.startAngle/2 + d.endAngle/2) * 180/Math.PI;
                return "translate(" + (label2.centroid(d)) + ") rotate(" + rotation + ")"; 
            })
           .text(function(d) { return d.data.category; })
           .style("font-family", "arial")
           .style("font-size", 12)
           .style("text-anchor", "middle");

        arc.append("text")
           .attr("transform", function(d) { 
                var rotation = (d.startAngle/2 + d.endAngle/2) * 180/Math.PI;
                return "translate(" + (label.centroid(d)) + ") rotate(" + rotation + ")"; 
            })
           .text(function(d) { return (d.data.count/tCount * 100).toFixed(0) + '%'; })
           .style("font-family", "arial")
           .style("font-size", 12)
           .style("text-anchor", "left");

    });

    return (
        <div
            className={"d3-component"}
            style={{'height':'99%','width':'99%'}}
            ref={d3Container}
        ></div>
    );
}


