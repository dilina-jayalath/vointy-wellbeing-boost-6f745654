import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  replyBody?: string
  originalSubject?: string
  originalMessage?: string
}

const Email = ({ name, replyBody, originalSubject, originalMessage }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`Reply from Vointy${originalSubject ? `: ${originalSubject}` : ''}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>
          vointy<span style={brandAccent}>.life</span>
        </Text>
        <Heading style={heading}>
          {originalSubject ? `Re: ${originalSubject}` : 'Reply from Vointy'}
        </Heading>
        <Text style={text}>{name ? `Hi ${name},` : 'Hi there,'}</Text>
        <Text style={{ ...text, whiteSpace: 'pre-wrap' as const }}>{replyBody || ''}</Text>
        <Hr style={hr} />
        {originalMessage && (
          <>
            <Text style={quoteLabel}>Your original message</Text>
            <Text style={{ ...quote, whiteSpace: 'pre-wrap' as const }}>{originalMessage}</Text>
          </>
        )}
        <Text style={footer}>
          Vointy — Build healthier habits, together. Wellthyforce Oy, Vasantie 43, 90310 Oulu,
          Finland · contact@vointy.life
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Props) =>
    data?.originalSubject ? `Re: ${data.originalSubject}` : 'Reply from Vointy',
  displayName: 'Contact message reply',
  previewData: {
    name: 'Jane',
    replyBody: 'Thanks for reaching out! Here are the details you asked for.',
    originalSubject: 'Pricing question',
    originalMessage: 'Hi, how much does the employer panel cost?',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
}
const container = { padding: '32px 28px', maxWidth: '560px' }
const brand = { fontSize: '20px', fontWeight: 700, color: '#6E3BF5', margin: '0 0 24px' }
const brandAccent = { color: '#2BB3E0' }
const heading = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: 700,
  color: '#1B1236',
  margin: '0 0 16px',
}
const text = { fontSize: '16px', lineHeight: '1.6', color: '#3C3856' }
const quoteLabel = { fontSize: '12px', fontWeight: 600, color: '#8A87A0', margin: '0 0 6px' }
const quote = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#6B6880',
  borderLeft: '3px solid #E9E6F5',
  paddingLeft: '12px',
  margin: '0 0 24px',
}
const hr = { borderColor: '#E9E6F5', margin: '28px 0 16px' }
const footer = { fontSize: '12px', color: '#8A87A0' }
