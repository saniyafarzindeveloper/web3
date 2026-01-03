// import DataTable from "@/components/DataTable";
// import Image from "next/image";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { TrendingDown, TrendingUp } from "lucide-react";

// const columns: DataTableColumn<TrendingCoin>[] = [
//   {
//     header: "Title",
//     cellClassName: "name-cell",
//     cell: (coin) => {
//       const item = coin.item;
//       return (
//         <Link href={`/coins/${item.id}`}>
//           <Image src={item.large} alt={item.name} width={36} height={36} />
//           <p>{item.name}</p>
//         </Link>
//       );
//     },
//   },
//   {
//     header: "24h change",
//     cellClassName: "name-cell",
//     cell: (coin) => {
//       const item = coin.item;
//       const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;
//       return (
//         <div
//           className={cn(
//             "price-change",
//             isTrendingUp ? "text-green-500" : "text-red-500"
//           )}
//         >
//           <p>{isTrendingUp ? (
//             <TrendingUp width={16} height={16} />
//           ): 
//           <TrendingDown width={16} height={16} />
//         }</p>
//         </div>
//       );
//     },
//   },
//   {
//     header: "Price",
//     cellClassName: "price-cell",
//     cell: (coin) => coin.item.data.price,
//   }
// ];

// const Page = () => {
//   return (
//     <main className="main-container">
//       <section className="home-grid">
//         <div id="coin-overview">
//           <div className="header pt-2">
//             <Image
//               src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
//               alt="bitcoin"
//               width={56}
//               height={56}
//             />
//             <div className="info">
//               <p>Bitcoin / BTC</p>
//               <h1>$89,113.0</h1>
//             </div>
//           </div>
//         </div>

//         <p>Trending Coins</p>
//         <DataTable
//           columns={[{ header: "Title" }, { header: "Price" }]}
//           data={[]}
//         />
//       </section>

//       <section className="w-full mt-7 space-y-4">
//         <p>Categories</p>
//       </section>
//     </main>
//   );
// };

// export default Page;


import DataTable from "@/components/DataTable";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { TrendingCoin } from "@/types";

const columns = [
  {
    header: "Title",
    cell: (coin: TrendingCoin) => {
      const item = coin.item;
      return (
        <Link href={`/coins/${item.id}`} className="flex items-center gap-3">
          <Image src={item.large} alt={item.name} width={36} height={36} />
          <p>{item.name}</p>
        </Link>
      );
    },
  },
  {
    header: "24h change",
    cell: (coin: TrendingCoin) => {
      const change = coin.item.data.price_change_percentage_24h.usd;
      const isUp = change > 0;

      return (
        <div
          className={cn(
            "price-change",
            isUp ? "text-green-500" : "text-red-500"
          )}
        >
          {isUp ? (
            <TrendingUp width={16} height={16} />
          ) : (
            <TrendingDown width={16} height={16} />
          )}
        </div>
      );
    },
  },
  {
    header: "Price",
    cell: (coin: TrendingCoin) =>
      `$${coin.item.data.price.toLocaleString()}`,
  },
];

const dummyTrendingCoins: TrendingCoin[] = [
  {
    item: {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "btc",
      market_cap_rank: 1,
      thumb: "",
      large:
        "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      data: {
        price: 89113,
        price_change_percentage_24h: { usd: 2.45 },
      },
    },
  },
  {
    item: {
      id: "ethereum",
      name: "Ethereum",
      symbol: "eth",
      market_cap_rank: 2,
      thumb: "",
      large:
        "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      data: {
        price: 4812,
        price_change_percentage_24h: { usd: -1.12 },
      },
    },
  },
  {
    item: {
      id: "solana",
      name: "Solana",
      symbol: "sol",
      market_cap_rank: 5,
      thumb: "",
      large:
        "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      data: {
        price: 198.34,
        price_change_percentage_24h: { usd: 4.78 },
      },
    },
  },
];

const Page = () => {
  return (
    <main className="main-container">
      <section className="home-grid">
        <div id="coin-overview">
          <div className="header pt-2">
            <Image
              src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
              alt="bitcoin"
              width={56}
              height={56}
            />
            <div className="info">
              <p>Bitcoin / BTC</p>
              <h1>$89,113.0</h1>
            </div>
          </div>
        </div>

        <p>Trending Coins</p>

        <DataTable
          columns={columns}
          data={dummyTrendingCoins}
          rowKey={(row) => row.item.id}
        />
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>Categories</p>
      </section>
    </main>
  );
};

export default Page;
