import React from "react";

import Typography from "../Typography";
import Button from "../Button";
import { DLTitleContainer } from "./Modal-styles";
import { ModalBody } from ".";

function DefaultLayoutModal(props) {
  return (
    <>
      <ModalBody>
        <DLTitleContainer>
          <div className="title">
            {props.onPrevious && (
              <Button
                size="s"
                bg="primary"
                type="rounded"
                onClick={props.onPrevious}
                className="Button"
              >
                <img src="/svgs/arrow-right.svg" alt="back" width={16} />
              </Button>
            )}

            <div className='titleText'>
              {props.title}
            </div>
          </div>
          <div className="actions">
            <button className='closeBtn' onClick={props.onClose}>
              <img src="/svgs/cross.svg" alt="close" width={16} />
            </button>
          </div>
        </DLTitleContainer>
        {props.children}
      </ModalBody>
      {props.btnText && !props.hasBtn &&(
        <button
          disabled={props.btnDisabled}
          onClick={props.onAction}
        >
          {props.btnText}
        </button>
      )}
    </>
  );
}

DefaultLayoutModal.defaultProps = {
  btnDisabled: false,
  btnText: "مرحله بعدی",
  btnColor: "primaryGradient",
};

export default DefaultLayoutModal;
