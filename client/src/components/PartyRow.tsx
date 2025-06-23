import { useApp } from '../context/AppContext';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface PartyRowProps {
  party: {
    id: string;
    name: string;
    fullName: string;
    color: string;
    ideology: string;
    leader: string;
    currentSeats: number;
  };
  mode?: 'prediction' | 'coalition';
}

export default function PartyRow({ party, mode = 'prediction' }: PartyRowProps) {
  const { partySeats, setPartySeats, selectedParties, setSelectedParties } = useApp();

  const handleSeatChange = (value: string) => {
    const seats = Math.max(0, Math.min(150, parseInt(value) || 0));
    setPartySeats({
      ...partySeats,
      [party.id]: seats,
    });
  };

  const handlePartyToggle = (checked: boolean) => {
    if (checked) {
      setSelectedParties([...selectedParties, party.id]);
    } else {
      setSelectedParties(selectedParties.filter(id => id !== party.id));
    }
  };

  const currentSeats = partySeats[party.id] || 0;
  const seatChange = currentSeats - party.currentSeats;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
      <div className="flex items-center space-x-3 flex-1">
        <div 
          className="w-4 h-4 rounded-full" 
          style={{ backgroundColor: party.color }}
          title={party.fullName}
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <div className="font-medium text-sm">{party.name}</div>
            {mode === 'prediction' && (
              <Badge variant="outline" className="text-xs">
                Current: {party.currentSeats}
              </Badge>
            )}
            {mode === 'prediction' && seatChange !== 0 && (
              <Badge 
                variant={seatChange > 0 ? "default" : "destructive"} 
                className="text-xs"
              >
                {seatChange > 0 ? '+' : ''}{seatChange}
              </Badge>
            )}
          </div>
          <div className="text-xs coalition-neutral">{party.ideology}</div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {mode === 'coalition' && (
          <Checkbox
            checked={selectedParties.includes(party.id)}
            onCheckedChange={handlePartyToggle}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
        )}
        <Input
          type="number"
          min="0"
          max="150"
          value={partySeats[party.id] || ''}
          onChange={(e) => handleSeatChange(e.target.value)}
          className="w-16 text-sm"
          placeholder="0"
        />
      </div>
    </div>
  );
}
