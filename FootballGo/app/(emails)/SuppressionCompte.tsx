import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface SuppressionCompte {
  pseudo: string;
}

const EmailSuppressionCompte: React.FC<SuppressionCompte> = ({ pseudo }) => {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>Bonjour {pseudo}</Text>
            <Text>Votre compte a été supprimer définitivement , ainsi que toute données liées a ce compte. </Text>
          
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailSuppressionCompte;
