import React from "react";
import ChartsDrawing from '../ChartsDraw'

import CardChartsContainer from './CardCharts-styles'

function CardCharts (props) {

    return (
        <CardChartsContainer>
            <div className='title'>
                نمودار قیمت ها
            </div>
            <hr/>
            <div className='content'>
                <div className='chartPart'>
                    <hr className='hLineTop'></hr>
                    <div className='chart'>
                        <ChartsDrawing/>

                    </div>
                    <hr className='hLineTop'></hr>
                </div>
                <div className='toolsPart'>
                    <div className='toolsVLine'></div>
                    <div className='tools'>
                        <button className='toolsBtn'>
                            1
                        </button>
                        <button className='toolsBtn'>
                            2
                        </button>
                        <button className='toolsBtn'>
                            3
                        </button>
                        <button className='toolsBtn'>
                            4
                        </button>
                        <button className='toolsBtn'>
                            5
                        </button>
                        <button className='toolsBtn'>
                            6
                        </button>
                        <button className='toolsBtn'>
                            7
                        </button>
                    </div>
                </div>
            </div>
        </CardChartsContainer>
    );
}

export default CardCharts;