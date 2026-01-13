import React from "react"

interface flashCardProps {
    children: React.ReactNode;
}

export default function FlashCard({ children }: flashCardProps) {
    return (
        <div className="bg-[#151515] p-4 border border-[#27272A] rounded-2xl h-auto w-full">
            {children}
        </div>
    )
}