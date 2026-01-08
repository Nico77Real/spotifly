import { useNavigate } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaUserCircle } from 'react-icons/fa'
import { useAuthStore } from '../store/authStore'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.navigation}>
        <button onClick={() => navigate(-1)} className={styles.navBtn}>
          <FaChevronLeft />
        </button>
        <button onClick={() => navigate(1)} className={styles.navBtn}>
          <FaChevronRight />
        </button>
      </div>

      <div className={styles.userMenu}>
        <button onClick={() => navigate('/profile')} className={styles.profileBtn}>
          <FaUserCircle />
          <span>{user?.username}</span>
        </button>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  )
}
