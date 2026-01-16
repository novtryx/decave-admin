import FlashCard from "@/components/dashboard/FlashCard";

interface AnalyticsStatsProps {
  data: AnalyticsData;
}

export default function AnalyticsStats({data}: AnalyticsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FlashCard>
            hi
      </FlashCard>
        
      
      <FlashCard>
            hi
      </FlashCard>
      
      <FlashCard>
            hi
      </FlashCard>
       
      <FlashCard>
            hi
      </FlashCard>
     
    </div>
  );
};