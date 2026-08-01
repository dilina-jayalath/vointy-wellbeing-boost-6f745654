// deno-lint-ignore-file no-explicit-any
import { template as employeeInvitation } from './employee-invitation.tsx'
import { template as contactReply } from './contact-reply.tsx'

export interface TemplateEntry {
  component: (props: any) => any
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, any>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'employee-invitation': employeeInvitation,
  'contact-reply': contactReply,
}
