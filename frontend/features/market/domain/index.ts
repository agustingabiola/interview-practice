import { IOrder, EOrderStatus, EOrderType } from "./types";

export const MARKET_TICKER_SYMBOLS = ["APPL", "YHOO", "ADDYY"];

export const getOrderbookData = (ordersArr: IOrder[]) => {
  const ordersByStatus = ordersArr.reduce(
    (acc, order) => {
      if (order.status === EOrderStatus.OPEN) {
        acc[order.type].push(order);
      } else {
        acc[order.status].push(order);
      }

      return acc;
    },
    {
      [EOrderType.BUY]: [],
      [EOrderType.SELL]: [],
      [EOrderStatus.FULFILLED]: [],
      [EOrderStatus.CANCELLED]: [],
    } as { [key in EOrderStatus | EOrderType]: IOrder[] }
  );

  return ordersByStatus;
};

export const getColumnHeaders = (
  isOpenOrder
): {
  label: string;
  alignment: "left" | "right";
}[] =>
  isOpenOrder
    ? [
        { label: "Symbol", alignment: "left" },
        { label: "Quantity", alignment: "right" },
        { label: "Price", alignment: "right" },
      ]
    : [
        { label: "ID", alignment: "left" },
        { label: "Symbol", alignment: "left" },
        { label: "Quantity", alignment: "right" },
        { label: "Type", alignment: "left" },
      ];
