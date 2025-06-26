interface PartyChipProps {
  party: {
    id: string;
    name: string;
    color: string;
  };
  seats?: number;
  showSeats?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PartyChip({ 
  party, 
  seats, 
  showSeats = false, 
  size = 'md',
  className = '' 
}: PartyChipProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3', 
    lg: 'w-4 h-4'
  };

  return (
    <div className={`
      flex items-center space-x-1 bg-blue-100 dark:bg-blue-800 rounded
      ${sizeClasses[size]} ${className}
    `}>
      <div
        className={`${dotSizes[size]} rounded-full`}
        style={{ backgroundColor: party.color }}
      />
      <span className="font-medium text-blue-900 dark:text-blue-100">
        {party.name}
      </span>
      {showSeats && seats !== undefined && (
        <span className="text-blue-700 dark:text-blue-300">
          ({seats})
        </span>
      )}
    </div>
  );
}