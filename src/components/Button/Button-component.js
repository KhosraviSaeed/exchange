import React from "react";
import styled from "styled-components";
import { space, color, typography, variant, width } from "styled-system";
import themeConfig from "../../configs/theme-config";

const types = variant({
  prop: "type",
  variants: {
    rounded: {
      borderRadius: "s",
    },
  },
});

const sizes = variant({
  prop: "size",
  variants: {
    s: {
      py: 2,
      px: 2,
    },
    m: {
      py: 3,
      px: 4,
    },
    l: {
      py: 5,
      px: 4,
    },
  },
});

const bg = variant({
  prop: "bg",
  variants: {
    primary: {
      backgroundColor: "primary.main",
      color: "common.white",
      "&:hover": {
        backgroundColor: "primary.light",
      },
    },
    primaryGradient: {
      backgroundColor: "primary.gradient",
      backgroundImage: themeConfig.colors.primary.gradient,
      color: "common.white",
      "&:hover": {
        backgroundColor: "primary.light",
      },
    },
    errorGradient: {
      backgroundImage: themeConfig.colors.error.gradient,
      color: "common.white",
    },
    successGradient: {
      backgroundImage: themeConfig.colors.success.gradient,
      color: "common.white",
    },
    disabled: {
      backgroundColor: "action.disabledBackground",
      color: "action.disabled",
    },
    white: {
      backgroundImage: themeConfig.colors.common.white,
      color: "primary.main",
    },
  },
});

const BaseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.action.disabledBackground};
  transition: all 0.35s;
  ${(props) => (props.fullwidth ? "width: 100%;" : "")}

  ${types}
  ${space}
  ${color}
  ${typography}
  ${width}
  ${sizes}
  ${bg}


  & img {
    display: inline-block;
  }

  & .left {
    margin-right: ${(props) => props.theme.space[4]}px;
  }
`;

BaseButton.defaultProps = {
  color: "common.black",
  fontSize: "m",
  size: "m",
};

function Button(props) {
  let { disabled, isLoading, onDisabled, ...restProps } = props;
  const passedProps = { ...restProps };
  if (disabled) {
    passedProps.bg = "disabled";
    passedProps.onClick = onDisabled ? onDisabled : () => {};
  }

  return <BaseButton {...passedProps} />;
}
export default Button;
