import React, { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Row {
  dataset: string;
  sim_rep: number;
  batch_i: number;
  n_total: number;
  n_seen: number;
  n_incl: number;
  n_incl_seen: number;
  method: string;
  safe_to_stop: boolean;
  method_score: number;
  method_confidence_level: number;
  method_bias: number;
  method_recall_target: number; // NEW FIELD
}

const AUTO_INTERVAL = 50; // ms per batch

const StoppingGame: React.FC = () => {
  const [csvRows, setCsvRows] = useState<Row[]>([]);
  const [filteredRows, setFilteredRows] = useState<Row[]>([]);

  const [selectedDataset, setSelectedDataset] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedConfidence, setSelectedConfidence] = useState<number | null>(null);
  const [selectedBias, setSelectedBias] = useState<number | null>(null);
  const [selectedRecallTarget, setSelectedRecallTarget] = useState<number | null>(null); // NEW

  const [currentBatch, setCurrentBatch] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------------------------------
  // AUTO PLAY
  // ---------------------------------------
  useEffect(() => {
    if (autoPlay && filteredRows.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentBatch((prev) =>
          prev < filteredRows.length - 1 ? prev + 1 : prev
        );
      }, AUTO_INTERVAL);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, filteredRows]);

  // ---------------------------------------
  // CSV LOAD
  // ---------------------------------------
  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setCsvRows(results.data as Row[]);
      },
    });
  };

  // ---------------------------------------
  // APPLY FILTERS
  // ---------------------------------------
  const applyFilters = () => {
    const filtered = csvRows
      .filter(
        (r) =>
          r.dataset === selectedDataset &&
          r.method === selectedMethod &&
          r.method_confidence_level === selectedConfidence &&
          r.method_bias === selectedBias &&
          r.method_recall_target === selectedRecallTarget
      )
      .sort((a, b) => a.batch_i - b.batch_i);

    setFilteredRows(filtered);
    setCurrentBatch(0);

    if (filtered.length > 0) setAutoPlay(true);
  };

  // ---------------------------------------
  // MANUAL CONTROLS
  // ---------------------------------------
  const nextBatch = () => {
    setAutoPlay(false);
    setCurrentBatch((prev) =>
      prev < filteredRows.length - 1 ? prev + 1 : prev
    );
  };

  const prevBatch = () => {
    setAutoPlay(false);
    setCurrentBatch((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const stopAuto = () => setAutoPlay(false);
  const startAuto = () => {
    if (filteredRows.length > 0) setAutoPlay(true);
  };

  // ---------------------------------------
  // CHART DATA
  // ---------------------------------------
  const chartData = filteredRows.slice(0, currentBatch + 1).map((r) => ({
    batch: r.batch_i,
    seen: r.n_seen,
    included: r.n_incl,
    included_seen: r.n_incl_seen, //((r.n_incl_seen / r.n_incl) / (r.n_seen / r.n_total)) * r.n_seen,
    score: r.method_score,// (r.method_score * (r.n_seen / r.n_total)) * r.n_seen,
  }));

  // Current numerical values (for display)
  const currentRow = filteredRows[currentBatch] || null;

  // ---------------------------------------
  // DROPDOWN OPTIONS
  // ---------------------------------------
  const datasets = [...new Set(csvRows.map((r) => r.dataset))];
  const methods = [...new Set(csvRows.map((r) => r.method))];
  const confidenceLevels = [...new Set(csvRows.map((r) => r.method_confidence_level))];
  const biases = [...new Set(csvRows.map((r) => r.method_bias))];
  const recallTargets = [...new Set(csvRows.map((r) => r.method_recall_target))];

  // ---------------------------------------
  // RENDER
  // ---------------------------------------
  return (
    <div style={{ padding: 20 }}>
      <h1>Stopping Method Game</h1>

      {/* CSV UPLOAD */}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          if (e.target.files) handleFileUpload(e.target.files[0]);
        }}
      />

      {csvRows.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h2>Select Configuration</h2>

          {/* DATASET */}
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
          >
            <option value="">Dataset</option>
            {datasets.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          {/* METHOD */}
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option value="">Method</option>
            {methods.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          {/* CONFIDENCE */}
          <select
            value={selectedConfidence ?? ""}
            onChange={(e) =>
              setSelectedConfidence(
                e.target.value ? Number(e.target.value) : null
              )
            }
            style={{ marginLeft: 10 }}
          >
            <option value="">Confidence</option>
            {confidenceLevels.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* BIAS */}
          <select
            value={selectedBias ?? ""}
            onChange={(e) =>
              setSelectedBias(
                e.target.value ? Number(e.target.value) : null
              )
            }
            style={{ marginLeft: 10 }}
          >
            <option value="">Bias</option>
            {biases.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* RECALL TARGET — NEW */}
          <select
            value={selectedRecallTarget ?? ""}
            onChange={(e) =>
              setSelectedRecallTarget(
                e.target.value ? Number(e.target.value) : null
              )
            }
            style={{ marginLeft: 10 }}
          >
            <option value="">Recall Target</option>
            {recallTargets.map((rt) => (
              <option key={rt} value={rt}>
                {rt}
              </option>
            ))}
          </select>

          <button onClick={applyFilters} style={{ marginLeft: 10 }}>
            Load
          </button>
        </div>
      )}

      {/* CHART */}
      {chartData.length > 0 && (
        <>
          <h3 style={{ marginTop: 30 }}>
            Batch: {currentBatch} / {filteredRows.length - 1}{" "}
            {autoPlay && <span style={{ marginLeft: 10 }}>(Auto)</span>}
          </h3>

          {/* LIVE METRICS DISPLAY */}
          {currentRow && (
            <div
              style={{
                marginBottom: 20,
                padding: 10,
                background: "#f4f4f4",
                borderRadius: 6,
                width: 300,
              }}
            >
              <h4>Current Batch Values</h4>
              <div>Seen: <b>{currentRow.n_seen}</b></div>
              <div>Included: <b>{currentRow.n_incl_seen}</b></div>
              <div>Score: <b>{currentRow.method_score.toFixed(4)}</b></div>
            </div>
          )}

          <LineChart
            width={850}
            height={350}
            data={chartData}
          >
            <YAxis yAxisId="seen"/>
            <YAxis yAxisId="included_seen" orientation="right" />
            <YAxis yAxisId="score" orientation="right" domain={[0, 1]} />

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="batch" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="seen"
              stroke="#8884d8"
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="included_seen"
              stroke="#82ca9d"
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#ff7300"
              isAnimationActive={false}
            />
          </LineChart>

          {/* CONTROLS */}
          <div style={{ marginTop: 20 }}>
            <button onClick={prevBatch}>Previous</button>
            <button onClick={nextBatch} style={{ marginLeft: 10 }}>
              Next
            </button>
            <button onClick={stopAuto} style={{ marginLeft: 10 }}>
              Stop Auto
            </button>
            <button onClick={startAuto} style={{ marginLeft: 10 }}>
              Start Auto
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StoppingGame;
