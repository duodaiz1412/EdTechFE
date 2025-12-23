import {useRef, useState} from "react";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {liveServices} from "@/lib/services/live.services";

export function usePublishMedia() {
  const localMediaRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const sessionIdRef = useRef<number>();
  const handleIdRef = useRef<number>();

  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMediaPublished, setIsMediaPublished] = useState(false);

  const publishMedia = async (
    roomId: number,
    sessionId: number,
    setSessionId: (value: number) => void,
  ) => {
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
        video: {
          width: {ideal: 640},
          height: {ideal: 480},
        },
        audio: true,
      });
      localMediaRef.current = stream;
      setIsMediaPublished(true);

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
      const timeout = 10000;
      const sdp = await new Promise((resolve) => {
        if (pc.iceGatheringState === "complete") {
          resolve(pc.localDescription?.sdp);
          return;
        }

        let candidateCount = 0;

        const timeoutId = setTimeout(() => {
          console.log("[PUBLISH MEDIA]: ICE gathering timeout");
          resolve(pc.localDescription?.sdp);
        }, timeout);

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            candidateCount++;
          } else {
            clearTimeout(timeoutId);
            console.log(
              `[PUBLISH MEDIA]: ICE gathering complete with ${candidateCount} candidates`,
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
      console.log("[PUBLISH MEDIA]: Publishing media");

      const accessToken = await getAccessToken();
      const response = await liveServices.publishMedia(accessToken, {
        roomId,
        sdp: sdp as string,
        streamType: "camera",
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
        console.log("[PUBLISH MEDIA]: Media published successfully");
      } else {
        throw new Error(data.error || "No SDP answer from server");
      }

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
      // 1. Notify server to unpublish media
      const accessToken = await getAccessToken();
      const response = await liveServices.unpublishMedia(
        accessToken,
        roomId,
        sessionIdRef.current,
        handleIdRef.current,
      );
      const data = response.data;
      if (data.error) {
        throw new Error(data.error);
      }

      // 2. Shut down all local media tracks
      if (localMediaRef.current) {
        localMediaRef.current.getTracks().forEach((track) => track.stop());
        localMediaRef.current = null;
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
      setIsMediaPublished(false);

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
