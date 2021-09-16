import React, { useState } from "react";

import CardHistoryofTicketsContainer from './CardHistoryofTickets-styles'
import TabNewTickets from './TabNewTickets'

function CardHistoryofTickets (props) {
    let { data, refetch } = props

    let [tabNewTickets, setTabNewTickets] = useState(true)
    let [tabWaitingTickets, setTabWaitingTickets] = useState(false)
    let [tabOpenTickets, setTabOpenTickets] = useState(false)
    let [tabClosedTickets, setTabClosedTickets] = useState(false)

    return (
        <CardHistoryofTicketsContainer>              
            <div className='cardHistory'>
                <div className='header'>
                    <div className='tab'>
                        <button
                            className='tabBtn'
                            onClick={() => {
                                setTabNewTickets(true)
                                setTabWaitingTickets(false)
                                setTabOpenTickets(false)
                                setTabClosedTickets(false)
                            }}
                        >
                            تیکت‌های جدید    
                        </button>
                        {
                            tabNewTickets && 
                            <hr/>
                        }
                    </div>
                    <div className='tab'>
                        <button
                            className='tabBtn'
                            onClick={() => {
                                setTabNewTickets(false)
                                setTabWaitingTickets(true)
                                setTabOpenTickets(false)
                                setTabClosedTickets(false)
                            }}
                        >
                            تیکت‌های منتظر پاسخ    
                        </button>
                        {
                            tabWaitingTickets && 
                            <hr/>
                        }
                    </div>
                    <div className='tab'>
                        <button
                            className='tabBtn'
                            onClick={() => {
                                setTabNewTickets(false)
                                setTabWaitingTickets(false)
                                setTabOpenTickets(true)
                                setTabClosedTickets(false)
                            }}
                        >
                            تیکت‌های باز    
                        </button>
                        {
                            tabOpenTickets && 
                            <hr/>
                        }
                    </div>
                    <div className='tab'>
                        <button
                            className='tabBtn'
                            onClick={() => {
                                setTabNewTickets(false)
                                setTabWaitingTickets(false)
                                setTabOpenTickets(false)
                                setTabClosedTickets(true)
                            }}
                        >
                           تیکت‌های بسته شده   
                        </button>
                        {
                            tabClosedTickets && 
                            <hr/>
                        }
                    </div>      
                </div>
                <div className='content'>

                    <div className='rows'>
                        {
                            tabNewTickets && 
                            <TabNewTickets
                                data={data}
                                refetch={refetch}
                            />
                        }
                    </div>
                </div>
            </div>
    
        </CardHistoryofTicketsContainer>
    );
}

export default CardHistoryofTickets;