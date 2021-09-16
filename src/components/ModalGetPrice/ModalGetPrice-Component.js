import React, { useState } from "react";
import { numbersFormatter, priceFormatter } from "../../helpers/general-helper"
import Modal, { DefaultLayout } from "../Modal";

import ModalGetPriceContainer from "./ModalGetPrice-Styles";

function ModalGetPrice(props) {
  
  let { isOpen, toggleModal, refetch, loading, onAction, lastPrice, txType, curName, quantity } = props;


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
          <ModalGetPriceContainer>
            <p className='message'>
              {
                txType === 'buy' &&
                `قیمت جاری یک واحد
                ${curName}
                در حال حاضر مبلغ
                ${priceFormatter(Math.ceil(lastPrice))}
                ریال می باشد. مبلغ حدودی مورد نیاز برای خرید 
                ${numbersFormatter(quantity)}
                ${curName}
                معادل
                ${priceFormatter(Math.ceil(Number(quantity) * Number(lastPrice)))}
                ریال می باشد. آیا از خرید خود اطمینان دارید؟`
              }
              {
                txType === 'sell' &&
                `قیمت جاری یک واحد
                ${curName}
                در حال حاضر مبلغ
                ${priceFormatter(Math.ceil(lastPrice))}
                ریال می باشد. مبلغ حدودی فروش 
                ${numbersFormatter(quantity)}
                ${curName}
                معادل
                ${priceFormatter(Math.ceil(Number(quantity) * Number(lastPrice)))}
                ریال می باشد. آیا از فروش خود اطمینان دارید؟`
              }
            </p>
            <p className='message'>
              توجه مهم: این رقم تقریبی است و امکان دارد مبلغ معامله کمی متفاوت باشد.
            </p>
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

          </ModalGetPriceContainer>
        </DefaultLayout>
      </Modal>
    )
  );
}

export default ModalGetPrice;
