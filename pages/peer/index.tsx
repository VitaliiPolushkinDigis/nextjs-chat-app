import { useAppDispatch, useTypedSelector } from "@/redux";
import { getAuth } from "@/redux/slices/userSlice";
/* import { useSocket } from "@/utils/hooks/useSocket"; */
import { Box, Button, Card } from "@mui/material";
import PeerType, { MediaConnection } from "peerjs";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";
import VideoCard from "../../components/cards/Video/Videos";
import Page from "../../components/layouts/page/Page";

const initializePeerInstance = ({
  initiator,
  stream,
}: {
  initiator: boolean;
  stream: MediaStream;
}) => {
  if (typeof window !== "undefined") {
    const Peer = require("simple-peer");
    return new Peer({
      initiator,
      trickle: false,
      stream,
      ...(initiator
        ? {
            config: {
              iceServers: [
                {
                  urls: "stun:numb.viagenie.ca",
                  username: "sultan1640@gmail.com",
                  credential: "98376683",
                },
                {
                  urls: "turn:numb.viagenie.ca",
                  username: "sultan1640@gmail.com",
                  credential: "98376683",
                },
              ],
            },
          }
        : {}),
    });
  }
};

interface PeerProps {}

const PeerPage: FC<PeerProps> = () => {
  const [userName, setUserName] = useState("");
  /* const [peer, setPeer] = useState<any>(); */

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localScreenShareVideoRef = useRef<HTMLVideoElement>(null);
  // const [isReceivingCall, setIsReceivingCall] = useState(false);
  // const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  // const [videoEnabled, setVideoEnabled] = useState(true);
  // const [disableLocalVideo, setDisableLocalVideo] = useState(false);
  // const [localStream, setLocalStream] = useState<MediaStream>();
  // const [remoteStream, setRemoteStream] = useState<MediaStream>();
  // const [showRemoteVideo, setShowRemoteVideo] = useState(true);
  // const [deafen, setDeafen] = useState(false);
  // const [connectedCall, setConnectedCall] = useState<MediaConnection>();
  const { user } = useTypedSelector((state) => state.user);

  /* const { socket } = useSocket(); */

  const dispatch = useAppDispatch();

  //new 2
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  /*   const [myVideo, setMyVideo] = useState<any>();
  const [remoteVideo, setRemoteVideo] = useState<any>(); */

  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const socket = useRef<any>();

  useEffect(() => {
    dispatch(getAuth());
  }, [dispatch]);

  useEffect(() => {
    socket.current = io(
      /* "http://localhost:3001" */ "https://chat-nestjs-92c46b4f7e43.herokuapp.com",
      {
        reconnectionAttempts: 3,
        withCredentials: true,
      }
    ).connect();

    console.log("here0");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.current.on("yourID", (id: string) => {
      setYourID(id);
    });
    socket.current.on("allUsers", (users: any) => {
      setUsers(users);
    });

    socket.current.on("hey", (data: any) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  function callPeer(id: string) {
    const peer = initializePeerInstance({ initiator: true, stream: stream! });

    peer.on("signal", (data: any) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID,
      });
    });

    peer.on("stream", (stream: any) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", (signal: any) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = initializePeerInstance({ initiator: false, stream: stream! });
    peer.on("signal", (data: any) => {
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream: any) => {
      if (partnerVideo.current) partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  if (stream) {
    console.log("stream 154");
  }

  if (callAccepted) {
    console.log("callAccepted 160");
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <div onClick={acceptCall}>Accept</div>
      </div>
    );
  }

  const connect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // const shareScreen = async () => {
  //   const stream = await navigator.mediaDevices.getDisplayMedia({
  //     video: true,
  //     audio: false,
  //   });
  //   console.log(stream);
  //   console.log(stream.getTracks());
  //   console.log(remoteStream);
  //   if (remoteStream && connectedCall) {
  //     console.log("Remote Stream & Connected Call are defined");
  //     console.log("Senders:", connectedCall.peerConnection.getSenders());
  //     connectedCall.peerConnection
  //       .getSenders()[1]
  //       .replaceTrack(stream.getTracks()[0]);
  //     remoteStream.addTrack(stream.getTracks()[0]);
  //   }
  //   if (localScreenShareVideoRef.current) {
  //     console.log("Playing Video for Screen Sharing");
  //     localScreenShareVideoRef.current.srcObject = stream;
  //     localScreenShareVideoRef.current.play();
  //   }
  // };

  // const toggleRemoteVideo = () =>
  //   remoteStream &&
  //   setShowRemoteVideo((prev) => {
  //     remoteStream.getVideoTracks()[0].enabled = !prev;
  //     return !prev;
  //   });

  console.log("users", users);

  return (
    <Box component={"section"} minHeight={"100vh"}>
      <Page>
        user: {user?.firstName}
        {/* peer: {peer && peer.id} */}
        your ID: {yourID}
        <div>
          My video:{" "}
          <video
            playsInline
            muted
            width={400}
            height={400}
            ref={userVideo}
            autoPlay
          />
        </div>
        <div>
          REMOTE:{" "}
          <video
            playsInline
            muted
            width={400}
            height={400}
            ref={partnerVideo}
            autoPlay
          />
        </div>
        {Object.keys(users).map((key) => {
          if (key === yourID) {
            return null;
          }
          return (
            <button key={key} onClick={() => callPeer(key)}>
              Call {key}
            </button>
          );
        })}
        <div> {incomingCall}</div>
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
      </Page>
    </Box>
  );
};

export default PeerPage;
