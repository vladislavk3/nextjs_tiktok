import { renderEmail } from 'react-html-email'
import WeeklyEmail from './weekly_email'

export default function RenderEmail() {
  return renderEmail(<WeeklyEmail />)
}