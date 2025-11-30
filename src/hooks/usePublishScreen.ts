import {useRef, useState} from "react";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {liveServices} from "@/lib/services/live.services";

export function usePublishScreen() {
  const localScreenRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const [isScreenPublished, setIsScreenPublished] = useState(false);

  const publishScreen = async (roomId: number) => {
    if (!roomId) {
      console.log("[PUBLISH SCREEN]: No room ID");
      return;
    }

    if (pcRef.current) {
      console.log("[PUBLISH SCREEN]: Already publishing screen");
      return;
    }

    try {
      // 1. Get local screen stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      localScreenRef.current = stream;
      setIsScreenPublished(true);

      // 2. Create peer connection with RTC servers
      const pcConfig = {
        iceServers: [
          {urls: "stun:stun.l.google.com:19302"},
          {urls: "stun:stun1.l.google.com:19302"},
        ],
      };
      const pc = new RTCPeerConnection(pcConfig);
      pcRef.current = pc;

      // 3. Add local tracks to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // 4. Create offer and send to server
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 5. Handle ICE candidates
      if (pc.iceGatheringState !== "complete") {
        console.log("[PUBLISH SCREEN]: Gathering ICE candidates...");

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            // Send candidate to server
            console.log(
              `ICE candidate: ${event.candidate.type} - ${event.candidate.address || event.candidate.candidate}`,
            );
          } else {
            console.log("[PUBLISH SCREEN]: ICE gathering complete");
          }
        };

        await new Promise((resolve) => {
          const checkState = () => {
            if (pc.iceGatheringState === "complete") {
              console.log("[PUBLISH SCREEN]: ICE gathering complete");
              resolve(true);
            }
          };

          pc.addEventListener("icegatheringstatechange", checkState);

          setTimeout(() => {
            pc.removeEventListener("icegatheringstatechange", checkState);
            console.log("[PUBLISH SCREEN]: ICE gathering timeout");
            resolve(true);
          }, 5000);
        });
      } else {
        console.log("[PUBLISH SCREEN]: ICE gathering already complete");
      }

      // 6. Update SDP with gathered ICE candidates
      const finalOffer = pc.localDescription;
      console.log("[PUBLISH MEDIA]: Publishing media");

      const accessToken = await getAccessToken();
      const response = await liveServices.publishScreen(accessToken, {
        roomId,
        sdp: finalOffer?.sdp,
      });
      const data = response.data;
      if (data.error) {
        throw new Error(data.error);
      }

      await pc.setRemoteDescription({
        type: "answer",
        sdp: data.sdpAnswer,
      });

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
      setIsScreenPublished(false);

      // 1. Shut down local stream tracks
      if (localScreenRef.current) {
        localScreenRef.current.getTracks().forEach((track) => track.stop());
        localScreenRef.current = null;
      }

      // 2. Stop track sending and close peer connection
      if (pcRef.current) {
        pcRef.current.getSenders().forEach((sender) => {
          pcRef.current?.removeTrack(sender);
        });
        pcRef.current.close();
        pcRef.current = null;
      }

      // 3. Notify server to unpublish
      const accessToken = await getAccessToken();
      const response = await liveServices.unPublishScreen(accessToken, roomId);
      const data = response.data;
      if (data.error) {
        throw new Error(data.error);
      }

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
