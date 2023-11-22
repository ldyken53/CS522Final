import React, {useState,useEffect, useMemo} from 'react';
import LZString from 'lz-string'
import moment from 'moment'
import './App.css';
import PlotPieChart from './pieChart';
import PlotLineChart from './lineChart';
import PlotBarChart from './barChart';
import PlotFeedChart from './feedChart';
import * as d3 from 'd3';


// const fs = require('fs');

// function App() {

//   const [data, setData] = useState();

//   // fetch csv data 
//   const fetchCSV = async function (){
//     await fs.writeFileSync('history-data.json', LZString.decompressFromEncodedURIComponent(window.location.search.substring(1).split('=')[1]));
//     d3.json("history-data.json").then(d=>{
//       console.log(d);
//       setData(d);    
//     });
//   }

function App() {

  const [data, setData] = useState();

  // fetch csv data 
  async function fetchCSV(){
    // d3.json("browsing_history_enhanced.csv").then(d=>{
    // })
    let d = LZString.decompressFromEncodedURIComponent(window.location.search.substring(1).split('=')[1])
    d = JSON.parse(d)[0]
    const dataList = Object.keys(d).map(k => {
      const dateData = moment(d[k]['time'])
      return {
        user_id: k,
        ...d[k],
        date: dateData.format('YYYY-MM-DD'),
        time: dateData.format('hh:mm:ss'),
        URL: d[k]['url'],
        category: d[k]['content'],
        content_type: d[k]['type'],
        child_feedback: d[k]['feedback'],
      }
    })
    console.log(dataList)
    console.log(typeof dataList)
    // console.log(JSON.parse(d)[0])
    setData(dataList);
  }

  // fetch data, called only once
  useEffect(()=>{
    fetchCSV();
  },[])

  // console.log('data', data);

  function makePieChart(){

    return (
          <>
            <div style={{'width':'100%','height':'100%','display':'inline-block'}}>
              <div 
                style={{'height': '100%','width':'calc(100% - 2em)','display':'inline-block'}}
              >
                  <PlotPieChart
                    data={data}
                    ToolTip={ToolTip}
                  />
              </div> 
            </div>
          </>
        )
  }

  function makeLineChart(){

    return (
          <>
            <div style={{'width':'100%','height':'100%','display':'inline-block'}}>
              <div 
                style={{'height': '100%','width':'calc(100% - 2em)','display':'inline-block'}}
              >
                <PlotLineChart
                  data={data}
                  ToolTip={ToolTip}
                />
              </div> 
            </div>
          </>
        )
  }


  function makeBarChart(){

    return (
          <>
            <div style={{'width':'100%','height':'100%','display':'inline-block'}}>
              <div 
                style={{'height': '100%','width':'calc(100% - 2em)','display':'inline-block'}}
              >
                <PlotFeedChart
                  data={data}
                  ToolTip={ToolTip}
                />
              </div> 
            </div>
          </>
        )
  }


  function makeFeedbackChart(){

    return (
          <>
            <div style={{'width':'100%','height':'100%','display':'inline-block'}}>
              <div 
                style={{'height': '100%','width':'calc(100% - 2em)','display':'inline-block'}}
              >
                <PlotBarChart
                  data={data}
                  ToolTip={ToolTip}
                />
              </div> 
            </div>
          </>
        )
  }

  return (
    <div className="App">
      <div className={'header'}
        style={{'height':'4em','width':'100vw'}}
      >
        <h1>{'Analysis View'}</h1>
      </div>
      <div 
        style={{'height': '43vw','width':'100vw'}}
      >
        <div className={'body'} 
          style={{'height':'50%','width':'calc(50% - 2em)', 'display':'inline-block'}}
        >
          {makePieChart()}
        </div>

        <div className={'body'} 
          style={{'height':'50%','width':'calc(50% - 2em)', 'display':'inline-block'}}
        >
          {makeLineChart()}
        </div>

        <div className={'body'} 
          style={{'height':'50%','width':'calc(50% - 2em)', 'display':'inline-block'}}
        >
          {makeBarChart()}
        </div>
        <div className={'body'} 
          style={{'height':'50%','width':'calc(50% - 2em)', 'display':'inline-block'}}
        >
          {makeFeedbackChart()}
        </div>
      </div>
    </div>
  );
}




class ToolTip {
  static moveTTip(tTip, tipX, tipY){
    var tipBBox = tTip.node().getBoundingClientRect();
    while(tipBBox.width + tipX > window.innerWidth){
        tipX = tipX - 10 ;
    }
    while(tipBBox.height + tipY > window.innerHeight){
        tipY = tipY - 10 ;
    }
    tTip.style('left', tipX + 'px')
        .style('top', tipY + 'px')
        .style('visibility', 'visible')
        .style('z-index', 1000);
  }

  static moveTTipEvent(tTip, event){
      var tipX = event.pageX + 30;
      var tipY = event.pageY -20;
      this.moveTTip(tTip,tipX,tipY);
  }


  static hideTTip(tTip){
      tTip.style('visibility', 'hidden')
  }

  static addTTipCanvas(tTip, className, width, height){
      tTip.selectAll('svg').selectAll('.'+className).remove();
      let canvas = tTip.append('svg').attr('class',className)
          .attr('height',height).attr('width',width)
          .style('background','white');
      return canvas
  }
}

export default App;
