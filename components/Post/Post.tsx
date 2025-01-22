import { Post } from "@/utils/types";
import Image from "next/image";
import { FC } from "react";

interface PostProps {
  p: Post;
}

const PostComponent: FC<PostProps> = ({ p }) => {
  return (
    <div
      style={{
        padding: "24px 24px 12px",
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
      <p
        style={{
          fontWeight: 700,
          fontSize: "20px",
          textTransform: "capitalize",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        {p.title}
      </p>
      {p.imgUrl && (
        <Image
          style={{ borderRadius: "12px" }}
          src={p.imgUrl}
          alt="Image description"
          layout="responsive"
          width={100} // Relative width (for responsiveness)
          height={75} // Relative height (for responsiveness)
        />
      )}
      <p>{p.subtitle}</p>
      <p>{p.description}</p>

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
          <div key={p.id}>
            <div style={{ textTransform: "capitalize", fontWeight: 600 }}>
              {p.author.firstName} {p.author.lastName}
            </div>
            <div>{p.content}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "16px",
        }}
      >
        <p style={{ display: "flex", alignItems: "center" }}>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#093d20"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="#093d20"
              className="size-6"
              width={24}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>{" "}
          </span>
          <span style={{ fontWeight: 600 }}>{p.likes}</span>
        </p>
        <p style={{ display: "flex", alignItems: "center" }}>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-6"
              width={24}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </span>
          <span style={{ fontWeight: 600 }}> {p.views}</span>
        </p>
      </div>
    </div>
  );
};

export default PostComponent;
