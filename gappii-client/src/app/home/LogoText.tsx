
import Image from "next/image";


export default function LogoText() {
    return (
        <div className={"opacity-0 md:opacity-100 absolute top-5 left-1/2 -translate-x-1/2"}
        >
            <Image src="/gappii.svg" alt="Gappii Logo" width={150} height={150} />
        </div>
    )
}