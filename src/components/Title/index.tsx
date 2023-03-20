import styled from "styled-components";

export const Title = styled.div`
  font-family: ${props => props.theme.fonts.charcuterie};
  font-size: 50px;
  line-height: 60px;
  width: 654px;
  text-align: center;
  margin-bottom: 20px;
  color: white;

  @media (max-width: 800px) {
    font-size: 40px;
    line-height: 48px;
    width: 100%;
  }
`;