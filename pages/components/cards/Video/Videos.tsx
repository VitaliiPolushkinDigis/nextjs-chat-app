import { FC, Ref, useEffect, useState } from "react";

interface VideoCardProps {
  videoRef: any;
}

const VideoCard: FC<VideoCardProps> = ({ videoRef }) => {
  const [video, setVideo] = useState(null);
  useEffect(() => {
    if (videoRef && videoRef.current) {
      setVideo(videoRef.current);
    }
    return () => {
      setVideo(null);
    };
  }, [videoRef]);

  return (
    <div>
      <div>Video Card</div>
      <video width={400} height={400} ref={video} autoPlay playsInline />
    </div>
  );
};

export default VideoCard;
