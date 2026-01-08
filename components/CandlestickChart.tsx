"use client";
import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from "@/constants";
import { fetcher } from "@/lib/coingecko.actions";
import { convertOHLCData } from "@/lib/utils";
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { useEffect, useRef, useState, useTransition } from "react";

const CandlestickChart = ({
  children,
  data,
  height = 360,
  coinId,
  initialPeriod = "daily",
}: CandlestickChartProps) => {
  //REFS
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null); //for the DOM that's going to hold the charts
  const candleChartSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(initialPeriod);

  //?? in JavaScript is called the nullish coalescing operator
  //If mango juice is available → drink mango
  // If mango juice is NOT available → drink orange
  // const drink = mangoJuice ?? orangeJuice;
  //?? only cares about missing values, not false values
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []); //refetching of the data whenever period is changed

  //react transition
  const [isPending, startTransition] = useTransition();

  //function for fetching the new data
  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      const { days, intervals } = PERIOD_CONFIG[selectedPeriod];
      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: "usd",
        days,
        // intervals,
        // percision: 'full'
      });
      //if data changes
      setOhlcData(newData ?? []);
    } catch (error) {
      console.error("Error from fetchOHLCData", error);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

    //TODO - handle period change for filtering based on change
    startTransition(async () => {
      setPeriod(newPeriod); //setting the chosen period
      await fetchOHLCData(newPeriod);
    });
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;
    const showTime = ["daily", "weekly", "montly"].includes(period);

    //creating the chart
    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });

    //adding the series of candle sticks in the chart
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    //correct conversion
    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData
    );

    series.setData(convertOHLCData(convertedToSeconds));
    chart.timeScale().fitContent(); //fitting the content in the screen
    chartRef.current = chart; //storing the current chart ref in chart
    candleChartSeriesRef.current = series; //storing the current candle stick series ref in chart

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container); //the chart should take the size of the container to ensure responsiveness

    //cleaning up
    return () => {
      observer.disconnect();
      chart.remove(); //removing the chart to prevent memory leaks
      chartRef.current = null;
      candleChartSeriesRef.current = null;
    };
  }, [height, period]);

  //for the charts to show the data based on the selected period
  useEffect(() => {
    if (!candleChartSeriesRef.current) return;

    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData
    );

    const converted = convertOHLCData(convertedToSeconds);
    candleChartSeriesRef.current.setData(converted);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData, period]);

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
            className={
              period === value ? "config-button-active" : "config-button"
            }
            onClick={() => handlePeriodChange(value)}
            disabled={isPending}
          >
            {label}
          </button>
        ))}
      </div>
      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  );
};

export default CandlestickChart;
