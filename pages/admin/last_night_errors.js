import Error from 'components/error'
import { getSession } from 'next-auth/client'
import BenTable from 'components/benTable'
import { useState, useEffect } from "react";

function Admin({ error, ad }) {
    if (error) { return <Error message="You are not authorized to see this page." /> }
    const [tagInfo, setTagInfo] = useState();
    useEffect(() => {
      async function populate() {
          // first try the cache
          const res = await fetch('/api/admin/last_night_errors').then(r => r.json())
          setTagInfo(res)
      }
      populate();
    }, [])

    return (
        <>
        <BenTable data={tagInfo} keyField="email" />
        </>
    )
}

export async function getServerSideProps({ req }) {
    const session = await getSession({ req })
    if (!session?.admin) { return { props: { error: true } } }
    return { props: {  } }
}

export default Admin;