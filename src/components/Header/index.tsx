'use client';

import Image from "next/image";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Tooltip} from "@nextui-org/react";

import NavLink from '../NavLink'
import styles from './index.module.css'

import marketIcon from '@/icons/building.svg'
import currencyIcon from '@/icons/currency.svg'
import starIcon from '@/icons/star.svg'
import menuIcon from '@/icons/menu.svg'
import {useConnectWallet} from "@/hooks/usePolkadot";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import arrowIcon from "@/icons/arrow-down.svg";
import {useEffect} from "react";

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
    // {
    //     name: 'EXPLORER',
    //     route: '/explorer',
    //     icon: compassIcon,
    //     disabled: true
    // },
    // {
    //     name: 'BALANCE',
    //     route: '/own',
    //     icon: walletIcon,
    //     disabled: true
    // }
]

function shotAddress(address: string) {
    return address.slice(0, 6) + '...' + address.slice(-6)
}

export default function Header() {

    const {
        allAccounts,
        selectedAccount,
        setSelectedAccount,
        connect
    } = useConnectWallet()


    const handleSelectAccount = (keys: any) => {
        const address = Array.from(keys)[0] as string
        const current = allAccounts.find((item) => item.address === address);
        setSelectedAccount(current as InjectedAccountWithMeta)
    }

    const handleConnect = async () => {
        const { isWeb3Injected } = await import(
            "@polkadot/extension-dapp"
            );

        if(isWeb3Injected) {
            await connect()
        } else {
            console.log('eee')
        }
    }

    useEffect(() => {
        handleConnect()
    }, []);


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
                {menus.map((item:any) => {
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
            <div className={styles.dropDownMenu}>
                <Dropdown>
                    <DropdownTrigger>
                        <Image
                            src={menuIcon}
                            width={24}
                            height={24}
                            alt="menu"
                            className={styles.menuIcon}
                        />
                    </DropdownTrigger>

                    <DropdownMenu aria-label="Static Accounts" variant="flat">
                        {menus.map((item: any) => {
                            return <DropdownItem key={item.route}>
                                <NavLink key={item.route} href={item.route} className={styles.menuItem}>
                                    {item.name}
                                </NavLink>
                            </DropdownItem>
                        })}
                    </DropdownMenu>
                </Dropdown>
            </div>
            {
                selectedAccount ?
                    <Dropdown>
                        <DropdownTrigger>
                            <Button className="btn bg-pink-500 hover:bg-sky-700 color-white">
                                <span>{selectedAccount.meta.name}  [ {shotAddress(selectedAccount.address)} ]</span>
                                {
                                    allAccounts.length > 1 && <Image
                                    src={arrowIcon}
                                    width={12}
                                    height={12}
                                    alt="arrow"
                                  />
                                }
                            </Button>
                        </DropdownTrigger>

                        <DropdownMenu aria-label="Static Accounts"
                              variant="flat"
                              selectionMode="single"
                              selectedKeys={selectedAccount.address}
                              onSelectionChange={handleSelectAccount}
                        >
                            {allAccounts.map((account) => (
                                <DropdownItem key={account.address} onClick={() => setSelectedAccount(account)}>
                                    {account.meta.name} [ {shotAddress(account.address)} ]
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                : <Button className="btn bg-pink-500 hover:bg-sky-700 color-white" onClick={handleConnect}>
                    Connect Wallet
                </Button>
            }

        </h1>

    </div>
}
