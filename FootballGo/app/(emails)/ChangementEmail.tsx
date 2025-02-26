import { Html, Head, Body, Container, Section, Text } from '@react-email/components';
import * as React from 'react';

interface EmailChangementProps {
  email: string;      
  ancienemail: string; 
  pseudo: string;      
}

const EmailChangement: React.FC<EmailChangementProps> = ({ email, ancienemail, pseudo }) => {
  return (
      <Html>
          <Head />
          <Body>
              <Container>
                  <Section>
                      <Text>Bonjour {pseudo}</Text>
                      <Text>Vous venez de changer votre email</Text>
                      <Text>Votre email est passé de : {ancienemail} à {email}</Text>
                      <Text>Si ce changement de votre email ne vient pas de vous, sécurisez votre compte le plus vite possible.</Text>
                  </Section>
              </Container>
          </Body>
      </Html>
  );
};

export default EmailChangement;