import React, {useEffect, useRef, useMemo} from 'react';
import useSVGCanvas from './useSVGCanvas.js';
import * as d3 from 'd3';


export default function PlotBarChart(props){
    // //this is a generic component for plotting a d3 plot
    const d3Container = useRef(null);
    const [svg, height, width, tTip] = useSVGCanvas(d3Container);
    // console.log(svg, height, width, tTip);

    const chartSelection = useMemo(()=>{
        if(svg === undefined | props.data === undefined){ return }

        let feedbacks = [... new Set(props.data.map(x=>x.child_feedback))];
        const index = feedbacks.indexOf('none');
        if (index > -1) { // only splice array when item is found
            feedbacks.splice(index, 1); // 2nd parameter means remove one item only
        }
        const padding = 40;

        const dates =  props.data.map(d => d.date);

        const counts = {};
        for (const d of dates) {
          counts[d] = counts[d] ? counts[d] + 1 : 1;
        }

        const allDates = Object.keys(counts);

        const data = [] 
        for (var k in allDates){
            for (var c in feedbacks){
                var res = props.data.filter(function (d) {
                    return d.date == allDates[k] &&
                    d.child_feedback == feedbacks[c];
                });

                let entry = {
                    'date': allDates[k],
                    'feedback': feedbacks[c],
                    'count': res.length,
                }

                data.push(entry);
            }
        }

        const sumstat = d3.group(data, d => d.feedback); 

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
            .attr("transform", "translate(" + padding + ',' + 1*padding + ")")
            .call(d3.axisLeft(y));

        const color = d3.scaleOrdinal()
            .range(['#e41a1c','#377eb8'])


          // Draw the line
          svg.selectAll(".line")
              .data(sumstat)
              .join("path")
                .attr("fill", "none")
                .attr("stroke", function(d){ return color(d[0]) })
                .attr("stroke-width", 1.5)
                .attr("d", function(d){
                  return d3.line()
                    .x(function(d) { return x(d.date); })
                    .y(function(d) { return y(+d.count); })
                    (d[1])
                })
                .attr("transform", "translate(" + (padding+x.bandwidth()/2) + ',' + padding + ")")
                .on('mouseover',(e,d)=>{
                    let text = 'Feedback: ' + d[0] + '</br>';
                    tTip.html(text);
                }).on('mousemove',(e)=>{
                    props.ToolTip.moveTTipEvent(tTip,e);
                }).on('mouseout',(e,d)=>{
                    props.ToolTip.hideTTip(tTip);
                });;


        var legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (width - padding*2) + ", " + padding + ')' );

        var legend_colors = ['#e41a1c','#377eb8'];
        // draw legends
        legend.selectAll('rect')
              .data(feedbacks)
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
              .data(feedbacks)
              .enter()
              .append('text')
              .text(function(d){ return d; })
              .attr('x', 19)
              .attr('y', function(d, i){ return i * 19;})
              .attr('text-anchor', 'start')
              .attr('alignment-baseline', 'hanging')
              .style("font-size", 10);

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


