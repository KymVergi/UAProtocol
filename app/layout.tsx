import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'

export const metadata = { 
  title: 'UAP Protocol', 
  description: 'Unstable Alien Protocol' 
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}