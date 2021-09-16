import * as React from 'react'

import DashboardHeader from '../../components/DashboardHeader'
import DashboardFooter from '../../components/DashboardFooter'
import DashboardSidebar from '../../components/DashboardSidebar'
import DashboardContainer from './Dashboard-styles'

function DashboardLayout (props) {

    return (
        <div>
            <DashboardContainer>
                <div className='header'>
                   <DashboardHeader/>
                </div>
                <div className='content'>
                    <div className='sidebar'>
                        <DashboardSidebar/> 
                    </div>
                    <div className='vLine'></div>
                    <div className='childeren'>
                        { props.children }
                    </div>
                </div>    
                <hr/>     
                <div className='footer'>
                    <DashboardFooter/>
                </div>     
            </DashboardContainer>
        </div>
    );
}

export default DashboardLayout;