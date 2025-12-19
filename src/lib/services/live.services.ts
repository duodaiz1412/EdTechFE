import axios, {AxiosResponse} from "axios";

import {
  BatchRecordResponse,
  ChunkUploadResponse,
  CompleteRecordResponse,
  JanusResponse,
  LiveSession,
  PublishRequest,
  PublishResponse,
} from "@/types";
import {config} from "@/config";

const BASE_API = config.BASE_API + "/api/v1/live";

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
    const response = await axios.get(
      BASE_API + `/participants-names/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async getPublishers(accessToken: string, roomId: number) {
    const response = await axios.get(
      BASE_API + `/participants-feeds/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
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
    sessionId?: number,
    handleId?: number,
  ): Promise<AxiosResponse<JanusResponse>> {
    const response = await axios.post(
      BASE_API + `/unpublish`,
      {
        roomId: roomId,
        sessionId: sessionId,
        handleId: handleId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async unpublishScreen(
    accessToken: string,
    roomId: number,
    sessionId?: number,
    handleId?: number,
  ): Promise<AxiosResponse<JanusResponse>> {
    const response = await axios.post(
      BASE_API + `/unpublish-screen`,
      {
        roomId: roomId,
        sessionId: sessionId,
        handleId: handleId,
      },
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

  async uploadChunk(
    accessToken: string,
    roomId: number,
    blob: Blob,
    chunkIndex: number,
    duration: number,
  ): Promise<AxiosResponse<ChunkUploadResponse>> {
    const formData = new FormData();
    formData.append(
      "file",
      blob,
      `chunk-${String(chunkIndex).padStart(3, "0")}.webm`,
    );

    const response = await axios.post(
      BASE_API +
        `/recording/upload-chunk?roomId=${roomId}&chunkIndex=${chunkIndex}&duration=${duration}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async completeRecord(
    accessToken: string,
    roomId: number,
    totalChunks: number,
    totalDurationSeconds: number,
  ): Promise<AxiosResponse<CompleteRecordResponse>> {
    const response = await axios.post(
      BASE_API + `/recording/complete`,
      {
        roomId: roomId,
        totalChunks: totalChunks,
        totalDurationSeconds: totalDurationSeconds,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async getListRecords(
    accessToken: string,
    batchId: string,
  ): Promise<AxiosResponse<BatchRecordResponse>> {
    const response = await axios.get(
      BASE_API + `/batches/${batchId}/recordings`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },
};
