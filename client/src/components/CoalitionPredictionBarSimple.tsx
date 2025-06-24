import { useApp } from "../context/AppContext";
import { Card } from "@/components/ui/card";

export default function CoalitionPredictionBarSimple() {
  const { parties, partySeats, selectedParties, coalitionSeats } = useApp();

  // Get selected parties with their data
  const selectedPartiesData = parties
    .filter((party) => selectedParties.includes(party.id))
    .map((party) => ({
      ...party,
      predictedSeats: partySeats[party.id] || 0,
    }))
    .sort((a, b) => b.predictedSeats - a.predictedSeats);

  const maxSeats = 150;
  const majoritySeats = 76;
  const hasMajority = coalitionSeats >= majoritySeats;

  if (selectedPartiesData.length === 0) return null;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-12 md:top-20 z-30">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Coalitie
            </h3>
            <div
              className={`text-sm font-medium px-2 py-1 rounded ${
                hasMajority 
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {hasMajority
                ? `Meerderheid (+${coalitionSeats - majoritySeats})`
                : `${majoritySeats - coalitionSeats} zetels nodig`}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Coalitie zetels:{" "}
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {coalitionSeats}
              </span>
            </div>
          </div>
        </div>

        {/* Bar Visualization */}
        <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          {/* Majority line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
            style={{ left: `${(majoritySeats / maxSeats) * 100}%` }}
          />

          {/* Party bars */}
          {selectedPartiesData.reduce((acc, party, index) => {
            const previousSeats = selectedPartiesData
              .slice(0, index)
              .reduce((sum, p) => sum + p.predictedSeats, 0);
            const startPercentage = (previousSeats / maxSeats) * 100;
            const widthPercentage = (party.predictedSeats / maxSeats) * 100;

            acc.push(
              <div
                key={party.id}
                className="absolute top-0 bottom-0 flex items-center justify-center"
                style={{
                  left: `${startPercentage}%`,
                  width: `${widthPercentage}%`,
                  backgroundColor: party.color,
                }}
              >
                {widthPercentage > 8 && (
                  <span className="text-white text-xs font-bold px-1 truncate">
                    {party.name} ({party.predictedSeats})
                  </span>
                )}
              </div>,
            );

            return acc;
          }, [] as JSX.Element[])}
        </div>
      </div>
    </Card>
  );
}
