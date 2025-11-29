import {useRef, useState} from "react";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {liveServices} from "@/lib/services/live.services";

export function usePublishMedia() {
  const localMediaRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMediaPublished, setIsMediaPublished] = useState(false);

  const publishMedia = async (roomId: number) => {
    if (!roomId) {
      console.log("[PUBLISH MEDIA]: No room ID");
      return;
    }

    if (pcRef.current) {
      console.log("[PUBLISH MEDIA]: Already publishing media");
      return;
    }

    try {
      // 1. Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localMediaRef.current = stream;
      setIsMediaPublished(true);

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
        console.log("[PUBLISH MEDIA]: Gathering ICE candidates...");

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            // Send candidate to server
            console.log(
              `ICE candidate: ${event.candidate.type} - ${event.candidate.address || event.candidate.candidate}`,
            );
          } else {
            console.log("[PUBLISH MEDIA]: ICE gathering complete");
          }
        };

        await new Promise((resolve) => {
          const checkState = () => {
            if (pc.iceGatheringState === "complete") {
              console.log("[PUBLISH MEDIA]: ICE gathering complete");
              resolve(true);
            }
          };

          pc.addEventListener("icegatheringstatechange", checkState);

          setTimeout(() => {
            pc.removeEventListener("icegatheringstatechange", checkState);
            console.log("[PUBLISH MEDIA]: ICE gathering timeout");
            resolve(true);
          }, 5000);
        });
      } else {
        console.log("[PUBLISH MEDIA]: ICE gathering already complete");
      }

      // 6. Update SDP with gathered ICE candidates
      const finalOffer = pc.localDescription;
      console.log("[PUBLISH MEDIA]: Publishing media");

      const accessToken = await getAccessToken();
      const response = await liveServices.publishMedia(accessToken, {
        roomId,
        sdp: finalOffer?.sdp,
        streamType: "media",
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
      console.error("[PUBLISH MEDIA]: Error publishing media", error);
      setIsMediaPublished(false);
    }
  };

  const toggleCam = () => {
    const stream = localMediaRef.current;
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCamOn(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    const stream = localMediaRef.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const unpublishMedia = async (roomId: number) => {
    if (!roomId) {
      console.log("[UNPUBLISH MEDIA]: No room ID");
      return;
    }

    try {
      // 1. Shut down all local media tracks
      if (localMediaRef.current) {
        localMediaRef.current.getTracks().forEach((track) => track.stop());
        localMediaRef.current = null;
      }

      // 2. Stop track sending and close peer connection
      if (pcRef.current) {
        pcRef.current.getSenders().forEach((sender) => {
          pcRef.current?.removeTrack(sender);
        });
        pcRef.current.close();
        pcRef.current = null;
      }

      // 3. Notify server to unpublish media
      const accessToken = await getAccessToken();
      const response = await liveServices.unpublishMedia(accessToken, roomId);
      const data = response.data;
      if (data.error) {
        throw new Error(data.error);
      }

      return;
    } catch (error) {
      console.error("[UNPUBLISH MEDIA]: Error unpublishing media", error);
    }
  };

  return {
    publishMedia,
    isCamOn,
    isMicOn,
    isMediaPublished,
    localMediaStream: localMediaRef,
    toggleCam,
    toggleMic,
    unpublishMedia,
  };
}
