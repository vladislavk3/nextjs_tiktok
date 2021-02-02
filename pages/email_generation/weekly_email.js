import React from 'react'
import { Box, Email, Image, Item, Span, A } from 'react-html-email'

const css = `
a {
  text-decoration: none;
  color: #10474a;
}
table {
  font-size: 17px;
  color: #000;
  line-height: 1.5em;
}
h1 {
  line-height: 1.6em;
}
`.trim()

export default function WeeklyEmail() {
  return <Email title="Stats Check Lol Weekly Summary!" headCSS={css} style={{ width: '100%', maxWidth: '600px' }}>
    <Item>
    <Box>
      <Item align="center">
        <Box align="center">
          <Item align="center">
            <A href="https://www.statschecklol.com" target="_blank" style={{ textDecoration: 'none' }}>
              <Image src="https://www.statschecklol.com/img/new_logo.jpg" width={450} height={100} alt="Stats Check Lol" border="0" style={{ borderRadius: '10px' }} /></A>
          </Item>
        </Box>
      </Item>
      <Item align="center">
        <Box>
          <Item>
            <h1>{'{{'}tiktok_username{'}}'}'s Week in Review</h1>
          </Item>
        </Box>
      </Item>

      <Glances />

      {['Likes', 'Shares', 'Comments', 'Views'].map(listType =>
        <React.Fragment key={listType}><Spacer key={listType + 's'} /><BestList listType={listType} key={listType + 'b'} /></React.Fragment>)}
        <Spacer />
      <Item align="center">
        &copy; Stats Check Lol 2020 &nbsp;|&nbsp;&nbsp;
        <a href="https://www.statschecklol.com/authenticated/profile" target="_blank">Unsubscribe</a>
      </Item>
      <Item align="center" style={{ fontSize: '0.8em', color: '#222' }}>
        TikTok™ is a registered trademark of ByteDance™. The data Stats Check Lol provides is not authorized or verified by TikTok™. We are not an official partner of TikTok™.
      </Item>
    </Box>
    </Item>
  </Email>
}

function Spacer() {
  return <Item style={{ height: '10px' }}></Item>
}

function Glances() {
  return <BorderedBox children={<Item><ul style={{paddingLeft: '20px'}}>
    {[['followers', <span>You gained <strong>{'{{new_followers}}'}</strong> new followers.</span>],
    ['videos', <span>Your videos had <strong>{'{{total_views}}'}</strong> total views.</span>],
    ['trending', <span>Your most-viewed video in the last week was <a href="https://www.tiktok.com/{{tiktok_username}}/video/{{most_popular_video_id}}">{'{{'}most_popular_video_caption{'}}'}</a>. It had <strong>{'{{'}most_popular_video_views{'}}'}</strong> total views. (Keep in mind that many of your views may come from videos created more than one week ago.)</span>],
    ['trending', <span>The video we think got you the most followers in the last week was
  {' {{#if not_pro}}'}
      [unknown, insights extension not installed].
  {'{{else}}'}
      <a href="https://www.tiktok.com/{{tiktok_username}}/video/{{most_followers_video_id}}">{'{{most_followers_video_caption}}'}</a>.
      We estimate that you received <strong>{'{{most_followers_video_followers}}'}</strong> new followers from it.
      See <a href="https://www.statschecklol.com/user/{{tiktok_username}}/follower_sourcing">follower sourcing</a> for more.
  {'{{/if}}'}</span>],
    ].map((v) =>
      <GlanceElement icon={v[0]} text={v[1]} key={v[0]}/>)}
  </ul></Item>}
    header='At a Glance' />
}

function GlanceElement({ icon, text }) {
  return <li>{text}</li>

}

function BorderedBox({ header, children }) {
  return <Item align="center" style={{ border: '1px solid #dcdcdc', borderRadius: '8px', padding: '5px' }}>
    <Box align="center">
      <Item align="center"><h2>{header}</h2></Item>
    </Box>
    <Box>
      {children}
    </Box>
    <Box><Spacer /></Box>
    <Box align="center">
      <tr>
        <td style={{ backgroundColor: 'rgb(0, 166,156)', borderRadius: '8px', fontSize: '13px', height: '34px', paddingLeft: '5px', paddingRight: '5px' }}>
          <a href="https://www.statschecklol.com/user/{{tiktok_username}}" target="_blank" style={{ textDecoration: "none", color: "#ffffff", lineHeight: "34px", display: "block" }}>SEE MORE DETAILS</a>
        </td>
      </tr>
    </Box>
  </Item>
}

function BestList({ listType }) {
  return <BorderedBox
    header={'Most ' + pastTense(listType)}
    children={<>
      <tr><th></th><th>{(listType)}</th></tr>
      {'{{#each most' + listType + '}}'}
      <tr>
        <td align="left" valign="top" style={{ borderTop: "solid 1px #bbb" }}>
          <a href="https://www.tiktok.com/{{tiktok_username}}/video/{{this.video_id}}">{'{{#if this.description}}{{this.description}}{{else}}(no caption){{/if}}'}</a>
        </td>
        <td height="10" style={{ paddingLeft: '5px', borderTop: 'solid 1px #bbb' }}>
          {'{{this.' + listType.toLowerCase() + '}}'}
        </td>
      </tr>
      {'{{/each}}'}
    </>
    } />
}

function pastTense(v) {
  var n = v.slice(0, v.length - 1);
  if (n[n.length - 1] == 'e') return n + 'd';
  return n + 'ed'
}