"use client"
import  styles from "./index.module.css";
import {getTickList, getBalanceList, BalanceItem} from '@/request/index'
import React, {useRef, useEffect, useState} from "react";
import {useConnectWallet} from "@/hooks/usePolkadot";
import 'echarts/lib/chart/pie';

let isRequesting = false


export default function Home() {
    return (
        <main className="min-h-full md:px-24 px-8 py-24 w-full">
        </main>
    )
}
