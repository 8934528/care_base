import * as signalR from "@microsoft/signalr";

const API_BASE = "http://localhost:5076";

export const queueConnection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_BASE}/queueHub`, {
    accessTokenFactory: () => localStorage.getItem("token") ?? "",
  })
  .withAutomaticReconnect()
  .build();
