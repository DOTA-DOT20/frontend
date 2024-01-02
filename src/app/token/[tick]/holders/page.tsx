import React from "react";
import HolderList from "./components/HolderList";

export function generateStaticParams() {
    return [{ tick: 'DOTA' }]
}

export default function HolderListPage({params}: { params: { tick: string } }) {
    const { tick } = params
    return (
        <HolderList tick={tick} />
    )
}
