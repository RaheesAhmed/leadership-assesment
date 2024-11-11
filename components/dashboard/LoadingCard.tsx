import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-4 w-[250px] mb-4" />
        <Skeleton className="h-8 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[150px]" />
      </CardContent>
    </Card>
  );
}
