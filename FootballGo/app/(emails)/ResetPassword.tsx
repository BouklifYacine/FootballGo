  import { Html, Head, Body, Container, Section, Text } from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  resetCode: string;
}

const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({ resetCode }) => {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>Bonjour,</Text>
            <Text>Voici votre code de vérification :</Text>
            <Text style={{ fontWeight: 'bold', fontSize: '24px' }}>{resetCode}</Text>
            <Text>Ce code expire dans 1 heure.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;