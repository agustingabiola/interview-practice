import { useCallback } from "react";
import Orderbook from "./components/Orderbook";
import { MARKET_TICKER_SYMBOLS } from "./domain";
import { EOrderType, EOrderStatus } from "./domain/types";

const ownerId = Math.floor(Math.random() * 666);

const MarketDemo = () => {
  const generateRandomOrders = useCallback(() => {
    Array(4)
      .fill("")
      .map(() => {
        fetch("/api/market", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerId,
            price: Math.floor(Math.random() * 10) + 1,
            quantity: Math.floor(Math.random() * 10) + 1,
            symbol: MARKET_TICKER_SYMBOLS[Math.floor(Math.random() * 3)],
            type: [EOrderType.SELL, EOrderType.BUY][
              Math.floor(Math.random() * 2)
            ],
            status: EOrderStatus.OPEN,
          }),
        });
      });
  }, []);

  return (
    <>
      <button onClick={generateRandomOrders}>Generate 4 Random Orders</button>
      <Orderbook ownerId={ownerId} />
    </>
  );
};

export default MarketDemo;
