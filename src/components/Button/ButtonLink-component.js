import React from "react";
import { ButtonLinkContainer } from "./Button-styles";
import { Link } from "@reach/router";

function ButtonLink(props) {
  let { href, isActive, ...spaceProps } = props;
  return (
    <Link to={href}>
      <ButtonLinkContainer {...{ isActive, ...spaceProps }}>
        {props.children}
      </ButtonLinkContainer>
    </Link>
  );
}

export default ButtonLink;
