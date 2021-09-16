import React from "react";
import { navigate } from '@reach/router'

import DashboardHeaderContainer from './DashboardHeader-styles'
import Box from '../Box'

import { LINK_PROFILE, LINK_DASHBOARD } from '../../configs/constants-config'

function DashboardHeader (props) {

    return (
        <DashboardHeaderContainer>
            <div className='logoTypeDiv'>
            <button 
                className='logoTypeBtn'
                onClick={() => navigate(LINK_DASHBOARD)}
                >
                Polychain
            </button>
            </div>
            <div className='headerFirstLine'></div>
            <div className='secondRow'>
                <div className='marketBase'>
                    <button className='marketBaseBtn'>
                        پایه بازار
                    </button>
                </div>
                <div className='secondColumn'>
                    <div className='alarm'>
                        <img src='/svgs/alarm.svg'></img>
                    </div>
                    <button 
                        className='profileIcon'
                        onClick={() => navigate(LINK_PROFILE)}
                        >
                            <img className='profileIconImg' src='/svgs/user.svg'></img>
                    </button>
                </div>
            </div>
            <div className='headerSecondLine'></div>
        </DashboardHeaderContainer>
    );
}

export default DashboardHeader;