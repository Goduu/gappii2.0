"use client"
import TheSquare from "./the-square/TheSquare";
import BackStripe from "./BackStripe";
import LogoText from "./LogoText";
import { AddFriendForm } from "@/lib/dexie-db/AddFriendsForm";
import { FriendList } from "@/lib/dexie-db/FirnedsList";

export default function HomePage() {

    return (
        <div className="relative flex flex-col h-screen w-full overflow-hidden pb-44">
            <LogoText />
            <TheSquare />
            <BackStripe routesToHide={["home"]} route="home" />
            {/* <div className="flex flex-col gap-4 text-slate-500">
                <h1>My simple Dexie app</h1>

                <h2>Add Friend</h2>
                <AddFriendForm defaultAge={21} />

                <h2>Friend List</h2>
                <FriendList minAge={18} maxAge={65} />
            </div> */}
        </div>
    )
}
