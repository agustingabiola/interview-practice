import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { IOrder } from "../domain/types";
import { getColumnHeaders } from "../domain";

export const Order: React.FC<{
  order: IOrder;
  keysToDisplay?: string[];
  isOwner?: boolean;
}> = ({
  order,
  keysToDisplay = ["symbol", "quantity", "price"],
  isOwner = false,
}) => {
  const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);

  const cancelOrder = useCallback(async () => {
    setIsDeletingOrder(true);

    await fetch(`/api/market/${order.id}`, { method: "DELETE" });

    setIsDeletingOrder(false);
  }, [order]);

  return (
    <GridContainer $columns={keysToDisplay.length}>
      {keysToDisplay.map((attr, idx) => (
        <OrderGridColumn key={idx} $isNumber={Number.isFinite(order[attr])}>
          {order[attr]}
        </OrderGridColumn>
      ))}
      {isOwner ? (
        <CancelButtonStyled disabled={isDeletingOrder} onClick={cancelOrder}>
          X
        </CancelButtonStyled>
      ) : null}
    </GridContainer>
  );
};

export const ActiveOrdersHeaders: React.FC<{
  isOpenOrdersSection?: boolean;
}> = ({ isOpenOrdersSection = false }) => {
  const columnHeaders = useMemo(
    () => getColumnHeaders(isOpenOrdersSection),
    [isOpenOrdersSection]
  );

  return (
    <GridContainer $columns={columnHeaders.length}>
      {columnHeaders.map((h, idx) => (
        <ColumnHeaderStyled key={idx} $side={h.alignment}>
          {h.label}
        </ColumnHeaderStyled>
      ))}
    </GridContainer>
  );
};

const GridContainer = styled.div<{ $columns: number }>(({ $columns }) => ({
  display: "grid",
  gap: 12,
  gridTemplateColumns: `repeat(${$columns + 1}, 1fr)`,
  padding: "8px 0px",
  maxWidth: 400,
}));

const OrderGridColumn = styled.span<{ $isNumber: boolean }>(
  ({ $isNumber }) => ({
    display: "block",
    textAlign: $isNumber ? "right" : "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  })
);

const ColumnHeaderStyled = styled.span<{ $side: "left" | "right" }>(
  ({ $side }) => ({
    fontWeight: "bold",
    textAlign: $side,
  })
);

const CancelButtonStyled = styled.button(() => ({
  cursor: "pointer",
}));
