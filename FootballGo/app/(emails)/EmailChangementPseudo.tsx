import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  
  interface EmailChangementPseudo {
    pseudo: string;   
    name: string; 
  }
  
  const EmailChangementPseudo: React.FC<EmailChangementPseudo> = ({
      name ,
     pseudo
  }) => {
    return (
      <Html>
        <Head />
        <Body>
          <Container>
            <Section>
              <Text>Bonjour {name},</Text>
              <Text>Vous venez de changer votre pseudo de : {pseudo} a {name}</Text>
              <Text>Si ce changement de pseudo ne vient pas de vous sécurisez votre compte le plus vite possible</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export default EmailChangementPseudo;
  