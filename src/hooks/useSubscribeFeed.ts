import {useRef, useState} from "react";

import {liveServices} from "@/lib/services/live.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";

export function useSubscribeFeed() {
  const localMediaRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const [isReceived, setIsReceived] = useState(false);

  const subscribeFeed = async (roomId: number, feedId: number) => {
    if (!roomId) {
      console.log("[SUBSCRIBE FEED]: No room ID");
      return;
    }

    if (!feedId) {
      console.log("[SUBSCRIBE FEED]: No feed ID");
      return;
    }

    try {
      // 1. Create handle for the feed
      const accessToken = await getAccessToken();
      const subscribeRes = await liveServices.subscribeFeed(
        accessToken,
        roomId,
        feedId,
      );
      const subscribeData = subscribeRes.data;
      if (subscribeRes.status !== 200 || !subscribeData.sdpOffer) {
        console.error("[SUBSCRIBE FEED]: Failed to subscribe feed");
        return;
      }

      // 2. Create peer connection with RTC servers
      const pcConfig = {
        iceServers: [
          {urls: "stun:stun.l.google.com:19302"},
          {urls: "stun:stun1.l.google.com:19302"},
          {urls: "stun:stun2.l.google.com:19302"},
        ],
        sdpSematics: "unified-plan",
        iceCandidatePoolSize: 10,
      };
      const pc = new RTCPeerConnection(pcConfig);
      pcRef.current = pc;

      // 2.1. Handle incoming tracks
      pc.ontrack = (event) => {
        const stream = event.streams[0];
        if (stream) {
          console.log(
            `[SUBSCRIBE FEED]: Stream ID - ${stream.id}, tracks - ${stream.getTracks().length}`,
          );
          localMediaRef.current = stream;
          setIsReceived(true);
        } else {
          console.log("[SUBSCRIBE FEED]: No stream in ontrack event");
        }
      };

      // 2.2. Set remote description with the offer from server
      const remoteDesc = new RTCSessionDescription({
        type: "offer",
        sdp: subscribeData.sdpOffer,
      });
      await pc.setRemoteDescription(remoteDesc);

      // 2.3. Create answer and send to server
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // 3. Handle ICE candidates
      const timeout = 10000;
      const sdp = await new Promise((resolve) => {
        if (pc.iceGatheringState === "complete") {
          resolve(pc.localDescription?.sdp);
          return;
        }

        let candidateCount = 0;

        const timeoutId = setTimeout(() => {
          console.log("[SUBSCRIBE FEED]: ICE gathering timeout");
          resolve(pc.localDescription?.sdp);
        }, timeout);

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            candidateCount++;
          } else {
            clearTimeout(timeoutId);
            console.log(
              `[SUBSCRIBE FEED]: ICE gathering complete with ${candidateCount} candidates`,
            );
            resolve(pc.localDescription?.sdp);
          }
        };

        pc.onicegatheringstatechange = () => {
          if (pc.iceGatheringState === "complete") {
            clearTimeout(timeoutId);
            resolve(pc.localDescription?.sdp);
          }
        };
      });

      // 4. Send SDP answer to server
      console.log("[SUBSCRIBE FEED]: Creating SDP answer...");

      const response = await liveServices.startSubscribe(
        accessToken,
        subscribeData.sessionId!,
        subscribeData.handleId!,
        sdp as string,
      );

      const data = response.data;
      if (data.error) {
        throw new Error(data.error);
      }

      return;
    } catch (error) {
      console.error("[SUBSCRIBE FEED]: Error subscribing feed", error);
      setIsReceived(false);
    }
  };

  return {
    subscribeFeed,
    isReceived,
    remoteStream: localMediaRef,
  };
}
