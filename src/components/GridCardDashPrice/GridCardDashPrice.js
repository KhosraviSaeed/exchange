import styled from "styled-components";
import { breakpoint } from "../../helpers/theme-helper";

function gridStyleGenerator({ count } = { count: 3 }) {
  let width = 100 / count;
  let space = 6; // theme.space

  return function (props) {
    let theme_space = props.theme.space[space];
    let estimatedPadding = ((count - 1) * theme_space) / count;

    return `
      width: calc(${width}% - ${estimatedPadding}px); 
      margin-bottom: ${theme_space}px;
      margin-left: ${theme_space}px;
      &:nth-child(${count}n) {
        margin-left: 0;
      }
    `;
  };
}

let GridCardDashPriceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  & > div {
    ${gridStyleGenerator()}
  }

  @media screen and (max-width: ${breakpoint("tablet")}) {
    & > div {
      ${gridStyleGenerator({ count: 2 })}
    }
  }

  @media screen and (max-width: ${breakpoint("mobile")}) {
    & > div {
      ${gridStyleGenerator({ count: 1 })}
    }
  }
`;

export default GridCardDashPriceContainer;
