import Page from "../../components/layouts/page/Page";
import Canvas from "../../components/Shop/Canvas/Canvas";
import Customizer from "../../components/Shop/Customizer/Customizer";
import Content from "../../components/Shop/Content/Content";
import { Sidebar } from "@/components/sidebar/Sidebar";

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
    <Page display="flex">
      <Sidebar>
        <h1>Shop</h1>
      </Sidebar>
      <div style={{ padding: "24px" }}>
        <Content />
        <div style={{ height: "600px" }}>
          <Canvas />
        </div>

        <Customizer />
      </div>
    </Page>
  );
}
