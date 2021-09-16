import React from "react";
import { createPortal } from "react-dom";

try {
  var modalRoot = document.getElementById("modal");
} catch {
  modalRoot = {};
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return this.props.open && createPortal(this.props.children, this.el);
  }
}

export default Modal;
