/**
 * PlayerPage.jsx — Acts as a physical digital screen.
 * Route: /player/:screenCode
 *
 * - Connects via Socket.io using screenCode
 * - Fetches and plays assigned playlist
 * - Sends heartbeat every 10s to stay Online
 * - Updates instantly when admin changes playlist
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { incrementPlayCount } from "../../services/api";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const HEARTBEAT_MS = 10000; // every 10 seconds

function PlayerPage() {
  const { screenCode } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenName, setScreenName] = useState("");
  const [status, setStatus] = useState("connecting");

  const socketRef = useRef(null);
  const videoRef = useRef(null);
  const heartbeatRef = useRef(null);
  const lastTrackedPlayRef = useRef("");

  // Fetch screen data by screenCode
  const fetchScreen = useCallback(async () => {
    try {
      const res = await fetch(`${SOCKET_URL}/api/screens/code/${screenCode}`);
      const data = await res.json();

      if (!data._id) { setStatus("error"); return; }

      setScreenName(data.name);

      if (data.playlist?.ads?.length > 0) {
        setPlaylist(data.playlist);
        setCurrentIndex(0);
        setStatus("playing");
      } else {
        setStatus("waiting");
      }
    } catch (err) {
      console.error("Failed to fetch screen:", err);
      setStatus("error");
    }
  }, [screenCode]);

  // Socket + heartbeat setup 
  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      fetchScreen();
    }, 0);

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      // Join screen room using screenCode
      socket.emit("join-screen", screenCode);

      // Send heartbeat every 10s to stay Online
      heartbeatRef.current = setInterval(() => {
        socket.emit("heartbeat", screenCode);
      }, HEARTBEAT_MS);
    });

    // Backend confirmed connection — get screen info
    socket.on("connected", ({ screenName, playlist }) => {
      if (screenName) setScreenName(screenName);

      // Some backends send only playlist id on this event; avoid overwriting valid state.
      if (playlist && typeof playlist === "object" && Array.isArray(playlist.ads)) {
        if (playlist.ads.length > 0) {
          setPlaylist(playlist);
          setCurrentIndex(0);
          setStatus("playing");
        } else {
          setPlaylist(null);
          setCurrentIndex(0);
          setStatus("waiting");
        }
      }
    });

    // Admin updated playlist → play immediately
    socket.on("playlist-updated", ({ playlist }) => {
      if (playlist?.ads?.length > 0) {
        setPlaylist(playlist);
        setCurrentIndex(0);
        setStatus("playing");
      } else {
        setStatus("waiting");
      }
    });

    socket.on("error", ({ message }) => {
      console.error("Socket error:", message);
      setStatus("error");
    });

    return () => {
      clearTimeout(fetchTimeout);
      clearInterval(heartbeatRef.current);
      socket.disconnect();
    };
  }, [screenCode, fetchScreen]);

  //  Auto advance to next ad 
  const handleVideoEnd = () => {
    if (!playlist?.ads) return;

    // Increment play count
    const finishedAd = playlist.ads[currentIndex];
    if (finishedAd?._id) {
      incrementPlayCount(finishedAd._id).catch(console.error);
    }

    const nextIndex = (currentIndex + 1) % playlist.ads.length;

    if (nextIndex === currentIndex) {
      // Only 1 ad — index won't change so useEffect won't fire
      // Manually replay the video instead
      playCurrentAd();
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  // Track play count once when an ad becomes the current ad on screen.
  useEffect(() => {
    const currentAd = playlist?.ads?.[currentIndex];
    if (!currentAd || typeof currentAd !== "object" || !currentAd._id) return;

    const key = `${playlist?._id || "unknown"}:${currentIndex}:${currentAd._id}`;
    if (lastTrackedPlayRef.current === key) return;

    lastTrackedPlayRef.current = key;
    incrementPlayCount(currentAd._id).catch((err) => {
      console.error("Failed to increment play count:", err);
    });
  }, [playlist, currentIndex]);

  const playCurrentAd = () => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(console.error);
    }
  };
  // Play whenever index changes
  useEffect(() => {
    playCurrentAd();
  }, [currentIndex]);

  const currentAd = playlist?.ads?.[currentIndex];

  // Render 
  if (status === "connecting") return <StatusScreen message="Connecting..." />;
  if (status === "error") return <StatusScreen message="Screen not found. Check the screen code." />;
  if (status === "waiting") return <WaitingScreen screenCode={screenCode} screenName={screenName} />;

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">

      {currentAd?.videoUrl ? (
        <video
          ref={videoRef}
          key={currentAd._id}
          onEnded={handleVideoEnd}
          muted
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={currentAd.videoUrl} type="video/mp4" />
        </video>
      ) : (
        // Placeholder when ad has no video yet
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
          <p className="text-white text-2xl font-bold">{currentAd?.name}</p>
          <p className="text-gray-400 text-sm mt-2">No video uploaded yet</p>
        </div>
      )}

      {/* Screen name — top left */}
      <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
        {screenName}
      </div>

    </div>
  );
}

// ── Shared status screen ──────────────────────────────────────────────────────
function StatusScreen({ message }) {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center gap-3">
      <p className="text-white text-2xl font-black">
        Ad<span className="text-blue-400">Flow</span>
      </p>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}

// ── Waiting screen ────────────────────────────────────────────────────────────
function WaitingScreen({ screenCode, screenName }) {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center gap-6">
      <p className="text-white text-4xl font-black">
        Ad<span className="text-blue-400">Flow</span>
        <span className="text-white/30 text-xl font-normal ml-2">NETWORK</span>
      </p>
      <div className="flex flex-col items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        <p className="text-gray-400 text-sm">Waiting for playlist...</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-gray-600 text-xs">{screenName}</p>
        <p className="text-gray-700 text-xs font-mono">{screenCode}</p>
      </div>
    </div>
  );
}

export default PlayerPage;