import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import DataTable from "@/components/DataTable";

const TrendingCoins = async () => {
  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: "Title",
      cellClassName: "name-cell",
      cell: (coin) => {
        const item = coin.item;
        return (
          <Link href={`/coins/${item.id}`}>
            <Image src={item.large} alt={item.name} width={36} height={36} />
            <p>{item.name}</p>
          </Link>
        );
      },
    },
    {
      header: "24h change",
      cellClassName: "name-cell",
      cell: (coin) => {
        const item = coin.item;
        const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;
        return (
          <div
            className={cn(
              "price-change",
              isTrendingUp ? "text-green-500" : "text-red-500"
            )}
          >
            <p>
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (coin) => coin.item.data.price,
    },
  ];

  const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
    "/search/trending",
    undefined,
    300
  ); //passing 3 params - URL/endpoint, params, revalidate
  return (
    <>
      <p>Trending Coins</p>
      <div id="trending-coins">
        <DataTable
          columns={columns}
          rowKey={(coin) => coin.item.id}
          tableClassName="trending-coins-table"
          data={trendingCoins}
        />
      </div>
    </>
  );
};

export default TrendingCoins;
