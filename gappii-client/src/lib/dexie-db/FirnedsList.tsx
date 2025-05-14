import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";


export function FriendList({ minAge, maxAge }: { minAge: number, maxAge: number }) {
    const friends = useLiveQuery(
        async () => {
            //
            // Query Dexie's API
            //
            const friends = await db.friends
                .where('age')
                .between(minAge, maxAge)
                .toArray();

            // Return result
            return friends;
        },
        // specify vars that affect query:
        [minAge, maxAge]
    );

    return (
        <ul className="flex flex-col gap-4 border w-96 border-slate-500 rounded-md p-4">
            {friends?.map((friend) => (
                <li key={friend.id} className="flex gap-2">
                    <p>{friend.name}</p>
                    <p>{friend.age} years old</p>
                </li>
            ))}
        </ul>
    );
}

