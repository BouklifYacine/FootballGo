import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  
  interface EmailProps {
    name?: string;
    plan?: string;
  }

  export const EmailNouvelAbonnement: React.FC<EmailProps> = ({
    name,
    plan
  }) => {
    return (
      <Html>
        <Head />
        <Body>
          <Container>
            <Section>
              <Text>Bonjour {name},</Text>
              <Text>Merci pour votre abonnement au plan {plan} !</Text>
              <Text>Votre abonnement est maintenant actif.</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export const EmailChangementAbonnement: React.FC<EmailProps & { oldPlan?: string }> = ({
    name,
    plan,
    oldPlan
  }) => {
    return (
      <Html>
        <Head />
        <Body>
          <Container>
            <Section>
              <Text>Bonjour {name},</Text>
              <Text>Votre changement de votre abonnement a été effectué avec succès.</Text>
              <Text>Vous êtes passé du plan {oldPlan} au plan {plan}.</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export const EmailSuppressionAbonnement: React.FC<EmailProps> = ({
    name,
    plan
  }) => {
    return (
      <Html>
        <Head />
        <Body>
          <Container>
            <Section>
              <Text>Bonjour {name},</Text>
              <Text>Nous confirmons la résiliation de votre abonnement {plan}.</Text>
              <Text>Vous pouvez nous recontacter si vous souhaitez vous réabonner.</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
