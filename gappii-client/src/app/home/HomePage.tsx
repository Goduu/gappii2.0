"use client"
import TheSquare from "./the-square/TheSquare";
import BackStripe from "./BackStripe";

export default function HomePage() {

    return (
        <div className="relative flex flex-col h-screen w-full overflow-hidden pb-44">
            <TheSquare />
            <BackStripe routesToHide={["home"]} route="home" />
        </div>
    )
}
