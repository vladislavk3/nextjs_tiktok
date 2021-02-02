import { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Loader from 'components/loader'
import UserHistoryOverview from 'components/insights/user_history_overview'
import WeeklySummary from 'components/insights/weekly_summary'
import Instructions from 'components/insights/instructions'
import InsightsErrorHandler from 'components/insights/insights_error_handler'
import {insightsAuthentication} from 'helpers/auth'
import {pg} from 'helpers/db'

export default function User({ name, authenticated }) {
  if(!authenticated.valid) return <InsightsErrorHandler error={authenticated} />

  const [insights, setInsights] = useState({});

  async function getInsights() {
    const insights_history = await fetch('/api/tiktok_user/' + name + '/insights_history').then(r => r.json());
    if (insights_history.length == 0 || insights_history.error) {
      setInsights({ loaded: true, cookie_missing: true })
      return;
    }
    const videos = await fetch('/api/tiktok_user/' + name + '/video_history').then(r => r.json())
    const followers = await fetch('/api/tiktok_user/' + name + '/follower_info?created_at=' +
      Math.round((Date.now() - 604800000) / 1000)).then(r => r.json())
    const info = {
      loaded: true,
      history: insights_history,
      videos,
      followers
    }
    setInsights(info);
  }

  useEffect(() => {
    getInsights();
  }, [name])

  return (<React.Fragment>
    <Container justify="center" maxWidth="lg">
      {!insights.loaded && <Loader />}
      <UserHistoryOverview name={name} history={insights.history}
        author_stats={insights.videos?.author} />
      <WeeklySummary name={name} history={insights.history} videos={insights.videos}
        followers={insights.followers} />
    </Container>
  </React.Fragment>
  )
}

export async function getServerSideProps(context) {
  return await insightsAuthentication(pg, context)
}
