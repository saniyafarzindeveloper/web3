export const dynamic = "force-dynamic";

import { fetcher } from "@/lib/coingecko.actions";
import DataTable from "@/components/DataTable";
import Image from "next/image";
import Link from "next/link";
import CoinsPagination from "@/components/CoinsPagination";

import { cn, formatPercentage, formatCurrency } from "../../lib/utils";

const Coins = async ({ searchParams }: NextPageProps) => {

//Takeaway (worth remembering)

// If something:

// works in the URL

// updates visually

// but data never changes

// suspect destructuring first.
 const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const perPage = 10;

  const estimatedTotalPages =
    currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;
  //If we’re before page 100, assume 100 pages.
  // If we go past 100, keep increasing the estimate in steps of 100, always staying one step ahead - a sliding window function
  const coinsData = await fetcher<CoinMarketData[]>("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: perPage,
    page: currentPage,
    sparkline: "false",
    price_change_percentage: "24h",
  });

  // console.log("coins data",coinsData)
  const hasMorePages = coinsData.length === perPage;

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: "Rank",
      cellClassName: "rank-cell",
      cell: (coin) => (
        <>
          #{coin.market_cap_rank}
          <Link href={`/coins/${coin.id}`} aria-label="View coin" />
        </>
      ),
    },
    {
      header: "Token",
      cellClassName: "token-cell",
      cell: (coin) => (
        <div className="token-info">
          <Image src={coin.image} alt={coin.name} width={36} height={36} />
          <p>
            {coin.name} ({coin.symbol.toUpperCase()})
          </p>
        </div>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (coin) => formatCurrency(coin.current_price),
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: (coin) => {
        const isTrendingUp = coin.price_change_percentage_24h > 0;

        return (
          <span
            className={cn("change-value", {
              "text-green-600": isTrendingUp,
              "text-red-500": !isTrendingUp,
            })}
          >
            {isTrendingUp && "+"}
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        );
      },
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: (coin) => formatCurrency(coin.market_cap),
    },
  ];

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>

        <DataTable
          tableClassName="coins-table"
          columns={columns}
          data={coinsData}
          rowKey={(coin) => coin.id}
        />
        <CoinsPagination
          currentPage={currentPage}
          hasMorePages={hasMorePages}
          totalPages={estimatedTotalPages}
        />
      </div>
    </main>
  );
};

export default Coins;
