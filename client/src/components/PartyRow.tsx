import { useApp } from '../context/AppContext';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface PartyRowProps {
  party: {
    id: string;
    name: string;
    fullName: string;
    color: string;
    ideology: string;
    leader: string;
  };
}

export default function PartyRow({ party }: PartyRowProps) {
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

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
      <div className="flex items-center space-x-3">
        <div 
          className="w-4 h-4 rounded-full" 
          style={{ backgroundColor: party.color }}
          title={party.fullName}
        />
        <div>
          <div className="font-medium text-sm">{party.name}</div>
          <div className="text-xs coalition-neutral">{party.ideology}</div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={selectedParties.includes(party.id)}
          onCheckedChange={handlePartyToggle}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
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
