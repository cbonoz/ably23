import UiLayoutWrapper from './lib/ui-layout';

import './globals.css'


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* favicon */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="A real time error reporting dashboard on Ably" />
        <meta name="author" content="cbonoz" />
        <meta name="keywords" content="Ably, realtime, error, dashboard" />
        <link rel="favicon" href="/favicon.ico" sizes="any" />
        {/* title */}
        <title>AblyMonitor | Error reporting dashboard on Ably</title>
      </head>

      <body>
        <UiLayoutWrapper>
          {children}
        </UiLayoutWrapper>
      </body>
    </html>
  )
}
