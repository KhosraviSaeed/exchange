import { createGlobalStyle } from "styled-components";
import { space, color } from "../../helpers/theme-helper"

export default createGlobalStyle`
  html, body{
    padding: 0;
    margin: 0;
  }
  *, *:after, *:before{

    box-sizing: inherit;
  }
  body{
    box-sizing: border-box;
    direction: rtl;
    line-height: 1.6;
    margin-top: ${space(10)}px;
    margin-bottom: ${space(10)}px;
    margin-right: ${space(6)}px;
    margin-left: ${space(6)}px;
    background-color: ${color('background.main')};
    border: 4px solid #FFF69D;
    border-radius: ${({ theme }) => theme.radii.xxl}px;

  }

  a{
    text-decoration: none;
    color: #000;

    &:hover{
      color: #666;
    }
  }

  .container{

    //max-width: ${({ theme }) => theme.containerWidth}px;
    max-widt: 100%;
    margin: auto;
  }

  @media screen and (max-width: ${({ theme }) => theme.containerWidth}px){

    .container{

      padding-right: ${space(4)}px;
      padding-left: ${space(4)}px;
    }
  }






  .rc-tooltip {
    position: absolute;
    z-index: 1070;
    display: block;
    visibility: visible;
    line-height: 1.5;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 1px;
    opacity: 0.9;
  }
  .rc-tooltip-hidden {
    display: none;
  }
  .rc-tooltip-inner {}
  .rc-tooltip-arrow,
  .rc-tooltip-arrow-inner {
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
  }
  .rc-tooltip-placement-top .rc-tooltip-arrow,
  .rc-tooltip-placement-topLeft .rc-tooltip-arrow,
  .rc-tooltip-placement-topRight .rc-tooltip-arrow {
    bottom: -5px;
    margin-left: -6px;
    border-width: 6px 6px 0;
    border-top-color: #000;
  }
  .rc-tooltip-placement-top .rc-tooltip-arrow-inner,
  .rc-tooltip-placement-topLeft .rc-tooltip-arrow-inner,
  .rc-tooltip-placement-topRight .rc-tooltip-arrow-inner {
    bottom: 1px;
    margin-left: -6px;
    border-width: 6px 6px 0;
    border-top-color: #ffffff;
  }
  .rc-tooltip-placement-top .rc-tooltip-arrow {
    left: 50%;
  }
  .rc-tooltip-placement-topLeft .rc-tooltip-arrow {
    left: 15%;
  }
  .rc-tooltip-placement-topRight .rc-tooltip-arrow {
    right: 15%;
  }
  .rc-tooltip-placement-right .rc-tooltip-arrow,
  .rc-tooltip-placement-rightTop .rc-tooltip-arrow,
  .rc-tooltip-placement-rightBottom .rc-tooltip-arrow {
    left: -5px;
    margin-top: -6px;
    border-width: 6px 6px 6px 0;
    border-right-color: #b1b1b1;
  }
  .rc-tooltip-placement-right .rc-tooltip-arrow-inner,
  .rc-tooltip-placement-rightTop .rc-tooltip-arrow-inner,
  .rc-tooltip-placement-rightBottom .rc-tooltip-arrow-inner {
    left: 1px;
    margin-top: -6px;
    border-width: 6px 6px 6px 0;
    border-right-color: #ffffff;
  }
  .rc-tooltip-placement-right .rc-tooltip-arrow {
    top: 50%;
  }
  .rc-tooltip-placement-rightTop .rc-tooltip-arrow {
    top: 15%;
    margin-top: 0;
  }
  .rc-tooltip-placement-rightBottom .rc-tooltip-arrow {
    bottom: 15%;
  }
  .rc-tooltip-placement-left .rc-tooltip-arrow,
  .rc-tooltip-placement-leftTop .rc-tooltip-arrow,
  .rc-tooltip-placement-leftBottom .rc-tooltip-arrow {
    right: -5px;
    margin-top: -6px;
    border-width: 6px 0 6px 6px;
    border-left-color: #b1b1b1;
  }
  .rc-tooltip-placement-left .rc-tooltip-arrow-inner,
  .rc-tooltip-placement-leftTop .rc-tooltip-arrow-inner,
  .rc-tooltip-placement-leftBottom .rc-tooltip-arrow-inner {
    right: 1px;
    margin-top: -6px;
    border-width: 6px 0 6px 6px;
    border-left-color: #ffffff;
  }
  .rc-tooltip-placement-left .rc-tooltip-arrow {
    top: 50%;
  }
  .rc-tooltip-placement-leftTop .rc-tooltip-arrow {
    top: 15%;
    margin-top: 0;
  }
  .rc-tooltip-placement-leftBottom .rc-tooltip-arrow {
    bottom: 15%;
  }
  .rc-tooltip-placement-bottom .rc-tooltip-arrow,
  .rc-tooltip-placement-bottomLeft .rc-tooltip-arrow,
  .rc-tooltip-placement-bottomRight .rc-tooltip-arrow {
    top: -5px;
    margin-left: -6px;
    border-width: 0 6px 6px;
    border-bottom-color: #b1b1b1;
  }
  .rc-tooltip-placement-bottom .rc-tooltip-arrow-inner,
  .rc-tooltip-placement-bottomLeft .rc-tooltip-arrow-inner,
  .rc-tooltip-placement-bottomRight .rc-tooltip-arrow-inner {
    top: 1px;
    margin-left: -6px;
    border-width: 0 6px 6px;
    border-bottom-color: #ffffff;
  }
  .rc-tooltip-placement-bottom .rc-tooltip-arrow {
    left: 50%;
  }
  .rc-tooltip-placement-bottomLeft .rc-tooltip-arrow {
    left: 15%;
  }
  .rc-tooltip-placement-bottomRight .rc-tooltip-arrow {
    right: 15%;
  }

  /* COLORS */
  .primary.rc-tooltip-placement-top .rc-tooltip-arrow,
  .primary.rc-tooltip-placement-topLeft .rc-tooltip-arrow,
  .primary.rc-tooltip-placement-topRight .rc-tooltip-arrow{
    border-top-color: #4a41b8;
  }
`;
