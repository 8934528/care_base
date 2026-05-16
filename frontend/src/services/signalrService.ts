import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5000"; // Adjust based on your backend port

export const queueConnection = new signalR.HubConnectionBuilder()
  .withUrl(`${BASE_URL}/queueHub`, {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets
  })
  .withAutomaticReconnect()
  .build();
