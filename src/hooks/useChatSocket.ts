import {useRef, useCallback} from "react";
import {Client, IMessage, StompSubscription} from "@stomp/stompjs";
import SockJS from "sockjs-client";

import {ChatMessage, ChatMessageType} from "@/types";

export function useChatSocket() {
  const localClientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());
  const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

  // Memoize connect to avoid create multiple connections on re-render
  const connect = useCallback(
    (
      accessToken: string,
      onConnected?: () => void,
      onError?: (error: any) => void,
    ) => {
      if (localClientRef.current?.connected) {
        console.log("WebSocket already connected");
        if (onConnected) onConnected();
        return;
      }

      const socket = new SockJS(`${BASE_API}/ws`);

      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("WebSocket connected");
          if (onConnected) onConnected();
        },
        onStompError: (frame: any) => {
          console.error("STOMP error:", frame);
          if (onError) onError(frame);
        },
        onWebSocketError: (error: any) => {
          console.error("WebSocket error:", error);
          if (onError) onError(error);
        },
        onDisconnect: () => {
          console.log("WebSocket disconnected");
          subscriptionsRef.current.clear();
        },
      });

      localClientRef.current = client;
      localClientRef.current.activate();
    },
    [BASE_API],
  );

  const disconnect = useCallback(() => {
    if (localClientRef.current) {
      subscriptionsRef.current.forEach((subscription) => {
        subscription.unsubscribe();
      });
      subscriptionsRef.current.clear();

      localClientRef.current.deactivate();
      localClientRef.current = null;
      console.log("WebSocket disconnected and cleaned up");
    }
  }, []);

  const subscribeToSession = useCallback(
    (sessionId: string, callback: (msg: ChatMessage) => void) => {
      if (!localClientRef.current || !localClientRef.current.connected) {
        console.error("WebSocket is not connected");
        return;
      }

      const destination = `/topic/session/${sessionId}`;

      if (subscriptionsRef.current.has(destination)) {
        console.log(`Unsubscribing previous subscription to ${destination}`);
        subscriptionsRef.current.get(destination)?.unsubscribe();
      }

      const subscription = localClientRef.current.subscribe(
        destination,
        (message: IMessage) => {
          try {
            const chatMessage: ChatMessage = JSON.parse(message.body);
            callback(chatMessage);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        },
      );
      subscriptionsRef.current.set(destination, subscription);
      console.log(`Subscribed to ${destination}`);
    },
    [],
  );

  const unsubscribeFromSession = useCallback((sessionId: string) => {
    const destination = `/topic/session/${sessionId}`;
    const subscription = subscriptionsRef.current.get(destination);

    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(destination);
      console.log(`Unsubscribed from ${destination}`);
    }
  }, []);

  const addUser = useCallback((sessionId: string, username: string) => {
    if (!localClientRef.current || !localClientRef.current.connected) {
      console.error("WebSocket is not connected");
      return;
    }

    const msg: ChatMessage = {
      type: ChatMessageType.JOIN,
      sender: username,
      content: `${username} joined`,
    };

    localClientRef.current.publish({
      destination: `/app/chat.addUser/${sessionId}`,
      body: JSON.stringify(msg),
    });
  }, []);

  const sendMessage = useCallback(
    (sessionId: string, sender: string, content: string) => {
      console.log(localClientRef.current);
      if (!localClientRef.current || !localClientRef.current.connected) {
        console.error("WebSocket is not connected");
        return;
      }

      const msg: ChatMessage = {
        type: ChatMessageType.CHAT,
        sender,
        content,
      };

      localClientRef.current.publish({
        destination: `/app/chat.sendMessage/${sessionId}`,
        body: JSON.stringify(msg),
      });
    },
    [],
  );

  const raiseHand = useCallback((sessionId: string, sender: string) => {
    if (!localClientRef.current || !localClientRef.current.connected) {
      console.error("WebSocket is not connected");
      return;
    }

    const msg: ChatMessage = {
      type: ChatMessageType.RAISE_HAND,
      sender,
      content: `${sender} raised hand`,
    };

    localClientRef.current.publish({
      destination: `/app/chat.raiseHand/${sessionId}`,
      body: JSON.stringify(msg),
    });
  }, []);

  const lowerHand = useCallback((sessionId: string, sender: string) => {
    if (!localClientRef.current || !localClientRef.current.connected) {
      console.error("WebSocket is not connected");
      return;
    }

    const msg: ChatMessage = {
      type: ChatMessageType.LOWER_HAND,
      sender,
      content: `${sender} lower hand`,
    };

    localClientRef.current.publish({
      destination: `/app/chat.lowerHand/${sessionId}`,
      body: JSON.stringify(msg),
    });
  }, []);

  const isConnected = useCallback(() => {
    return localClientRef.current?.connected ?? false;
  }, []);

  return {
    connect,
    disconnect,
    subscribeToSession,
    unsubscribeFromSession,
    sendMessage,
    raiseHand,
    lowerHand,
    addUser,
    isConnected,
  };
}
