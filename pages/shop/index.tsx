import Page from "../../components/layouts/page/Page";
import Canvas from "../../components/Shop/Canvas/Canvas";
import Customizer from "../../components/Shop/Customizer/Customizer";
import Content from "../../components/Shop/Content/Content";

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
      <h1>Shop</h1>
      <Content />
      <div style={{ height: "600px" }}>
        <Canvas />
      </div>

      <Customizer />
    </Page>
  );
}
