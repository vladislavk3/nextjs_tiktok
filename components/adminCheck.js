import {useSession, getSession } from 'next-auth/client'
import Error from 'components/error'
import React, { Component } from "react";

export default function adminCheck({ InnerComponent, pageProps }) {
    return class extends Component {
        state = {}
        static async getServerSideProps(ctx) {
            const [ session, loading ] = await getSession(ctx)
            state.session = session;
        }
        render() {
            if(session?.admin) {return <InnerComponent {...pageProps} />}
            return <Error message="Unauthorized" />
        }
    }
}