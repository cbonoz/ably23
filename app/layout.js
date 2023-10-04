import './globals.css'
import { Inter } from 'next/font/google'
import StyledComponentsRegistry from './lib/registry'
import { Layout } from 'antd'
const { Header, Footer, Sider, Content } = Layout;

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* title */}
        <title>ExceptionAbly | Error reporting dashboard on Ably</title>
      </head>

      <body>
        <StyledComponentsRegistry>
            {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
