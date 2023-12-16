
import styles from './index.module.css'

export default function Header() {
    return <div>
        <h1 className={styles.header}>
            <div className={styles.logo}>DOTA</div>
            <div className={styles.menu}></div>
            <button className="bg-[#1da1f2] text-white ...">
                Share on Twitter
            </button>
        </h1>

    </div>
}
