interface EventsPerformanceProps {
  data: Array<{ name: string; value: number }>;
}

export default function EventsPerformance({data}: EventsPerformanceProps) {
    return (
        <div>
            Events Performance
        </div>
    )
}