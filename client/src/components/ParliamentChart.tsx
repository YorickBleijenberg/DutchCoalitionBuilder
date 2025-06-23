import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as d3 from 'd3';

export default function ParliamentChart() {
  const { t } = useTranslation();
  const { parties, partySeats } = useApp();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 320;
    const centerX = width / 2;
    const centerY = height - 40;

    // Create seats data
    const seats: Array<{ party: string; color: string; angle: number; radius: number }> = [];
    let seatIndex = 0;

    // Calculate total seats and create seat data
    parties.forEach(party => {
      const partySeatsCount = partySeats[party.id] || 0;
      for (let i = 0; i < partySeatsCount; i++) {
        seats.push({
          party: party.name,
          color: party.color,
          angle: 0,
          radius: 0
        });
      }
    });

    // If no seats, show empty parliament
    if (seats.length === 0) {
      // Draw empty semicircle outline
      const arc = d3.arc()
        .innerRadius(60)
        .outerRadius(200)
        .startAngle(-Math.PI)
        .endAngle(0);

      svg.append("path")
        .attr("d", arc as any)
        .attr("transform", `translate(${centerX}, ${centerY})`)
        .attr("fill", "none")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");

      svg.append("text")
        .attr("x", centerX)
        .attr("y", centerY - 20)
        .attr("text-anchor", "middle")
        .attr("class", "text-sm coalition-neutral")
        .text("No seats assigned");

      return;
    }

    // Calculate positions for seats in semicircle
    const rows = 8;
    const baseRadius = 80;
    const radiusIncrement = 20;

    let currentSeat = 0;
    for (let row = 0; row < rows && currentSeat < seats.length; row++) {
      const radius = baseRadius + row * radiusIncrement;
      const circumference = Math.PI * radius;
      const seatsInRow = Math.min(
        Math.floor(circumference / 12), // 12px spacing between seats
        seats.length - currentSeat
      );

      for (let i = 0; i < seatsInRow && currentSeat < seats.length; i++) {
        const angle = -Math.PI + (i * Math.PI) / (seatsInRow - 1 || 1);
        seats[currentSeat].angle = angle;
        seats[currentSeat].radius = radius;
        currentSeat++;
      }
    }

    // Draw seats
    const seatGroups = svg.selectAll(".seat")
      .data(seats)
      .enter()
      .append("g")
      .attr("class", "seat");

    seatGroups.append("circle")
      .attr("cx", d => centerX + d.radius * Math.cos(d.angle))
      .attr("cy", d => centerY + d.radius * Math.sin(d.angle))
      .attr("r", 4)
      .attr("fill", d => d.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke", "#374151")
          .attr("stroke-width", 1.5);
        
        // Add tooltip
        const tooltip = svg.append("g")
          .attr("class", "tooltip")
          .attr("transform", `translate(${event.layerX}, ${event.layerY - 30})`);

        const rect = tooltip.append("rect")
          .attr("x", -25)
          .attr("y", -20)
          .attr("width", 50)
          .attr("height", 20)
          .attr("fill", "rgba(0,0,0,0.8)")
          .attr("rx", 4);

        tooltip.append("text")
          .attr("text-anchor", "middle")
          .attr("y", -5)
          .attr("fill", "white")
          .attr("font-size", "10px")
          .text(d.party);
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 0.5);
        
        svg.select(".tooltip").remove();
      });

    // Add majority line
    const majorityAngle = -Math.PI + (75 / 149) * Math.PI; // 76th seat position
    svg.append("line")
      .attr("x1", centerX + 60 * Math.cos(majorityAngle))
      .attr("y1", centerY + 60 * Math.sin(majorityAngle))
      .attr("x2", centerX + 220 * Math.cos(majorityAngle))
      .attr("y2", centerY + 220 * Math.sin(majorityAngle))
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("opacity", 0.7);

    // Add majority label
    svg.append("text")
      .attr("x", centerX)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm font-medium coalition-neutral")
      .text(t('parliament.majorityLine'));

  }, [parties, partySeats, t]);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700" id="results-panel">
      <CardContent className="p-6">
        <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <svg
            ref={svgRef}
            width="100%"
            height="320"
            viewBox="0 0 600 320"
            className="parliament-svg"
          />
        </div>
      </CardContent>
    </Card>
  );
}
