import { Post } from "@/utils/types";
import { FC } from "react";

interface PostProps {
  p: Post;
}

const PostComponent: FC<PostProps> = ({ p }) => {
  return (
    <div
      style={{
        padding: "24px",
        boxShadow:
          "rgba(0, 0, 0, 0.1) 0px 0px 9px 0px, rgba(0, 0, 0, 0.1) 0px 0px 7px -11px",
        borderRadius: "16px",
        border: "1px solid #0000003b",
        marginBottom: "24px",
        backgroundSize: "cover",
        backgroundImage:
          "url(https://web.telegram.org/a/chat-bg-br.f34cc96fbfb048812820.png)",
        filter: "drop-shadow(0px 0px 9px black)",
      }}
    >
      <p style={{ fontWeight: 700 }}>{p.title}</p>
      {p.imgUrl && (
        <img
          style={{ width: "-webkit-fill-available", borderRadius: "12px" }}
          src={p.imgUrl}
        />
      )}
      <p>{p.subtitle}</p>
      <p>{p.description}</p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p>Likes: {p.likes}</p>
        <p>Views: {p.views}</p>
      </div>
      <div
        style={{
          marginTop: "16px",
          width: "100%",
          minHeight: "100px",
          background: "#fafafa",
          borderRadius: "16px",
          padding: "8px",
        }}
      >
        <p>Comments:</p>
        {p.comments.map((p) => (
          <div>
            <div style={{ textTransform: "capitalize", fontWeight: 600 }}>
              {p.author.firstName} {p.author.lastName}
            </div>
            <div>{p.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComponent;
