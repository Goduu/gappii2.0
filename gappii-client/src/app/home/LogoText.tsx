
import Image from "next/image";

export default function LogoText() {
    return (
        <div className={"opacity-100 absolute top-14 left-1/2 -translate-x-1/2"}>
            <Image src="/logo.svg" alt="Gappii Logo" width={150} height={150} />
        </div>
    )
}