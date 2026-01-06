// import { fetcher } from "@/lib/coingecko.actions";
// import { formatCurrency } from "@/lib/utils";
// import Image from "next/image";
// import { CoinOverviewFallback } from "./fallback";

// const CoinOverview = async () => {
//   //CoinDetailsData is the interface containing all the types of info about a coin
//   // let coin;
//   // let coinOHLCdata;

//   //parallel execution of both the fetchers - only when the execution is done, the variables will be filled w data
//   try {
//     const [coin, coinOHLCdata] = await Promise.all([
//       await fetcher<CoinDetailsData>("/coins/bitcoin", {
//         dex_pair_format: "symbol",
//       }),
//       await fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
//         vs_currency: "usd",
//         days: 1,
//         // interval: "hourly",
//         // precision: "full",
//       }),
//     ]);
//   } catch (error) {
//     console.log("Error fetching from API's", error);
//     return <CoinOverviewFallback />
//   }

//   return (
//     <div id="coin-overview">
//       <div className="header pt-2">
//         <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
//         <div className="info">
//           <p>
//             {coin.name} / {coin.symbol.toUpperCase()}
//           </p>
//           <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CoinOverview;

import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { CoinOverviewFallback } from "./fallback";
import CandlestickChart from "../CandlestickChart";

const CoinOverview = async () => {
  let coin: CoinDetailsData | null = null;
  let coinOHLCdata: OHLCData[] | null = null;

  try {
    [coin, coinOHLCdata] = await Promise.all([
      fetcher<CoinDetailsData>("/coins/bitcoin", {
        dex_pair_format: "symbol",
      }),
      fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
        vs_currency: "usd",
        days: 1,
      }),
    ]);
  } catch (error) {
    console.error("Error fetching from APIs", error);
    return <CoinOverviewFallback />;
  }

  if (!coin) return <CoinOverviewFallback />;

  return (
    <div id="coin-overview">
      <CandlestickChart data={coinOHLCdata} coinId="bitcoin">
        <div className="header pt-2">
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={56}
            height={56}
          />
          <div className="info">
            <p>
              {coin.name} / {coin.symbol.toUpperCase()}
            </p>
            <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export default CoinOverview;
