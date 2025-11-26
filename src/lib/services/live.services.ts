import {JanusResponse, LiveSession} from "@/types";
import axios, {AxiosResponse} from "axios";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1/live";

export const liveServices = {
  async startLive(
    accessToken: string,
    batchId: string,
    title?: string,
    description?: string,
  ): Promise<AxiosResponse<LiveSession>> {
    const response = await axios.post(
      BASE_API + `/start`,
      {
        batchId: batchId,
        title: title || "",
        description: description || "",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async joinRoom(
    accessToken: string,
    roomId: number,
    displayName: string,
  ): Promise<AxiosResponse<JanusResponse>> {
    const response = await axios.post(
      BASE_API + `/join`,
      {
        roomId: roomId,
        ptype: "publisher",
        displayName: displayName,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async getRoomStatus(
    accessToken: string,
    roomId: number,
  ): Promise<AxiosResponse<LiveSession>> {
    const response = await axios.get(BASE_API + `/status/${roomId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  },

  async endRoom(
    accessToken: string,
    roomId: number,
  ): Promise<AxiosResponse<LiveSession>> {
    const response = await axios.post(
      BASE_API + `/end/${roomId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async keepAlive(
    accessToken: string,
    sessionId: string,
  ): Promise<JanusResponse> {
    const response = await axios.post(
      BASE_API + `/keepalive/${sessionId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async getParticipants(accessToken: string, roomId: number) {
    const response = await axios.get(BASE_API + `/participants/${roomId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};
