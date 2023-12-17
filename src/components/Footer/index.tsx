'use client';

import Image from "next/image";
import twitterIcon from '@/icons/twitter.svg';
import docIcon  from '@/icons/book.svg';
import githubIcon  from '@/icons/github.svg';
import styles from './index.module.css';
export default function Footer() {
    return <div className={styles.footer}>
        <a  href="https://twitter.com/dot20_dota" target="_blank">
            <Image
                src={twitterIcon}
                width={32}
                height={32}
                alt="twitter"
            />
        </a>
        <a href="https://github.com/DOTA-RC20" target="_blank">
            <Image
                src={githubIcon}
                width={32}
                height={32}
                alt="twitter"
            />
        </a>
        <a>
            <Image
                src={docIcon}
                width={32}
                height={32}
                alt="doc"
            />
        </a>
    </div>
}
