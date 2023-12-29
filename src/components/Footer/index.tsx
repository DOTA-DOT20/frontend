'use client';

import Image from "next/image";
import twitterIcon from '@/icons/twitter.svg';
import docIcon  from '@/icons/book.svg';
import githubIcon  from '@/icons/github.svg';
import copyrightIcon  from './copyright.svg';
import styles from './index.module.css';

export default function Footer() {
    return <div className={styles.footer}>
        <div className={styles.footerNav}>
            <a  href="https://twitter.com/dot20_dota" target="_blank">
                <Image
                    src={twitterIcon}
                    width={32}
                    height={32}
                    alt="twitter"
                />
            </a>
            <a href="https://github.com/DOTA-DOT20" target="_blank">
                <Image
                    src={githubIcon}
                    width={32}
                    height={32}
                    alt="twitter"
                />
            </a>
            <a href="https://docs.dota.fyi" target="_blank">
                <Image
                    src={docIcon}
                    width={32}
                    height={32}
                    alt="doc"
                />
            </a>
        </div>
        <div className={styles.copyRight}>
            <Image
                src={copyrightIcon}
                width={385}
                height={50}
                alt="Secured by PolkaDot"
            />
        </div>
    </div>
}
