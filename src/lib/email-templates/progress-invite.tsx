import React from 'react'
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
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  studentName?: string
  level?: string
  streak?: number
  todayMin?: number
  lessonsDone?: number
  dashboardUrl?: string
}

const ProgressInvite = ({
  studentName = 'Un alumno',
  level = 'A1',
  streak = 0,
  todayMin = 0,
  lessonsDone = 0,
  dashboardUrl = 'https://aprendoenglish.com/dashboard',
}: Props) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>{`${studentName} te invita a seguir su progreso en inglés`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {studentName} te invita a seguir su progreso
        </Heading>
        <Text style={p}>
          {studentName} está aprendiendo inglés en AprendoEnglish y quiere que
          lo acompañes. Podrás ver su avance y animarlo cuando se detenga.
        </Text>

        <Section style={statsBox}>
          <Text style={stat}>Nivel actual: <b>{level}</b></Text>
          <Text style={stat}>Racha: <b>{streak} {streak === 1 ? 'día' : 'días'}</b></Text>
          <Text style={stat}>Tiempo de hoy: <b>{todayMin} min</b></Text>
          <Text style={stat}>Lecciones completadas: <b>{lessonsDone}</b></Text>
        </Section>

        <Button style={button} href={dashboardUrl}>
          Ver el progreso
        </Button>

        <Text style={small}>
          Si aún no tienes cuenta, podrás crearla con este mismo correo al abrir
          el enlace. Solo verás el progreso de aprendizaje: nivel, racha, tiempo
          y lecciones. Nada más.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>AprendoEnglish · aprendoenglish.com</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ProgressInvite,
  subject: (data: Record<string, any>) =>
    `${data?.studentName || 'Un alumno'} te invita a seguir su progreso en inglés`,
  displayName: 'Invitación a seguir un progreso',
  previewData: {
    studentName: 'María',
    level: 'A1',
    streak: 3,
    todayMin: 15,
    lessonsDone: 4,
    dashboardUrl: 'https://aprendoenglish.com/dashboard',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', lineHeight: '1.3', color: '#111827', margin: '0 0 14px' }
const p = { fontSize: '15px', lineHeight: '1.6', color: '#374151', margin: '0 0 18px' }
const statsBox = {
  backgroundColor: '#F3FAFF',
  borderRadius: '14px',
  padding: '14px 18px',
  margin: '0 0 22px',
}
const stat = { fontSize: '15px', lineHeight: '1.6', color: '#0B3B57', margin: '2px 0' }
const button = {
  backgroundColor: '#1CB0F6',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  borderRadius: '14px',
  padding: '14px 26px',
  textDecoration: 'none',
  display: 'inline-block',
}
const small = { fontSize: '13px', lineHeight: '1.6', color: '#6B7280', margin: '22px 0 0' }
const hr = { borderColor: '#E6E4EA', margin: '24px 0 12px' }
const footer = { fontSize: '12px', color: '#9CA3AF', margin: '0' }
