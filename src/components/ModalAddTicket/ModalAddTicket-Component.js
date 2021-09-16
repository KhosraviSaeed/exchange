import React, { useState } from "react";
import Modal, { DefaultLayout } from "../Modal";

import ModalAddTicketContainer from "./ModalAddTicket-Styles";
import useCreateTicket from '../../hooks/useCreateTicket'
import useAddCommentToTicket from '../../hooks/useAddCommentToTicket'


function ModalAddTicket(props) {
  let { isOpen, toggleModal, refetch, loading, ticket } = props;

  let { createTicket, loading: createTicketLoading } = useCreateTicket()
  let { addCommentToTicket, loading: addCommentToTicketLoading } = useAddCommentToTicket()

  let [ticketSubject, setTicketSubject] = useState()
  let [ticketType, setTicketType] = useState()
  let [ticketIssue, setTicketIssue] = useState()
  const [ticketPriority, ] = useState('Normal') 

  const handleType = (e) => {
    switch (e.target.value) {
      case 'شکایت':
        setTicketType('Issue')
        break;

      case 'سوال':
        setTicketType('Task')
        break;

      case 'پیشنهاد':
        setTicketType('Report')
        break;
    
      default:
        break;
    }  
  }

  return (
    isOpen && (
      <Modal open={isOpen} handleToggle={toggleModal}>
        <DefaultLayout
          title={props.title ? props.title : "ثبت تیکت جدید"}
          btnText="ثبت"
          btnDisabled={false}
          hasBtn={true}
          onClose={props.toggleModal}
          onAction={() => {

          }}
          disabled={false}
        >
          <ModalAddTicketContainer>
            {
              !props.isComment &&
              <div className='ticketTypeDiv'>
                <select 
                  className='ticketType'
                  onChange={handleType}
                  >
                  <option>{undefined}</option>
                  <option>شکایت</option>
                  <option>سوال</option>
                  <option>پیشنهاد</option>
                </select>
              </div>
            }
            {
              !props.isComment && 
              <div className='cardTicketTitleDiv'>
                <input 
                    className='cardTicketTitle'
                    placeholder='لطفا عنوان تیکت را وارد نمایید ...'
                    onChange={(e) => setTicketSubject(e.target.value)}
                    >   
                </input>
              </div>
            }
            <div className='cardTicketMessageDiv'>
                <input
                    className='cardTicketMessage'
                    placeholder='لطفا پیام خود را وارد نمایید ...'
                    onChange={(e) => setTicketIssue(e.target.value)}
                >
                </input>
            </div>
            <div className='BtnDiv'>
              {
                !props.isComment &&
                <button 
                  className='Btn'
                  disabled={ createTicketLoading }
                  onClick={() => {
                    createTicket({
                      ticketSubject,
                      ticketType,
                      ticketIssue,
                      ticketPriority
                    })
                    .then(() => {
                      refetch()
                      toggleModal()
                    })
                  }}
                  >
                    ارسال
                </button>
              }
              {
                props.isComment &&
                <button 
                  className='Btn'
                  disabled={ addCommentToTicketLoading }
                  onClick={() => {
                    addCommentToTicket({
                      ticketId: ticket._id,
                      ticketComment: ticketIssue
                    })
                    .then(() => {
                      refetch()
                      toggleModal()
                    })
                  }}
                  >
                    ارسال
              </button>
              }
            </div>  

          </ModalAddTicketContainer>
        </DefaultLayout>
      </Modal>
    )
  );
}

export default ModalAddTicket;
