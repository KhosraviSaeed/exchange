import React, { useState } from "react";
import ModalAddTicket from '../ModalAddTicket'
import useDeleteTickets from '../../hooks/useDeleteTickets'


function TabNewTickets(props) {

    let { data, refetch } = props
    let { deleteTickets } = useDeleteTickets()

    const newArr = Array.from(Array(data.newTickets.quantity)).fill(false);
    let [newTicketsArray, setNewTicketsArray] = useState(newArr)
    let [newTicketsCheckArray, setNewTicketsCheckArray] = useState(newArr)
    let [checked, setChecked] = useState(false)
    let [isOpen, setOpen] = useState(false)
    const toggleModal = () => setOpen(!isOpen)

    let theIndex = newTicketsCheckArray.findIndex((v) => v === true)
    let isDisabled = theIndex === -1 ? true : false

return (
    <>
        <div className='contentFirstRow'>
            <input 
                className='selectBox'
                type='checkbox'
                onClick={() => {
                    let newArr = Array.from(Array(data.newTickets.quantity)).fill(true);
                    if (checked === false) {
                        setChecked(true)
                    } else {
                        newArr = Array.from(Array(data.newTickets.quantity)).fill(false);
                        setChecked(false)
                    }
                    newTicketsCheckArray = newArr
                    setNewTicketsCheckArray(newTicketsCheckArray)
                }}
                >
            </input>
            <img
                className='dropImage'
                src='svgs/drop.svg'
            >
            </img>
            <button 
                className='deleteBtn'
                disabled={isDisabled}
                onClick={async() => {
                    let ticketIds = []
                    await newTicketsCheckArray.map((e, i) => {
                        if (e === true) {
                            ticketIds.push(data.newTickets.newTicketsArr[i]._id)
                        }
                    })
                    deleteTickets({
                        ticketIdArray: ticketIds
                    })
                }}
                >
                <img
                    className='deleteImage'
                    src='svgs/delete.svg'
                >
                </img>
            </button>
            <div className='delete'>
                حذف
            </div>
        </div>
    {
        data.newTickets.newTicketsArr.map((e, i) => (
            <div key={i}>
            <div className='ticketRow'>
                <input
                    className='ticketRowCheckBox'
                    type='checkbox'
                    checked={newTicketsCheckArray[i]}
                    onChange={() => {
                        const newArr = [...newTicketsCheckArray]
                        newArr[i] = !newArr[i]
                        newTicketsCheckArray = newArr
                        setNewTicketsCheckArray(newTicketsCheckArray)
                    }}
                >
                </input>
                <div className='qInCard'>
                {e.issue}    
                </div>    
                <button 
                    className='detailsBtn'
                    onClick={() => {
                        const newArr = [...newTicketsArray]
                        if(newArr[i]) {
                            newArr[i]=false
                        } else {
                            newArr.forEach((elm, j) => {
                                if(j !== i) {
                                    newArr[j] = false
                                } else {
                                    newArr[j] = true
                                }
                            })
                        }
                        newTicketsArray = newArr
                        setNewTicketsArray(newTicketsArray)
                    }}
                >
                    <img
                        className='dropImage'
                        src='svgs/drop.svg'
                    >
                    </img>
                </button> 
            </div>
            {
                newTicketsArray[i] &&
                <div className='detailsCard'>
                    {
                        e.comments.map((element, index) => (
                            <div className='detailsCardQandM' key={index}>
                                {
                                    element.ownerType === 'User' &&
                                    <>
                                        <div className='detailsCardQ'>
                                            {element.comment}
                                        </div>
                                        <div className='qDate'>
                                            {new Date(element.date).toLocaleString("fa-IR")}
                                        </div>
                                    </>
                                }
                                {
                                    element.ownerType !== 'User' &&
                                    <>
                                        <div className='detailsCardMessageDiv'>
                                            <div className='flesh'>
                                                <img src='svgs/flesh.svg'></img>
                                            </div>
                                            <div className='qLine'></div>
                                            <div className='detailsCardMessage'>
                                                {element.comment}
                                            </div>
                                        </div>
                                        <div className='mDate'>
                                            {new Date(element.date).toLocaleString("fa-IR")}
                                        </div>
                                    </>
                                }
                                {
                                    index === 0 &&
                                    <div className='detailsCard‌BtnDiv'>
                                        <button 
                                            className='detailsCard‌BtnReply'
                                            onClick={() => setOpen(true)}
                                            >
                                            پاسخ
                                        </button>
                                        <ModalAddTicket
                                            isOpen={isOpen}
                                            toggleModal={toggleModal}
                                            title='افزودن کامنت به تیکت'
                                            isComment={true}
                                            ticket={e}
                                            refetch={refetch}
                                        >
                                        </ModalAddTicket>
                                        <button className='detailsCard‌BtnClose'>
                                            بستن
                                        </button>
                                    </div>
                                }
                            </div>
    
                        ))
                    }
                    <div className='detailsCardQandM'>
                        <div className='detailsCardQ'>
                            {e.issue} 
                        </div>
                        <div className='qDate'>
                            {new Date(e.date).toLocaleString("fa-IR")}
                        </div>
                    </div>
                    {
                        e.comments.length === 0 &&
                        <div className='detailsCard‌BtnDiv'>
                            <button 
                                className='detailsCard‌BtnReply'
                                onClick={() => setOpen(true)}
                                >
                                کامنت
                            </button>
                            <ModalAddTicket
                                isOpen={isOpen}
                                toggleModal={toggleModal}
                                title='افزودن کامنت به تیکت'
                                isComment={true}
                                ticket={e}
                                refetch={refetch}
                            >
                            </ModalAddTicket>
                            <button className='detailsCard‌BtnClose'>
                                بستن
                            </button>
                        </div>
                    }
                </div>
            }
            </div>
        ))
    }
</>
)

}

export default TabNewTickets