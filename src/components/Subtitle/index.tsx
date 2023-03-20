import styled from "styled-components";

export const Subtitle = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: ${props => props.theme.colors.blue10};
  width: 654px;
  text-align: center;
  margin-bottom: 20px;

  @media (max-width: 800px) {
    font-size: 16px;
    margin-bottom: 40px;
    width: 100%;
  }
`;