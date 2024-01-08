'use client';

import { useEffect } from 'react';
import {usePathname, useRouter} from 'next/navigation';
import Image from "next/image";

const HomePage = () => {
    const pathname = usePathname()
    const router = useRouter();

    useEffect(() => {
        if(pathname === '/') {
            router.replace('/token');
        }
    }, []);

    return (
        <div className="flex justify-center gap-5 items-center flex-col min-h-screen">
            <Image
                src="/favicon.svg"
                alt="DOTA"
                width={150}
                height={150}
                priority
            />
            <p>DOTA - DOT 20</p>
        </div>
    );
};

export default HomePage;
