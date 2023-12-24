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
        label="Ticket"
        labelPlacement="outside-left"
        placeholder="Select a tick"
        classNames={{
            base: 'flex',
            mainWrapper: 'flex-1'
        }}
        radius="full"
        size="md"
        selectedKeys={props.value ? [props.value] : []}
        onSelectionChange={handleChange}
        style={{height: 50, border: '1px solid rgba(255, 255, 255, 0.80)',marginLeft: 10, width: 320}}
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
