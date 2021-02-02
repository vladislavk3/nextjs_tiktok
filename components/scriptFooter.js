import { useSession } from 'next-auth/client'

export default function ScriptFooter() {

    const [session, loading] = useSession()
    if (!session?.user_id) { return <div></div> }
    return (
        <script dangerouslySetInnerHTML={{ __html: `gtag('set', {'user_id': ${session?.user_id}});` }} />
    )
}