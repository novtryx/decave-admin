import { FiAlertTriangle } from "react-icons/fi"

export default function Alerts() {
    return (
        <div className="bg-[#151515] p-4 border border-[#27272A] rounded-2xl">
            
            <div className="flex items-center gap-2">
                <FiAlertTriangle className="text-xl text-[#cca33a]" />
                <p>Alerts</p>           
            </div>
        </div>
    )
}