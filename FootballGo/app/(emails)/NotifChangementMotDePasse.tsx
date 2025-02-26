import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NotifChangementMotDePasse {
  pseudo: string;
}

const NotifChangementMotDePasse: React.FC<NotifChangementMotDePasse> = ({
  pseudo,
}) => {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>Bonjour {pseudo} </Text>
            <Text>
              Vous recevez ce mail car vous venez de changer de mot de passe{" "}
            </Text>
            <Text>
              Si ce changement de mot de passe ne vient pas de vous
              sécurisez votre compte le plus vite possible
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NotifChangementMotDePasse;
