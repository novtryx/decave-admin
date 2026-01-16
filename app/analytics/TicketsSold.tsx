interface TicketsSoldProps {
  data: Array<{ month: string; value: number }>;
}

export default function TicketsSold({data}: TicketsSoldProps) {
    return (
        <div>
            Tickets Sold
        </div>
    )
}