import React from "react";

import DashboardSidebarContainer from './DashboardSidebar-styles'
import { navigate } from "@reach/router";
import { 
    LINK_WALLET,
    LINK_CHARTS, 
    LINK_TICKETS
} from "../../configs/constants-config";


function DashboardSidebar (props) {

    return (
            <DashboardSidebarContainer>
                <button 
                    className='firstIcon'
                    onClick={() => {
                        navigate(LINK_WALLET)
                    }}
                >
                    1
                </button>
                <button 
                    className='iconBtn'
                    onClick={() => {
                        navigate(`${LINK_CHARTS}?cur=${'BTC'}`)
                    }}
                >
                    2
                </button>
                <button 
                    className='iconBtn'
                    onClick={() => {
                        navigate(LINK_TICKETS)
                    }}
                    >
                    3
                </button>
                <button className='iconBtn'>
                    4
                </button>
                <button className='iconBtn'>
                    5
                </button>
                <button className='iconBtn'>
                    6
                </button>
                <button className='iconBtn'>
                    7
                </button>

            </DashboardSidebarContainer>
    );
}

export default DashboardSidebar;