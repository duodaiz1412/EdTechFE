import {useRef, useState} from "react";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {liveServices} from "@/lib/services/live.services";

export function usePublishScreen() {
  const localScreenRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const sessionIdRef = useRef<number>();
  const handleIdRef = useRef<number>();

  const [isScreenPublished, setIsScreenPublished] = useState(false);

  const publishScreen = async (
    roomId: number,
    sessionId: number,
    setSessionId: (value: number) => void,
  ) => {
    if (!roomId) {
      console.log("[PUBLISH SCREEN]: No room ID");
      return;
    }

    if (pcRef.current) {
      console.log("[PUBLISH SCREEN]: Already publishing screen");
      return;
    }

    try {
      // 1.1. Get local screen stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: {ideal: 640},
          height: {ideal: 480},
          frameRate: {ideal: 30},
        },
        audio: false,
      });
      localScreenRef.current = stream;
      setIsScreenPublished(true);

      // 1.2. Handle user stopping screen share from browser UI
      stream.getVideoTracks()[0].onended = () => {
        console.log("[PUBLISH SCREEN]: User stopped screen sharing");
        unpublishScreen(roomId);
      };

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

      // 3. Add local tracks to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // 4. Create offer and send to server
      const offerOptions = {
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
        iceRestart: false,
      };
      const offer = await pc.createOffer(offerOptions);
      await pc.setLocalDescription(offer);

      // 5. Handle ICE candidates
      const timeout = 15000;
      const sdp = await new Promise((resolve) => {
        if (pc.iceGatheringState === "complete") {
          resolve(pc.localDescription?.sdp);
          return;
        }

        let candidateCount = 0;

        const timeoutId = setTimeout(() => {
          console.log("[PUBLISH SCREEN]: ICE gathering timeout");
          resolve(pc.localDescription?.sdp);
        }, timeout);

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            candidateCount++;
          } else {
            clearTimeout(timeoutId);
            console.log(
              `[PUBLISH SCREEN]: ICE gathering complete with ${candidateCount} candidates`,
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

      // 6. Update SDP with gathered ICE candidates
      console.log("[PUBLISH SCREEN]: Publishing screen");

      const accessToken = await getAccessToken();
      const response = await liveServices.publishScreen(accessToken, {
        roomId,
        sdp: sdp as string,
      });

      const data = response.data;
      if (!data.error && data.sdpAnswer) {
        if (data.sessionId) {
          setSessionId(data.sessionId);
          sessionIdRef.current = data.sessionId;
        } else {
          sessionIdRef.current = sessionId;
        }

        if (data.handleId) {
          handleIdRef.current = data.handleId;
        }

        await pc.setRemoteDescription({
          type: "answer",
          sdp: data.sdpAnswer,
        });
        console.log("[PUBLISH SCREEN]: Media published successfully");
      } else {
        throw new Error(data.error || "No SDP answer from server");
      }

      return;
    } catch (error) {
      console.error("[PUBLISH SCREEN]: Error publishing screen", error);
      setIsScreenPublished(false);
    }
  };

  const unpublishScreen = async (roomId: number) => {
    if (!roomId) {
      console.log("[UNPUBLISH SCREEN]: No room ID");
      return;
    }

    try {
      // 1. Notify server to unpublish
      const accessToken = await getAccessToken();
      const response = await liveServices.unpublishScreen(
        accessToken,
        roomId,
        sessionIdRef.current,
        handleIdRef.current,
      );
      const data = response.data;
      if (data.error) {
        throw new Error(data.error);
      }

      // 2. Shut down local stream tracks
      if (localScreenRef.current) {
        localScreenRef.current.getTracks().forEach((track) => track.stop());
        localScreenRef.current = null;
      }

      // 3. Stop track sending and close peer connection
      if (pcRef.current) {
        // pcRef.current.getSenders().forEach((sender) => {
        //   pcRef.current?.removeTrack(sender);
        // });
        pcRef.current.close();
        pcRef.current = null;
      }

      // 4. Reset states
      sessionIdRef.current = undefined;
      handleIdRef.current = undefined;
      setIsScreenPublished(false);

      return;
    } catch (error) {
      console.error("[UNPUBLISH SCREEN]: Error unpublishing screen", error);
    }
  };

  return {
    publishScreen,
    localScreenStream: localScreenRef,
    isScreenPublished,
    unpublishScreen,
  };
}
