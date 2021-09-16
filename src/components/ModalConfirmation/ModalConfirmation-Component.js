import React, { useState } from "react";
import Modal, { DefaultLayout } from "../Modal";

import ModalConfirmationContainer from "./ModalConfirmation-Styles";



function ModalConfirmation(props) {
  let { isOpen, toggleModal, refetch, loading, onAction } = props;



  return (
    isOpen && (
      <Modal open={isOpen} handleToggle={toggleModal}>
        <DefaultLayout
          title={props.title ? props.title : ""}
          btnText="ثبت"
          btnDisabled={false}
          hasBtn={true}
          onClose={props.toggleModal}
          onAction={() => {

          }}
          disabled={false}
        >
          <ModalConfirmationContainer>
            <div className='message'>
              آیا از خرید اطمینان دارید؟
            </div>
            <div className='btnDiv'>
              <button 
                className='yesBtn'
                disabled={loading}
                onClick={() => {
                  onAction()
                }}
                >
                بله
              </button>
              <button 
                className='noBtn'
                onClick={() => toggleModal()}
                >
                خیر
              </button>
            </div>

          </ModalConfirmationContainer>
        </DefaultLayout>
      </Modal>
    )
  );
}

export default ModalConfirmation;
