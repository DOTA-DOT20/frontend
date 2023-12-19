'use client';

import React, { useEffect } from 'react';
import Link from "next/link";
import { Button } from "@nextui-org/react";
import styles from "./not-found.module.css"

const HomePage = () => {

    return (
       <div className={styles.content}>
           <div className="flex justify-center gap-5 items-center flex-col">
               <div className={styles.title}> 404</div>
               <p>PAGE NOT FOUND</p>
               <Link href="/">
                   <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 block flex-1 color-white"
                   >
                       Return Home
                   </Button>
               </Link>
           </div>
       </div>
    );
};

export default HomePage;
