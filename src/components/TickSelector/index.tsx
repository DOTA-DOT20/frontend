'use client';

import { Select, SelectItem } from "@nextui-org/react";
import {useMemo} from "react";

interface Props {
    value: string
    onValueChange: (value: string) => void
}

export default function TickSelector(props: Props) {

    const ticks = useMemo(() => {
        return [{
            name: 'DOTA'
        }]
    }, []);

    const handleChange = (e: any) => {
        props.onValueChange(e.currentKey)
    }

    return  <Select
        items={ticks}
        label="Tick"
        placeholder="Select a tick"
        className="max-w-xs"
        selectedKeys={props.value ? [props.value] : []}
        onSelectionChange={handleChange}
    >
        {(user) => (
            <SelectItem key={user.name} textValue={user.name}>
                <div className="flex gap-2 items-center">
                    <div className="flex flex-col">
                        <span className="text-small">{user.name}</span>
                    </div>
                </div>
            </SelectItem>
        )}
    </Select>
}
