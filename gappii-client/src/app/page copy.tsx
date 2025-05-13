"use client"
import { Safari } from '@/components/magicui/safari';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-stretch justify-items-center min-h-screen w-full">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full">

        <div className="w-full min-h-[600px] lg:min-h-[700px] dark:bg-grid-white/[0.05] bg-grid-black/[0.07] text-midnight-900 flex items-center justify-center py-12 md:py-16">
          <GridBeam className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20 w-full">
              <div className="flex flex-col gap-4 max-w-xl text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">Master any subject with AI-powered learning</h1>
                <p className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-400 mt-4">
                  Gappii is an AI-powered learning platform that helps you master any subject with personalized, interactive lessons.
                </p>
              </div>
              <div className="w-full max-w-xl md:max-w-2xl lg:w-[55%] mt-8 lg:mt-0 transform transition-all duration-300 hover:scale-105">
                <Safari imageSrc="/images/app-preview.png" url="https://app.gappii.com" />
              </div>
            </div>
          </GridBeam>
        </div>

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center py-8 w-full border-t border-gray-200 dark:border-gray-800">
        <a
          className="flex items-center hover:underline text-sm text-neutral-600 dark:text-neutral-400"
          href="https://github.com/Goduu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Goduu © {new Date().getFullYear()}
        </a>
      </footer>
    </div>
  );
}

export const GridBeam: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('relative w-full h-full', className)}>
    <Beam />
    {children}
  </div>
)

export const Beam = () => {
  return (
    <svg
      width="156"
      height="63"
      viewBox="0 0 156 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-0 ml-24 mt-8"
    >
      <path
        d="M31 .5h32M0 .5h32m30 31h32m-1 0h32m-1 31h32M62.5 32V0m62 63V31"
        stroke="url(#grad1)"
        strokeWidth={1.5}
      />
      <defs>
        <motion.linearGradient
          variants={{
            initial: {
              x1: '40%',
              x2: '50%',
              y1: '160%',
              y2: '180%'
            },
            animate: {
              x1: '0%',
              x2: '10%',
              y1: '-40%',
              y2: '-20%'
            }
          }}
          animate="animate"
          initial="initial"
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            repeatDelay: 2
          }}
          id="grad1"
        >
          <stop stopColor="#18CCFC" stopOpacity="0" />
          <stop stopColor="#18CCFC" />
          <stop offset="0.325" stopColor="#6344F5" />
          <stop offset="1" stopColor="#AE48FF" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  )
}
