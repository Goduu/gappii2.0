import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <Image src={'/logo.svg'} alt='logo' width={2386} height={2386} className='w-44 sm:w-80 hover:scale-105 transition-transform' />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/Goduu/"
          target="_blank"
          rel="noopener noreferrer"
        >
         Goduu {new Date().getFullYear()}
         </a> */}
      </footer>
    </div>
  );
}
