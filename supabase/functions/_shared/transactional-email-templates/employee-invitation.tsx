import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  organizationName?: string
  joinUrl?: string
}

const Email = ({ name, organizationName, joinUrl }: Props) => {
  const org = organizationName || 'your company'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`${org} invited you to join Vointy`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>
            vointy<span style={brandAccent}>.life</span>
          </Text>
          <Heading style={heading}>{`${org} invited you to Vointy`}</Heading>
          <Text style={text}>
            {name ? `Hi ${name},` : 'Hi there,'}
          </Text>
          <Text style={text}>
            Vointy helps your team stay active, motivated and energized with simple
            daily challenges and activities. Accept your invitation to create your
            account and join {org}.
          </Text>
          {joinUrl && (
            <Section style={buttonWrap}>
              <Button href={joinUrl} style={button}>
                Join {org}
              </Button>
            </Section>
          )}
          {joinUrl && (
            <Text style={smallText}>
              Or copy this link into your browser: {joinUrl}
            </Text>
          )}
          <Hr style={hr} />
          <Text style={footer}>
            You received this email because your employer invited you to Vointy.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (data: Props) =>
    `${data?.organizationName || 'Your company'} invited you to Vointy`,
  displayName: 'Employee invitation',
  previewData: {
    name: 'Jane',
    organizationName: 'Acme Oy',
    joinUrl: 'https://vointy.life/join?token=example',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
}
const container = { padding: '32px 28px', maxWidth: '560px' }
const brand = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#6E3BF5',
  margin: '0 0 24px',
}
const brandAccent = { color: '#2BB3E0' }
const heading = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: 700,
  color: '#1B1236',
  margin: '0 0 16px',
}
const text = { fontSize: '16px', lineHeight: '1.6', color: '#3C3856' }
const smallText = { fontSize: '13px', lineHeight: '1.6', color: '#6B6880' }
const buttonWrap = { margin: '28px 0' }
const button = {
  backgroundColor: '#6E3BF5',
  color: '#ffffff',
  borderRadius: '10px',
  padding: '14px 26px',
  fontSize: '16px',
  fontWeight: 600,
  textDecoration: 'none',
}
const hr = { borderColor: '#E9E6F5', margin: '28px 0 16px' }
const footer = { fontSize: '12px', color: '#8A87A0' }
