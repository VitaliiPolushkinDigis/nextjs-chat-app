import Image from "next/image";
import { FC } from "react";
import Page from "../components/layouts/page/Page";

interface ShopProps {
  items: {
    id: string;
    title: string;
    price: string;
    category: string;
    description: string;
    image: string;
  }[];
}

export default function Shop({ items }: ShopProps) {
  return (
    <Page>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          maxHeight: "calc(100vh - 37px)",
          gap: "20px",
          padding: "20px",
        }}
      >
        {items.map((item) => (
          <div key={item.id} style={{ maxWidth: "300px", maxHeight: "500px" }}>
            <div
              style={{
                width: "200px",
                height: "300px",
                position: "relative",
              }}
            >
              <Image
                alt={`img-${item.id}`}
                src={item.image}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "100%" }} // optional
              />
            </div>
            <span>{item.title}</span>
            <span>{item.price}</span>
            <div>{item.description}</div>
          </div>
        ))}
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://fakestoreapi.com/products");
  const items = await res.json();

  return {
    props: {
      items,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 300, // In seconds
  };
}
