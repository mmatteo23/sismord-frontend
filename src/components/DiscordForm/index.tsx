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
  onSubmitDiscordId: (discordId: string) => Promise<AxiosResponse>;
  subscriptionStatus: "not-subscribed" | "already-subscribed";
};

export default function DiscordForm({
  onSubmitDiscordId,
  subscriptionStatus,
}: Props): JSX.Element {
  const [enteredDiscordId, setEnteredDiscordId] = useState("");
  const [discordIdError, setDiscordIdError] = useState("");
  const [status, setStatus] = useState<
    | "not-subscribed"
    | "success"
    | "already-subscribed"
    | "update"
    | "update-success"
  >(subscriptionStatus);
  const [loading, setLoading] = useState(false);

  function onDiscordIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (discordIdError) setDiscordIdError("");
    const discordId = event.target.value;
    setEnteredDiscordId(discordId);
  }

  async function validateDiscordId(id: string) {
    // const re = /\S+@\S+\.\S+/;
    // if (!re.test(email)) {
    //   setEmailError("Invalid email address");
    //   return false;
    // }
    return true;
  }

  async function submitDiscordId() {
    console.log("Entered discord id: ", enteredDiscordId);
    const isDiscordIdValid = await validateDiscordId(enteredDiscordId);
    if (!enteredDiscordId || !isDiscordIdValid) return;

    try {
      setLoading(true);
      const res = await onSubmitDiscordId(enteredDiscordId);
      console.log("res: ", res.data.status);
      console.log("status: ", status);
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
      setDiscordIdError("Something went wrong, please try again later");
    }
  }

  return (
    <Container>
      {status === "not-subscribed" && (
        <>
          <EligibleTitle>you are eligible</EligibleTitle>
          <Subtitle>for privilege access to exclusive Discord channels</Subtitle>
          <EligibleText>
            Enter your Discord id to access to the them.
          </EligibleText>
          <Input
            style={{ marginBottom: 20 }}
            label="Discord Id"
            value={enteredDiscordId}
            onChange={onDiscordIdChange}
            error={discordIdError}
            placeholder={"Enter your Discord id"}
          />
          <CallToAction>
            <StyledButton
              loading={loading}
              onClick={() => {
                submitDiscordId();
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
            {enteredDiscordId} has been registered to the Contributors to The Merge
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
            update discord id
          </StyledButton>
        </>
      )}
      {status === "update" && (
        <>
          <UpdateTitle>update discord id</UpdateTitle>
          <UpdateText>
            Enter a new Discord id to receive exclusive access to reserved tickets
            for the web3 events.
          </UpdateText>
          <Input
            style={{ marginBottom: 20 }}
            label="Discord Id"
            value={enteredDiscordId}
            onChange={onDiscordIdChange}
            error={discordIdError}
            placeholder={"Enter your Discord id"}
          />
          <CallToAction>
            <StyledButton
              loading={loading}
              onClick={() => {
                submitDiscordId();
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
            updated your Discord id
            <br />
            address
          </Title>
        </>
      )}
    </Container>
  );
}
