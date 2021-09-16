import * as React from "react";
import * as ReactDOM from "react-dom";
import "./material.css"
import { AxisModel, CrosshairSettingsModel,FontModel }
from'@syncfusion/ej2-react-charts';
import { StockChartComponent, StockChartSeriesCollectionDirective, StockChartSeriesDirective, Inject, DateTime, Tooltip, RangeTooltip, Crosshair, LineSeries, SplineSeries, CandleSeries, HiloOpenCloseSeries, HiloSeries, RangeAreaSeries, Trendlines , Zoom} from '@syncfusion/ej2-react-charts';
import { EmaIndicator, RsiIndicator, BollingerBands, TmaIndicator, MomentumIndicator, SmaIndicator, AtrIndicator, AccumulationDistributionIndicator, MacdIndicator, StochasticIndicator, Export } from '@syncfusion/ej2-react-charts';
import { chartData } from "./datasource";

function ChartsDrawing (props) {

    return (
        <div>
    <StockChartComponent  id="stockchart"  crosshair={{enable: true, lineType:'Vertical', 
    line: { color: '#55FFCC', width: 5}}}
    primaryXAxis={{crosshairTooltip: { enable: true, textStyle: { fontStyle: 'italic'} }}}
    primaryYAxis={{crosshairTooltip: { enable: true }}}
   
              >
     {/* <Inject services={[DateTime, Tooltip, RangeTooltip, Crosshair, LineSeries, SplineSeries, CandleSeries, HiloOpenCloseSeries, HiloSeries, RangeAreaSeries, Trendlines,EmaIndicator, RsiIndicator, BollingerBands, TmaIndicator, MomentumIndicator, SmaIndicator, AtrIndicator, Export,AccumulationDistributionIndicator, MacdIndicator, StochasticIndicator ]}/> */}
     <Inject services={[DateTime,  RangeTooltip, Crosshair, LineSeries, SplineSeries, CandleSeries, HiloOpenCloseSeries, HiloSeries, RangeAreaSeries, Trendlines,EmaIndicator, RsiIndicator, BollingerBands, TmaIndicator, MomentumIndicator, SmaIndicator, AtrIndicator, Export,AccumulationDistributionIndicator, MacdIndicator, StochasticIndicator , Zoom ]}/>
      <StockChartSeriesCollectionDirective>
        <StockChartSeriesDirective  dataSource={chartData} type='Candle'  xName='date' high='high' low='low' open='open' close='close'name='Apple' />
      </StockChartSeriesCollectionDirective>
    </StockChartComponent>
        </div>
    );
}

export default ChartsDrawing;