import React from "react";
import Document, { Head, Main, NextScript, Html } from "next/document";
import { ServerStyleSheets } from "@material-ui/styles";
import Navigation from '../components/navigation.js'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="description" content="Enter your username for TikTok and get your stats."/>
        <meta name="author" content="@Benthamite"/>
        <meta property="og:url"                content="https://www.statschecklol.com"/>
        <meta property="og:title"              content="Stats Check lol" />
        <meta property="og:description"        content="Enter your username for TikTok and get your stats." />
        <meta property="og:type"               content="website" />
        <meta property="og:image"              content="https://www.statschecklol.com/img/favicon.ico" />

        <link rel="icon" type="image/png" href="/img/favicon.ico"/> 

        <script dangerouslySetInnerHTML={{__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NCTD2FH');`}}/>

        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-170114066-5"></script>
        <script dangerouslySetInnerHTML={{__html: `  window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-170114066-5');`}} />
          {/* Fonts and icons */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
          />
          <link
            href="https://use.fontawesome.com/releases/v5.0.7/css/all.css"
            rel="stylesheet"
          />
          <script src="https://cdn.plot.ly/plotly-1.2.0.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
          <script src="https://js.stripe.com/v3/"></script>
          <script  dangerouslySetInnerHTML={{__html: `
          (function() {
            var ta = document.createElement('script'); ta.type = 'text/javascript'; ta.async = true;
            ta.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=BUF600VGFRCQDCALU0F0';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ta, s);
          })();`}}/>
          {/*hubspot*/}
          <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/8754558.js"></script>
        <link rel="manifest" href="/script/manifest.json"/>
        </Head>
        <body>
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NCTD2FH"
          height="0" width="0" style={{display:"none", visibility: "hidden"}}></iframe></noscript>
          <div id="page-transition"></div>
          
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      <React.Fragment key="styles">
        {initialProps.styles}
        {sheets.getStyleElement()}
      </React.Fragment>,
    ],
  };
};

export default MyDocument;
