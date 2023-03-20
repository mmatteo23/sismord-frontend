import styled from "styled-components";
import Loader from "../Loader";

const Container = styled.button<{
  disabled?: boolean;
  transparent?: boolean;
  outline?: boolean;
}>`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${props => props.theme.colors.blue10};

  width: fit-content;
  border: none;
  height: 62px;
  padding: 20px 10px;
  background-color: ${props => props.theme.colors.pink0};
  border: 1px solid ${props => props.theme.colors.blue9};
  border-radius: 15px;

  box-sizing: border-box;
`;

const LoaderContainer = styled.div<{
  center: boolean;
}>`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const Content = styled.div<{
  fontColor: string;
  disabled: boolean;
}>`
  font-size: 16px;
  line-height: 22px;
  font-family: ${props => props.theme.fonts.charcuterie};
`;

type ButtonProps = {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  transparent?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
};

export default function Button({
  children,
  style,
  className,
  onClick,
  loading,
  disabled = false,
  transparent,
}: ButtonProps): JSX.Element {
  let fontColor = "#1C2847";
  if (disabled) fontColor = "#6771A9";

  return (
    <Container
      style={style}
      className={className}
      onClick={() => !loading && onClick && onClick()}
      disabled={disabled}
      transparent={transparent}
    >
      {loading && (
        <LoaderContainer center={true}>
          <Loader color={fontColor} size={13} />
        </LoaderContainer>
      )}
      <Content disabled={disabled} fontColor={fontColor}>
        {children}
      </Content>
    </Container>
  );
}
