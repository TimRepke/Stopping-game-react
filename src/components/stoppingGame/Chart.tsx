import {
  LineChart,
  YAxis,
  CartesianGrid,
  XAxis,
  Line,
  ReferenceLine,
  ReferenceArea,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RowT } from "../../redux/api/gameApi";
import React from "react";
import { CalcScore } from "../../lib/helper";

type Props = {
  data: RowT[];
  currentRowIndex: number;
  lastRowIndex: number;
  setCurrentRowIndex: React.Dispatch<React.SetStateAction<number>>;
  gameSpeed: number;
  autoPlay: boolean;
  stopMethod: () => void;
};

// Suppose chartData length = data.length
// const generateRandomSubmissions = (
//   dataLength: number,
//   numSubmissions: number
// ): number[] => {
//   const submissions: number[] = [];

//   for (let s = 0; s < numSubmissions; s++) {
//     let u = 0, v = 0;
//     while (u === 0) u = Math.random();
//     while (v === 0) v = Math.random();
//     let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
//     num = num * 0.15 + 0.5;   // mean=0.5, std dev = 0.15
//     num = Math.min(Math.max(num, 0), 1); // clamp to 0..1
//     const randomIndex = Math.floor(num * dataLength);
//     submissions.push(randomIndex);
//   }
//   return submissions;
// };

const Chart = (props: Props) => {
  const {
    data,
    currentRowIndex,
    lastRowIndex,
    setCurrentRowIndex,
    gameSpeed,
    autoPlay,
    stopMethod,
  } = props;

  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameEnded, setGameEnded] = React.useState(false);

  React.useEffect(() => {
    if (autoPlay && !gameStarted) setGameStarted(true);
    if (!autoPlay && gameStarted) setGameEnded(true);
  }, [autoPlay, gameStarted]);

  const chartData = data.slice(0, currentRowIndex + 1).map((r) => ({
    batch: r.batch_i,
    seen: r.n_seen,
    included_seen: r.n_incl_seen,
    score: CalcScore(r)/10
  }));

  // const mockPlayerSubmissions = generateRandomSubmissions(data[1].n_total, 100);

  const FinalData = data.map((r) => ({
    batch: r.batch_i,
    seen: r.n_seen,
    included_seen: r.n_incl_seen,
  }));

  let minToFindAll = 0;
  for (let row = 0; row < data.length; row++) {
    if (data[row].n_incl_seen === data[row].n_incl) {
      minToFindAll = row;
      break;
    }
  }

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (autoPlay && data.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentRowIndex((prev) => {
          if (prev < lastRowIndex - 1) return prev + 1;
          stopMethod();
          return prev;
        });
      }, gameSpeed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, data, gameSpeed, lastRowIndex, setCurrentRowIndex, stopMethod]);

  return (
    <ResponsiveContainer width="100%" height={550}>
      <LineChart data={!gameEnded ? chartData : FinalData}>
        {/* Grid */}
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e0e0e034"
        />

        {/* Axes */}
        <XAxis
          dataKey="seen"
          type="number"
          range={[0, 1900]}
          tick={{ fill: "#666", fontSize: 12 }}
          label={{ value: "Seen", position: "insideBottom", offset: -5 }}
        />
        <YAxis
          dataKey="included_seen"
          type="number"
          tick={{ fill: "#666", fontSize: 12 }}
          label={{
            value: "Included Seen",
            angle: -90,
            position: "insideLeft",
          }}
        />

        {/* <Line
          type="monotone"
          dataKey="score"
          stroke="#4c66afff"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6 }}
          isAnimationActive={false}
        /> */}

        {/* Tooltip */}
        <Tooltip
          formatter={(value: number) => [value, "Included"]}
          labelFormatter={(label) => `Seen: ${label}`}
        />

        {/* Current Position */}
        <ReferenceLine
          x={data[currentRowIndex].n_seen}
          stroke="#d32f2f"
          strokeDasharray="4 4"
          label={{ value: "Current", position: "top", fill: "#d32f2f" }}
        />

        {/* Game End Highlights */}
        {gameEnded && (
          <>
            <ReferenceArea
              y1={data[currentRowIndex].n_incl_seen}
              y2={data[currentRowIndex].n_incl}
              fill="rgba(255, 0, 0, 0.25)"
            />
            {currentRowIndex > minToFindAll  &&
              <ReferenceArea
                x1={data[currentRowIndex].n_seen}
                x2={FinalData[minToFindAll].seen}
                fill="rgba(255, 0, 0, 0.1)"
              />
            }


            <ReferenceLine
              x={FinalData[minToFindAll].seen}
              stroke="#2e7d32"
              strokeDasharray="6 4"
              label={{ value: "Optimal", position: "top", fill: "#2e7d32" }}
            />

            <ReferenceLine
              x={FinalData[lastRowIndex - 1]?.seen}
              stroke="#9e9e9e"
              strokeDasharray="3 3"
              label={{ value: "End", position: "top", fill: "#9e9e9e" }}
            />
          </>
        )}

        {/* {mockPlayerSubmissions.map(s => (
          <ReferenceLine
            x={s}
            stroke="#001aff37"
            strokeDasharray="1 1"
            label={{ value: "End", position: "top", fill: "#9e9e9e" }}
          />
        ))} */}

        <Line
          type="monotone"
          dataKey="included_seen"
          stroke="#4caf50"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6 }}
          isAnimationActive={false}
        />

      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
