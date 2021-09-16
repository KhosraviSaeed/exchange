import styled, { css } from "styled-components";
import { space } from "styled-system";

function isActiveButton(props) {
  if (props.isActive) {
    return css`
      background: ${props.theme.colors.common.white};
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    `;
  }
}
const ButtonLinkContainer = styled.a`
  display: flex;
  padding: ${({ theme }) => theme.space[2]}px;
  border-radius: ${({ theme }) => theme.radii.s}px;
  ${isActiveButton}
  ${space}

  & img {
    display: block;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.common.white};
    cursor: pointer;
  }
`;

export { ButtonLinkContainer };
