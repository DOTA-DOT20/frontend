'use client';

import Image from "next/image";
import {Button} from '@nextui-org/button';
import NavLink from '../NavLink'
import styles from './index.module.css'

import marketIcon from '@/icons/building.svg'
import currencyIcon from '@/icons/currency.svg'
import starIcon from '@/icons/star.svg'
import compassIcon from '@/icons/compass.svg'
import walletIcon from '@/icons/wallet.svg'
import {connectWallet} from "@/hooks/usePolkadot";

const menus = [
    {
        name: 'MARKETPLACE',
        route: '/marketplace',
        icon: marketIcon
    },
    {
        name: 'TOKEN',
        route: '/token',
        icon: currencyIcon,
    },
    {
        name: 'INSCRIBE',
        route: '/inscribe',
        icon: starIcon,
    },
    {
        name: 'EXPLORER',
        route: '/explorer',
        icon: compassIcon,
    },
    {
        name: 'BALANCE',
        route: '/own',
        icon: walletIcon
    }
]

export default function Header() {

    const handleConnect = () => {
        connectWallet()
    }

    return <div>
        <h1 className={styles.header}>
            <div className={styles.logo}>
                <Image
                    src="/logo.svg"
                    alt="DOTA"
                    width={113}
                    height={40}
                    priority
                />
            </div>
            <div className={styles.menu}>
                {menus.map((item) => {
                    return (
                       <NavLink key={item.route} href={item.route} className={styles.menuItem}>
                           <Image
                              src={item.icon}
                              width={24}
                              height={24}
                              alt={item.name}
                              className={styles.menuIcon}
                           />
                           {item.name}
                       </NavLink>
                   )
                })}
            </div>
            <button className="btn bg-pink-500 hover:bg-sky-700" onClick={handleConnect}>
                Connect Wallet
            </button>
        </h1>

    </div>
}
