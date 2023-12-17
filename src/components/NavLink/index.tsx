"use client"

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import {PropsWithChildren} from "react";

type NavLinkProps =  LinkProps & PropsWithChildren<{
    href: string
    exact?: boolean,
    className?: string
}>

const NavLink = ({ href, exact, children, ...others }: NavLinkProps) => {

    const pathname = usePathname()
    const active = ' active'
    const isActive = exact ? pathname === href : (pathname as string).startsWith(href)

    return (
        <Link href={href} {...others} className={(others.className || '') + (isActive? active : '') }>
            {children}
        </Link>
    )
}

export  default NavLink
