import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface SeatCounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function SeatCounter({
  value,
  onIncrement,
  onDecrement,
  onChange,
  min = 0,
  max = 150,
  className = ''
}: SeatCounterProps) {
  return (
    <div className={`flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-none border-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={onDecrement}
        disabled={value <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>


      <span className="w-8 text-center font-bold text-lg dutch-text">
        {value}
      </span>
      
     
     
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-none border-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={onIncrement}
        disabled={value >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}