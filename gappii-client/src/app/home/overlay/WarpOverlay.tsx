"use client"

import {
    animate,
    AnimatePresence,
    motion,
    useMotionValue,
    useTransform,
} from "motion/react"
import { useEffect, useRef, useState } from "react"
import { ImmersiveOverlay } from "./ImmersiveOverlay"

type WarpOverlayProps = {
    intensity?: number
    children: React.ReactNode
    trigger: React.ReactNode
}
export default function WarpOverlay({
    intensity = 0.1,
    children,
    trigger,
}: WarpOverlayProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState({ width: 0, height: 0 })
    useEffect(() => {
        setSize({
            width: ref.current?.clientWidth || 0,
            height: ref.current?.clientHeight || 0,
        })
    }, [ref])

    const [isModalOpen, setIsModalOpen] = useState(false)

    const deform = useMotionValue(0)
    const rotateX = useTransform(() => deform.get() * -5)
    const skewY = useTransform(() => deform.get() * -1.5)
    const scaleY = useTransform(() => 1 + deform.get() * intensity)
    const scaleX = useTransform(() => 1 - deform.get() * intensity * 0.6)

    // Open delete modal and trigger deformation animation
    const handleOpen = () => {

        setIsModalOpen(true)

        animate([
            [deform, 1, { duration: 0.3, ease: [0.65, 0, 0.35, 1] }],
            [deform, 0, { duration: 1.5, ease: [0.22, 1, 0.36, 1] }],
        ])
    }

    const closeModal = () => setIsModalOpen(false)

    return (
        <div className="flex justify-center items-center w-full h-full overflow-hidden m-0 p-0">
            <div className="flex-1 p-0 flex flex-col overflow-hidden mt-2.5" ref={ref}>
                <motion.div
                    style={{
                        rotateX,
                        skewY,
                        scaleY,
                        scaleX,
                        originX: 0.5,
                        originY: 0,
                        transformPerspective: 500,
                        willChange: "transform",
                    }}
                    onClick={handleOpen}
                >
                    {trigger}
                </motion.div>
            </div>

            <AnimatePresence>
                {isModalOpen ? (
                    <ImmersiveOverlay
                        close={closeModal}
                        size={size}
                    >
                        {children}
                    </ImmersiveOverlay>
                ) : null}
            </AnimatePresence>
        </div>
    )
}

