import Button from "./dashboard/CustomButtons/Button"
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

export default function Footer() {
  return (
    <>
    <div style={{ textAlign: 'center' }}>
      <hr />
      Made with ♡ by <a href="https://www.tiktok.com/@benthamite">@benthamite</a> •{' '}
      <a href="https://github.com/xodarap">GitHub</a> •{' '}
      <Link href="/static/privacy" color="primary"> Privacy Policy</Link> •{' '}
      <Link href="/static/terms_of_service" color="primary">Terms of Service</Link>
      <br/>
      <Typography variant="body2" color="textSecondary">
        TikTok™ is a registered trademark of ByteDance™. The data Stats Check Lol provides is not authorized or verified by TikTok™. We are not an official partner of TikTok™.
      </Typography>
    </div>
    </>
  )
}