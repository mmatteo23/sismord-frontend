import styled from "styled-components";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.fonts.regular};
  padding-bottom: 21px;
  width: 500px;
  color: white;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const Label = styled.div`
  font-family: ${props => props.theme.fonts.medium};
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 10px;
`;

const InputEl = styled.input<{ isError: boolean }>`
  padding: 10px;
  border: 1px solid
    ${props =>
      props.isError ? props.theme.colors.error : props.theme.colors.blue9};
  border-radius: 5px;
  background-color: ${props => props.theme.colors.pink0};
  font-family: ${props => props.theme.fonts.medium};
  font-size: 14px;
  line-height: 18px;
  color: ${props => props.theme.colors.blue11};

  :focus {
    outline: none;
  }
  ::placeholder {
    font-family: ${props => props.theme.fonts.regular};
    font-size: 14px;
    line-height: 20px;
    font-style: italic;
    color: #959aab;
  }
`;

const Error = styled.div`
  position: absolute;
  bottom: 0px;

  font-family: ${props => props.theme.fonts.regular};
  font-size: 14px;
  line-height: 16px;
  color: ${props => props.theme.colors.error};
`;

type Props = {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  label,
  placeholder,
  value,
  error,
  className,
  style,
  onChange,
}: Props): JSX.Element {
  return (
    <Container className={className} style={style}>
      <Label>{label}</Label>
      <InputEl
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isError={!!error}
        style={{ width: "100%" }}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
}
