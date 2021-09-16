import React from "react";
import useOnclickOutside from "react-cool-onclickoutside";

import { BaseModal } from ".";
import {
  ModalOverlay,
  ModalGlobalStyles,
  ModalContainer,
} from "./Modal-styles";

function GeneralModal(props) {
  const modalRef = useOnclickOutside(() => {
    if (props.handleToggle) {
      props.handleToggle(false);
    }
  });

  return (
    <BaseModal open={props.open}>
      <ModalGlobalStyles />
      <ModalOverlay>
        <ModalContainer ref={modalRef}>{props.children}</ModalContainer>
      </ModalOverlay>
    </BaseModal>
  );
}
GeneralModal.defaultProps = {
  open: false,
};

export default GeneralModal;
