import { useState, useEffect } from "react";
import io from "socket.io-client";
import { getOrderbookData } from "../domain";
import styled from "styled-components";
import { ActiveOrdersHeaders, Order } from "./Order";
import { EOrderStatus, IOrder, EOrderType } from "../domain/types";

let socket = null;

const Orderbook: React.FC<{ ownerId: number }> = ({ ownerId }) => {
  const [orders, setOrders] =
    useState<{ [key in EOrderStatus]: IOrder[] }>(null);
  const [activeClients, setActiveClients] = useState([]);

  useEffect(() => {
    const initializeWebsocketConnection = async () => {
      await fetch("/api/market/socketio");

      socket = io({
        path: "/api/market/socketio/ping",
      });

      socket.on("connected-client-new", (message) => {
        setOrders(getOrderbookData(message.orders));
        setActiveClients(message.connectedClients);
      });

      socket.on("connected-clients-update", (activeClientsUpdated) => {
        setActiveClients(activeClientsUpdated);
      });

      socket.on("orders-updated", (updatedOrders) => {
        setOrders(getOrderbookData(updatedOrders));
      });
    };

    initializeWebsocketConnection();

    return () => {
      socket?.disconnect();
    };
  }, []);

  if (!orders) {
    return null;
  }

  return (
    <section>
      <p>Active clients: {activeClients.length}</p>
      <StatusSctionHeaderStyled>Active Orders</StatusSctionHeaderStyled>
      <ActiveOrdersContainerStyled>
        <SectionHeaderStyled>BUYS</SectionHeaderStyled>
        <SectionHeaderStyled>SELLS</SectionHeaderStyled>
      </ActiveOrdersContainerStyled>
      <ActiveOrdersContainerStyled>
        <FlexColumnStyled>
          <ActiveOrdersHeaders isOpenOrdersSection />
          {orders[EOrderType.BUY].map((o) => (
            <Order key={o.id} order={o} isOwner={ownerId === o.ownerId} />
          ))}
        </FlexColumnStyled>
        <DividerStyled />
        <FlexColumnStyled>
          <ActiveOrdersHeaders isOpenOrdersSection />
          {orders[EOrderType.SELL].map((o) => (
            <Order key={o.id} order={o} isOwner={ownerId === o.ownerId} />
          ))}
        </FlexColumnStyled>
      </ActiveOrdersContainerStyled>
      <StatusSctionHeaderStyled>Fulfilled Orders</StatusSctionHeaderStyled>
      <ActiveOrdersHeaders />
      {orders[EOrderStatus.FULFILLED].map((o) => (
        <Order
          key={o.id}
          order={o}
          keysToDisplay={["id", "symbol", "price", "type"]}
        />
      ))}
      <StatusSctionHeaderStyled>Cancelled Orders</StatusSctionHeaderStyled>
      <ActiveOrdersHeaders />
      {orders[EOrderStatus.CANCELLED].map((o) => (
        <Order
          key={o.id}
          order={o}
          keysToDisplay={["id", "symbol", "price", "type"]}
        />
      ))}
    </section>
  );
};

export default Orderbook;

const SectionHeaderStyled = styled.h3({
  textAlign: "center",
  width: "100%",
});

const StatusSctionHeaderStyled = styled.h2({
  textDecoration: "underline",
});

const DividerStyled = styled.div({
  width: 2,
  backgroundColor: "grey",
});

const ActiveOrdersContainerStyled = styled.div({
  display: "flex",
  justifyContent: "center",
  gap: 50,
});

const FlexColumnStyled = styled.div({
  display: "flex",
  flexDirection: "column",
});
