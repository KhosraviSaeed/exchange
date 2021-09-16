import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { breakpoint, space } from "../../helpers/theme-helper";

let ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  z-index: 1398;
`;

let ModalGlobalStyles = createGlobalStyle`
  body{
    overflow: hidden;
  }
`;

let ModalContainer = styled.div`
  position: fixed;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.06);
  background: #151515;
  border-radius: ${(props) => props.theme.radii.m}px;
  width: 95%;
  width: calc(100%-40px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 1000px;
  max-height: 100%;
  overflow: auto;
  z-index: 2020;

  @media screen and (max-width: ${breakpoint("tablet")}) {
    top: unset;
    bottom: 0;
    transform: translate(-50%, 0);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    max-height: 95vh;
    overflow: auto;
  }
`;

let ModalBody = styled.div`
  padding: ${space(6)}px;

  @media screen and (max-width: ${breakpoint("tablet")}) {
    padding: ${space(4)}px;
  }
`;

let ModalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

let DLTitleContainer = styled(ModalTitle)`
  margin-bottom: ${({ theme }) => theme.space[6]}px;

  .title {
    display: flex;
    align-items: center;

    .titleText {
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 18px;
      color: #FFF69D;
    }

    & img {
      display: inline-block;
    }

    & .Button {
      margin-left: ${({ theme }) => theme.space[4]}px;
    }
  }

  .actions {
    display: flex;
    align-items: center;

    .closeBtn {
      border: none;
      background: transparent;
    }

    & > * {
      margin-left: ${({ theme }) => theme.space[4]}px;
      &:last-child {
        margin-left: 0;
      }
    }
  }
`;

export {
  ModalOverlay,
  ModalGlobalStyles,
  ModalContainer,
  ModalBody,
  ModalTitle,
  DLTitleContainer,
};
