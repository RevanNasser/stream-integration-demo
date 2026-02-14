import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TRPCProvider } from '../trpc/provider'

import Header from '../components/Header'
import Footer from '../components/Footer'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Payment Gateway - Secure Payment Experience',
      },
    ],
    links:[
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-950">
        <TRPCProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </TRPCProvider>
  
        <Scripts />
      </body>
    </html>
  )
}
