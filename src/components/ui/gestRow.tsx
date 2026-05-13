import { Button } from "@heroui/react";
import { Minus, Plus } from "lucide-react";

type GuestRowProps = {
  title: string;
  subtitle: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disableMinus?: boolean;
};

function GuestRow({
  title,
  subtitle,
  value,
  onIncrement,
  onDecrement,
  disableMinus,
}: GuestRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-semibold text-black">
          {title}
        </h4>

        <p className="text-xs text-gray-500">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          size="sm"
           
          variant="primary"
          onPress={onDecrement}
          isDisabled={disableMinus}
        >
          <Minus size={14} />
        </Button>

        <span className="min-w-5 text-center text-sm font-medium">
          {value}
        </span>

        <Button
          isIconOnly
          size="sm"
           
          variant="secondary"
          onPress={onIncrement}
        >
          <Plus size={14} />
        </Button>
      </div>
    </div>
  );
}

export default GuestRow;