import {
  JanusResponse,
  LiveSession,
  PublishRequest,
  PublishResponse,
} from "@/types";
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

  async leaveRoom(accessToken: string, roomId: number) {
    const response = await axios.post(
      BASE_API + `/leave/${roomId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
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
    sessionId: number,
  ): Promise<AxiosResponse<JanusResponse>> {
    const response = await axios.post(
      BASE_API + `/keepalive/${sessionId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async getParticipants(accessToken: string, roomId: number) {
    const response = await axios.get(BASE_API + `/participants/${roomId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  },

  async publishMedia(
    accessToken: string,
    request: PublishRequest,
  ): Promise<AxiosResponse<PublishResponse>> {
    const response = await axios.post(
      BASE_API + `/publish`,
      {...request},
      {
        headers: {Authorization: `Bearer ${accessToken}`},
      },
    );
    return response;
  },

  async publishScreen(
    accessToken: string,
    request: PublishRequest,
  ): Promise<AxiosResponse<PublishResponse>> {
    const response = await axios.post(
      BASE_API + `/publish-screen`,
      {...request},
      {
        headers: {Authorization: `Bearer ${accessToken}`},
      },
    );
    return response;
  },

  async unpublishMedia(
    accessToken: string,
    roomId: number,
  ): Promise<AxiosResponse<JanusResponse>> {
    const response = await axios.post(
      BASE_API + `/unpublish/${roomId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async unPublishScreen(
    accessToken: string,
    roomId: number,
  ): Promise<AxiosResponse<JanusResponse>> {
    const response = await axios.post(
      BASE_API + `/unpublish-screen/${roomId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async subscribeFeed(
    accessToken: string,
    roomId: number,
    feedId: number,
  ): Promise<AxiosResponse<PublishResponse>> {
    const response = await axios.post(
      BASE_API + `/subscribe`,
      {
        roomId: roomId,
        feedId: feedId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async startSubscribe(
    accessToken: string,
    sessionId: number,
    handleId: number,
    sdpAnswer: string,
  ): Promise<AxiosResponse<JanusResponse>> {
    const response = await axios.post(
      BASE_API + `/start-subscriber`,
      {
        sessionId: sessionId,
        handleId: handleId,
        sdpAnswer: sdpAnswer,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },
};
