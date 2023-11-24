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

        let categories = [... new Set(props.data.map(x=>x.category))];
        const padding = 40;

        let subgroups = [... new Set(props.data.map(x=>x.child_feedback))];
        const index = subgroups.indexOf('none');
        if (index > -1) { // only splice array when item is found
            subgroups.splice(index, 1); // 2nd parameter means remove one item only
        }
        // console.log(props.data);

        // const subgroups = ['Agree', 'Disagree'];

        const data = [] 
        for (var k in subgroups){
            for (var c in categories){
                var res = props.data.filter(function (d) {
                    return d.child_feedback == subgroups[k] &&
                    d.category == categories[c];
                });

                // console.log(res);

                let entry = {
                    'feedback': subgroups[k],
                    'category': categories[c],
                    'count': res.length,
                }
                data.push(entry);
            }
        }

        const sumstat = d3.group(data, d => d.category); 

        const fdata = [];
        for (var c in categories){
            var d = sumstat.get(categories[c]);

            let entry = {
                'category': categories[c],
                'agree': d[0].count,
                'disagree': d[1].count,
            }
            fdata.push(entry);
        }
        // console.log(fdata);

        // Add X axis
          const x = d3.scaleBand()
              .domain(categories)
              .range([0, width-padding*3])
              .padding([0.2])
          svg.append("g")
            .attr("transform", "translate(" + padding + ',' + (height-1.5*padding) + ") ")
            .call(d3.axisBottom(x).tickSize(0));
            // .selectAll("text")
            // .attr("transform", "translate(-10,20)rotate(-45)")
            // .style("text-anchor", "middle")
            // .style("font-size", 10); 

        var y = d3.scaleLinear()
                  .domain([0, d3.max(data, function(d) { return +d.count; })])
                  .range([ height - padding*2.5, 0 ]);
  
        svg.append("g")
            .attr("transform", "translate(" + padding + ',' + 1*padding + ")")
            .call(d3.axisLeft(y));

        const xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])


        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#377eb8', '#e41a1c', '#4daf4a'])

          // Show the bars
          svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(fdata)
            .join("g")
              .attr("transform", d => `translate(${x(d.category)}, 0)`)
            .selectAll("rect")
            .data(function(d) { 
                var temp = subgroups.map(function(key) { return {key: key, value: d[key]}; });
                return  temp;
            })
            .join("rect")
              .attr("x", d => xSubgroup(d.key))
              .attr("y", d => y(d.value))
              .attr("width", xSubgroup.bandwidth())
              .attr("height", d => height - padding*2.5 - y(d.value))
              .attr("fill", d => color(d.key))
              .attr("transform", "translate(" + padding + ',' + padding + ")")
              .on('mouseover',(e,d)=>{
                    let text = 'Feedback: ' + d.key + '</br>'
                        + '</br>'
                        + 'Count: ' + d.value + '</br>';
                    tTip.html(text);
                }).on('mousemove',(e)=>{
                    props.ToolTip.moveTTipEvent(tTip,e);
                }).on('mouseout',(e,d)=>{
                    props.ToolTip.hideTTip(tTip);
                });;


        var legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (width - padding*2) + ", " + padding + ')' );


        var legend_colors = ['#377eb8', '#e41a1c', '#4daf4a'];
        // draw legends
        legend.selectAll('rect')
              .data(subgroups)
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
              .data(subgroups)
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
           .attr("x", width/2 - padding)
           .attr("y", height - padding/2)
           .attr("text-anchor", "middle")
           .text("category")

        // lable of y axis
        svg.append("text")
           .attr("class", "y-label")
           .attr("text-anchor", "middle")
           .attr("x", -height/2)
           .attr("y", 2)
           .attr("dy", ".75em")
           .attr("transform", "rotate(-90)")
           .text("count");
    });

    return (
        <div
            className={"d3-component"}
            style={{'height':'99%','width':'99%'}}
            ref={d3Container}
        ></div>
    );
}


