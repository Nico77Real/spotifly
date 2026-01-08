import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Player from './Player'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  const [sidebarWidth, setSidebarWidth] = useState(280)

  return (
    <div className={styles.layout}>
      <Sidebar width={sidebarWidth} />
      <div className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
      <Player />
    </div>
  )
}
