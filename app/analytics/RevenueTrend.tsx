interface RevenueTrendProps {
  data: Array<{ name: string; value: number }>;
}

export default function RevenueTrend({data}: RevenueTrendProps) {
    return (
        <div>
            Revenue Trend
        </div>
    )
}