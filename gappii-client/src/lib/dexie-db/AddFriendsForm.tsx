import { useState } from "react";
import { db } from "./db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddFriendForm({ defaultAge } = { defaultAge: 21 }) {
    const [name, setName] = useState('');
    const [age, setAge] = useState(defaultAge);
    const [status, setStatus] = useState('');

    async function addFriend() {
        try {
            // Add the new friend!
            const id = await db.friends.add({
                name,
                age
            });

            setStatus(`Friend ${name} successfully added. Got id ${id}`);
            setName('');
            setAge(defaultAge);
        } catch (error) {
            setStatus(`Failed to add ${name}: ${error}`);
        }
    }

    return (
        <div className="flex flex-col gap-4 w-96 border border-slate-500 rounded-md p-4">
            <p>{status}</p>
            Name:
            <Input
                type="text"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
            />
            Age:
            <Input
                type="number"
                value={age}
                onChange={(ev) => setAge(Number(ev.target.value))}
            />
            <Button onClick={addFriend}>Add</Button>
        </div>
    );
}
