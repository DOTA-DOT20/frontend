'use client';

import Image from "next/image";
import {Button, Tooltip} from '@nextui-org/react';
import { web3Accounts, isWeb3Injected } from "@polkadot/extension-dapp";
import NavLink from '../NavLink'
import styles from './index.module.css'

import marketIcon from '@/icons/building.svg'
import currencyIcon from '@/icons/currency.svg'
import starIcon from '@/icons/star.svg'
import compassIcon from '@/icons/compass.svg'
import walletIcon from '@/icons/wallet.svg'
import {useConnectWallet} from "@/hooks/usePolkadot";
import {useEffect, useState} from "react";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import {useRecoilState} from "recoil";
import {accountState} from "@/stores/account";

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
        disabled: true
    },
    {
        name: 'BALANCE',
        route: '/own',
        icon: walletIcon,
        disabled: true
    }
]

function shotAddress(address: string) {
    return address.slice(0, 6) + '...' + address.slice(-6)
}

export default function Header() {

    const { selectedAccount, connect } = useConnectWallet()

    const handleConnect = async () => {
        if(isWeb3Injected) {
            await connect()
        } else {
            console.log('eee')
        }
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
                        item.disabled ? <Tooltip content="coming soon" key={item.route}>
                            <span className={styles.menuItem}>
                                <Image
                                    src={item.icon}
                                    width={24}
                                    height={24}
                                    alt={item.name}
                                    className={styles.menuIcon}
                                />
                            {item.name}
                        </span>
                        </Tooltip> : <NavLink key={item.route} href={item.route} className={styles.menuItem}>
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
            {
                selectedAccount ? <Button className="btn bg-pink-500 hover:bg-sky-700 color-white">
                    <span>{selectedAccount.meta.name}</span>
                </Button> : <Button className="btn bg-pink-500 hover:bg-sky-700 color-white" onClick={handleConnect}>
                    Connect Wallet
                </Button>
            }

        </h1>

    </div>
}
