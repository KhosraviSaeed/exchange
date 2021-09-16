import React, { useState } from "react";

import TicketsContainer from './Tickets-styles'
import CardHistoryofTickets from '../CardHistoryofTickets'
import ModalAddTicket from '../ModalAddTicket'

import { numbersFormatter } from '../../helpers/general-helper'

function Tickets (props) {
    
    let { data, loading, hasError, refetch } = props
    let [isOpen, setOpen] = useState(false)
    const toggleModal = () => setOpen(!isOpen)
    
    return (
        <TicketsContainer>
            <div className='firstRow'>
                <div className='addTicketCard'>
                    <div className='addTicketCardTitle'>
                            ایجاد تیکت جدید
                    </div>
                    <button 
                        className='addTicketCardBtn'
                        onClick={() => setOpen(true)}
                        > 
                        <img src='svgs/add.svg'></img>
                    </button>
                </div>
                <div className='ticketsStatsCard'>
                    <table>
                        <thead>
                            <tr>
                                <td className='tdTitle'>
                                    نام
                                </td>
                                <td>
                                    تیکت‌های جدید
                                </td>
                                <td>
                                    تیکت‌های منتظر پاسخ
                                </td>
                                <td>
                                    تیکت‌های باز
                                </td>
                                <td>
                                    تیکت‌های بسته
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='tdTitle'>
                                تعداد
                                </td>
                                <td>
                                    {numbersFormatter(data.newTickets.quantity)}
                                </td>
                                <td>
                                    {numbersFormatter(data.openTickets.quantity)}
                                </td>
                                <td>
                                    {numbersFormatter(data.pendingTickets.quantity)}
                                </td>
                                <td>
                                    {numbersFormatter(data.closedTickets.quantity)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <img className='statsImage' src='svgs/statsofTikets.svg'></img>
                </div>
            </div>
            <ModalAddTicket
                isOpen={isOpen}
                toggleModal={toggleModal}
                refetch={refetch}
            >
            </ModalAddTicket>
            <CardHistoryofTickets 
                data={data}
                refetch={refetch}
            />

        </TicketsContainer>
    );
}

export default Tickets;