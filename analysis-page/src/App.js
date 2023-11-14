import React, {useState,useEffect, useMemo} from 'react';
import './App.css';
import PlotPieChart from './pieChart';
import PlotLineChart from './lineChart';
import PlotBarChart from './barChart';
import PlotFeedChart from './feedChart';
import * as d3 from 'd3';


function App() {

  const [data, setData] = useState();

  // fetch csv data 
  function fetchCSV(){
    d3.csv("browsing_history_enhanced.csv").then(d=>{
      setData(d);
    })
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
