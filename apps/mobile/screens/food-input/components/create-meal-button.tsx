import { Button } from "@/components/ui/button";

interface CreateMealButtonProps {
  onPress: () => void;
}

export function CreateMealButton({ onPress }: CreateMealButtonProps) {
  return (
    <Button variant="primary" onPress={onPress}>
      Create a new meal
    </Button>
  );
}
