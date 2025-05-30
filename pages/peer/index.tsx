import { useAppDispatch, useTypedSelector } from "@/redux";
import { getAuth } from "@/redux/slices/userSlice";
import { Box, Button, Card } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
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
    });
  }
};

interface PeerProps {}

const PeerPage: FC<PeerProps> = () => {
  const [userName, setUserName] = useState("");

  const { user } = useTypedSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const socket = useRef<any>();

  useEffect(() => {
    dispatch(getAuth());
  }, [dispatch]);

  useEffect(() => {
    if (localStorage) {
      socket.current = io(process.env.NEXT_PUBLIC_URL, {
        reconnectionAttempts: 3,
        withCredentials: true,
        transports: ["websocket", "polling", "flashsocket"], // Specify WebSocket as transport
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        auth: {
          token: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      }).connect();

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
    }
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

  return (
    <Page>
      <div style={{ padding: "20px" }}>
        user: {user?.firstName}
        your ID: {yourID}
        <div>
          My video:
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
          REMOTE:
          <video
            playsInline
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
      </div>
    </Page>
  );
};

export default PeerPage;
