"use client";

import Image from "next/image";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

import NavLink from "../NavLink";
import styles from "./index.module.css";

import marketIcon from "@/icons/building.svg";
import currencyIcon from "@/icons/currency.svg";
import starIcon from "@/icons/star.svg";
import compassIcon from "@/icons/compass.svg";
import bridgeIcon from "@/icons/bridge.svg";

import { useConnectWallet } from "@/hooks/usePolkadot";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import arrowIcon from "@/icons/arrow-down.svg";
import { useEffect, useState } from "react";

const menus = [
  {
    name: "MARKETPLACE",
    route: "/marketplace/",
    icon: marketIcon,
  },
  {
    name: "TOKEN",
    route: "/token/",
    icon: currencyIcon,
  },
  {
    name: "INSCRIBE",
    route: "/inscribe/",
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
  // },
  {
    name: "BRIDGE",
    route: "/bridge/",
    icon: bridgeIcon,
  },
];

function shotAddress(address: string) {
  return address.slice(0, 6) + "..." + address.slice(-6);
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { allAccounts, selectedAccount, setSelectedAccount, connect } =
    useConnectWallet();

  const handleSelectAccount = (keys: any) => {
    const address = Array.from(keys)[0] as string;
    const current = allAccounts.find((item) => item.address === address);
    setSelectedAccount(current as InjectedAccountWithMeta);
  };

  const handleConnect = async () => {
    const { isWeb3Injected } = await import("@polkadot/extension-dapp");

    if (isWeb3Injected) {
      await connect();
    } else {
      console.log("eee");
      await connect();
    }
  };

  useEffect(() => {
    handleConnect();
  }, []);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className={styles.header}
      maxWidth="full"
      classNames={{
        wrapper: "px-2 md:px-4",
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Image src="/logo.svg" alt="DOTA" width={113} height={40} priority />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {menus.map((item: any) => {
          return (
            <NavbarItem key={item.route}>
              <NavLink
                key={item.route}
                href={item.route}
                className={styles.menuItem}
              >
                <Image
                  src={item.icon}
                  width={24}
                  height={24}
                  alt={item.name}
                  className={styles.menuIcon}
                />
                {item.name}
              </NavLink>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          {selectedAccount ? (
            <Dropdown>
              <DropdownTrigger>
                <Button className="btn bg-pink-500 hover:bg-sky-700 color-white">
                  <span>
                    {selectedAccount.meta.name}
                    <span className="hidden md:inline">
                      {" "}
                      [ {shotAddress(selectedAccount.address)} ]
                    </span>
                  </span>
                  {allAccounts.length > 1 && (
                    <Image src={arrowIcon} width={12} height={12} alt="arrow" />
                  )}
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Static Accounts"
                variant="flat"
                selectionMode="single"
                selectedKeys={selectedAccount.address}
                onSelectionChange={handleSelectAccount}
              >
                {allAccounts.map((account) => (
                  <DropdownItem
                    key={account.address}
                    onClick={() => setSelectedAccount(account)}
                  >
                    {account.meta.name}
                    <span> [ {shotAddress(account.address)} ]</span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              className="btn bg-pink-500 hover:bg-sky-700 color-white"
              onClick={handleConnect}
            >
              Connect Wallet
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menus.map((item, index) => (
          <NavbarMenuItem key={`${item.route}-${index}`}>
            <Link
              className="w-full"
              color="foreground"
              size="lg"
              href={item.route}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
