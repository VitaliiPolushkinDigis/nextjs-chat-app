import { useAppDispatch, useTypedSelector } from "@/redux";
import { getAuth } from "@/redux/slices/userSlice";
import { Box, Button, Card } from "@mui/material";
import PeerType, { MediaConnection } from "peerjs";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

const initializePeer = () => {
  if (typeof window !== "undefined") {
    const { Peer } = require("peerjs");
    return new Peer(uuid());
  }
};

interface PeerProps {}

const PeerPage: FC<PeerProps> = () => {
  const [userName, setUserName] = useState("");
  const [peer, setPeer] = useState<PeerType | undefined>();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localScreenShareVideoRef = useRef<HTMLVideoElement>(null);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [disableLocalVideo, setDisableLocalVideo] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [showRemoteVideo, setShowRemoteVideo] = useState(true);
  const [deafen, setDeafen] = useState(false);
  const [connectedCall, setConnectedCall] = useState<MediaConnection>();
  const { user } = useTypedSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAuth());
  }, [dispatch]);

  useEffect(() => {
    setPeer(initializePeer());
  }, []);

  useEffect(() => {
    if (!peer) return console.log("Effect: no peer");

    peer.on("call", async (call) => {
      setIsReceivingCall(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(mediaStream);
      call.answer(mediaStream);
      setConnectedCall(call);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
        localVideoRef.current.muted = true;
        localVideoRef.current.play();
      }
      call.on("stream", async (stream) => {
        console.log("Received Stream");
        console.log(stream.getTracks());
        setRemoteStream(stream);
        console.log("receiving remote stream");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          console.log(
            "remoteVideoRef.current.readyState",
            remoteVideoRef.current.readyState
          );
          if (remoteVideoRef.current.readyState !== 0) {
            console.log("now not 0");
          }

          var playPromise = await remoteVideoRef.current.play();
          if (playPromise !== undefined) {
            (playPromise as any)
              .then((_: any) => {
                // Automatic playback started!
                // Show playing UI.
                console.log(_);
              })
              .catch((error: any) => {
                // Auto-play was prevented
                // Show paused UI.
                console.log(error);
              });
          }
        }
        stream.onaddtrack = (e) => {
          console.log("onatrackadd");
          console.log(e);
        };
      });
    });

    peer.on("open", (id) => {
      console.log("peer open", peer, id);
    });

    peer.on("connection", (data) => {
      console.log("connection", data);
    });
  }, [peer]);

  const connect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!peer) return;
    console.log("connect click");

    const connection = peer.connect(userName);
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(mediaStream);
    if (localVideoRef.current) {
      console.log("setting local stream");
      localVideoRef.current.srcObject = mediaStream;
      localVideoRef.current.muted = true;
      localVideoRef.current.play();
    }
    const call = peer.call(userName, mediaStream);
    console.log(call.peerConnection.getSenders());
    setConnectedCall(call);

    call.on("stream", (stream) => {
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play();
      }
    });
  };

  const shareScreen = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    console.log(stream);
    console.log(stream.getTracks());
    console.log(remoteStream);
    if (remoteStream && connectedCall) {
      console.log("Remote Stream & Connected Call are defined");
      console.log("Senders:", connectedCall.peerConnection.getSenders());
      connectedCall.peerConnection
        .getSenders()[1]
        .replaceTrack(stream.getTracks()[0]);
      remoteStream.addTrack(stream.getTracks()[0]);
    }
    if (localScreenShareVideoRef.current) {
      console.log("Playing Video for Screen Sharing");
      localScreenShareVideoRef.current.srcObject = stream;
      localScreenShareVideoRef.current.play();
    }
  };

  const toggleRemoteVideo = () =>
    remoteStream &&
    setShowRemoteVideo((prev) => {
      remoteStream.getVideoTracks()[0].enabled = !prev;
      return !prev;
    });

  return (
    <Box component={"section"} minHeight={"100vh"}>
      user: {user?.firstName}
      peer: {peer && peer.id}
      MY: <video width={400} height={400} ref={localVideoRef} />
      REMOTE:
      <video
        width={400}
        height={400}
        ref={remoteVideoRef}
        id="video"
        preload="none"
      />
      <button onClick={shareScreen}>Share Screen</button>
      <button onClick={toggleRemoteVideo}>
        {showRemoteVideo ? "Turn Off User Video" : "Turn On User video"}
      </button>
      <Card>
        <form onSubmit={connect}>
          <label htmlFor="userName">set name</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Button type="submit">Connect</Button>
        </form>
      </Card>
    </Box>
  );
};

export default PeerPage;
