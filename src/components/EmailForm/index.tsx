import { useState } from "react";
import styled from "styled-components";
import { AxiosResponse } from "axios";
import { Paperclip } from "phosphor-react";
import Input from "../Input";
import Button from "../Button";
import { SismoZKProofLogo } from "../SismoReactIcon";
import colors from "../../theme/colors";
import { Title } from "../Title";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.theme.fonts.regular};
  @media (max-width: 800px) {
    padding: 0 16px;
  }
`;

const EligibleTitle = styled(Title)`
  margin-bottom: 0px;

  @media (max-width: 800px) {
    margin-bottom: 10px;
    width: 250px;
  }
`;

const CongratsTitle = styled(Title)`
  margin-bottom: 10px;

  @media (max-width: 800px) {
    font-size: 30px;
    line-height: 42px;
  }
`;

const AlreadyTitle = styled(Title)`
  margin-bottom: 70px;

  @media (max-width: 800px) {
    margin-bottom: 40px;
  }
`;

const UpdateTitle = styled(Title)`
  margin-bottom: 31px;

  @media (max-width: 800px) {
    margin-bottom: 20px;
  }
`;

const Subtitle = styled.div`
  font-family: ${props => props.theme.fonts.medium};
  font-size: 24px;
  line-height: 28px;
  color: ${props => props.theme.colors.white};
  text-align: center;
  margin-bottom: 30px;

  @media (max-width: 800px) {
    font-size: 18px;
    line-height: 21px;
  }
`;

const Text = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: ${props => props.theme.colors.blue10};
  text-align: center;

  @media (max-width: 800px) {
    width: 100%;
    font-size: 16px;
  }
`;

const EligibleText = styled(Text)`
  margin-bottom: 60px;
  width: 450px;

  @media (max-width: 800px) {
    margin-bottom: 40px;
    width: 100%;
  }
`;

const UpdateText = styled(Text)`
  margin-bottom: 60px;
  width: 500px;

  @media (max-width: 800px) {
    margin-bottom: 40px;
    width: 100%;
  }
`;

const CallToAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  width: 190px;

  @media (max-width: 800px) {
    width: 235px;
  }
`;

const StyledButton = styled(Button)`
  width: 190px;

  @media (max-width: 800px) {
    width: 235px;
  }
`;

const ZkProof = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px 5px 3px 12px;
  border-radius: 5px;
  gap: 5px;

  font-size: 14px;
  line-height: 16px;
  color: ${props => props.theme.colors.blue10};
  background: ${props => props.theme.colors.pink1};
  font-family: ${props => props.theme.fonts.medium};
`;

const PaperclipWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 2px;
  left: 5px;
  rotate: 90deg;
`;

type Props = {
  onSubmitEmail: (email: string) => Promise<AxiosResponse>;
  subscriptionStatus: "not-subscribed" | "already-subscribed";
};

export default function EmailForm({
  onSubmitEmail,
  subscriptionStatus,
}: Props): JSX.Element {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<
    | "not-subscribed"
    | "success"
    | "already-subscribed"
    | "update"
    | "update-success"
  >(subscriptionStatus);
  const [loading, setLoading] = useState(false);

  function onEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (emailError) setEmailError("");
    const email = event.target.value;
    setEnteredEmail(email);
  }

  async function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setEmailError("Invalid email address");
      return false;
    }
    return true;
  }

  async function submitEmail() {
    const isEmailValid = await validateEmail(enteredEmail);
    if (!enteredEmail || !isEmailValid) return;

    try {
      setLoading(true);
      const res = await onSubmitEmail(enteredEmail);
      if (status === "not-subscribed" && res.data.status === "success") {
        setStatus("success");
        setLoading(false);
      }
      if (status === "update" && res.data.status === "success") {
        setStatus("update-success");
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setEmailError("Something went wrong, please try again later");
    }
  }

  return (
    <Container>
      {status === "not-subscribed" && (
        <>
          <EligibleTitle>you are eligible</EligibleTitle>
          <Subtitle>for premium access to web3 events</Subtitle>
          <EligibleText>
            Enter an email to receive exclusive access to reserved tickets for
            upcoming web3 events.
          </EligibleText>
          <Input
            style={{ marginBottom: 20 }}
            label="Email Address"
            value={enteredEmail}
            onChange={onEmailChange}
            error={emailError}
            placeholder={"Enter your email address"}
          />
          <CallToAction>
            <StyledButton
              loading={loading}
              onClick={() => {
                submitEmail();
              }}
            >
              {loading ? "submitting..." : "submit"}
            </StyledButton>
            <ZkProof>
              <PaperclipWrapper>
                <Paperclip size={10} />
              </PaperclipWrapper>
              <SismoZKProofLogo size={16.66} color={colors.blue10} />
              <div>ZK Proof</div>
            </ZkProof>
          </CallToAction>{" "}
        </>
      )}
      {status === "success" && (
        <>
          <CongratsTitle>Congratulations</CongratsTitle>
          <Text>
            {enteredEmail} has been registered to the Contributors to The Merge
            mailing list.
          </Text>
        </>
      )}
      {status === "already-subscribed" && (
        <>
          <AlreadyTitle>
            You are already
            <br />
            subscribed
          </AlreadyTitle>
          <StyledButton
            loading={false}
            onClick={() => {
              setStatus("update");
            }}
          >
            update email
          </StyledButton>
        </>
      )}
      {status === "update" && (
        <>
          <UpdateTitle>update email</UpdateTitle>
          <UpdateText>
            Enter a new email to receive exclusive access to reserved tickets
            for the web3 events.
          </UpdateText>
          <Input
            style={{ marginBottom: 20 }}
            label="Email Address"
            value={enteredEmail}
            onChange={onEmailChange}
            error={emailError}
            placeholder={"Enter your email address"}
          />
          <CallToAction>
            <StyledButton
              loading={loading}
              onClick={() => {
                submitEmail();
              }}
            >
              {loading ? "submitting..." : "submit"}
            </StyledButton>
          </CallToAction>
        </>
      )}
      {status === "update-success" && (
        <>
          <Title>
            You have successfully
            <br />
            updated your email
            <br />
            address
          </Title>
        </>
      )}
    </Container>
  );
}
