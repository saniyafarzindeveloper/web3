"use client";
import { PERIOD_BUTTONS } from "@/constants";
import { useState } from "react";

const CandlestickChart = ({
  children,
  data,
  height = 360,
  coinId,
  initialPeriod = "daily",
}: CandlestickChartProps) => {
  const [loading, setLoading] = useState(false);
  return (
    <div id="candlestick-chart">
      <div className="chart-header">{children}</div>
      <div className="button-group">
        <span className="text-sm mx-2 font-medium text-purple-100/50">
          Period
        </span>
        {PERIOD_BUTTONS.map(({ value, label }) => (
          <button
            key={value}
            className="config-button"
            onClick={() => {}}
            disabled={loading}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CandlestickChart;
