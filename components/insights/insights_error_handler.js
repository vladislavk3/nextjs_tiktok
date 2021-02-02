import Instructions from 'components/insights/instructions'
import Error from 'components/error'

export default function InsightsErrorHandler ({error}) {
    if(error.reason == 'pro')  return <Error notPro />
    if(error.reason == 'no_cookies')  return <Instructions/>

    const message = "You don't have access to that user. Are you logged in to the correct account?"
    if(error.reason == 'not_logged_in')  return <Error message={message}/>
    if(error.reason == 'wrong_user')  return <Error message={message}/>
}