import Image from 'next/image'
import styles from './page.module.css'
import ErrorDashboard from './lib/ErrorDashboard'

export default function Home() {
  return (
    <div>
      <ErrorDashboard />
    </div>
  )
}
