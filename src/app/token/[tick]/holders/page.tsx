import React from "react";
import HolderList from "./components/HolderList";
import { getTickList } from "@/request";

export async function generateStaticParams() {
    const data: any = await getTickList()
    const ticks = data?.ticks
    return ticks? ticks.map((item: any) => {
        return {
            tick: item.tick
        }
    }) : [{ tick: 'DOTA' }]
}

export default function HolderListPage({params}: { params: { tick: string } }) {
    const { tick } = params
    return (
        <HolderList tick={tick} />
    )
}
