import '@/styles/globals.css'
import Theme from '@/theme/provider'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Theme>
        <Component {...pageProps} />
  </Theme>
}
