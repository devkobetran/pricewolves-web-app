import React from "react"
import ItemCard from "../components/ItemCard";

const Dashboard: React.FC = () => {
    const mockItems = [
    {
      itemImageUrl: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/02d73bf0-bd26-47db-8e10-7bf55eaeef3e/NIKE+AVA+ROVER.png",
      itemName: "Nike Ava Rover",
      barcode: "1234567890123",
      description: "description abjaskfdjksadfklaf.",
      category: "Shoes",
      storeName: "Store1",
      isDiscount: true,
      itemPrice: 120.0,
      discountedPrice: 90.0,
    },
    {
      itemImageUrl: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/057c2bbd-d065-44eb-913f-51dd4f98d680/AIR+FORCE+1+%2707.png",
      itemName: "Nike Air Force 1",
      barcode: "9876543210987",
      description: "description 2",
      category: "Shoes",
      storeName: "Store 1",
      isDiscount: false,
      itemPrice: 180.0,
    },
    {
      itemImageUrl: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/48675f08-6956-46ce-a6e4-7f44b602b4b4/NIKE+DUNK+LOW+RETRO.png",
      itemName: "Nike Dunk Low Retro",
      barcode: "5555555555555",
      description: "description of a shoe jhskdfhaksdhfkdsafasdfsadf.",
      category: "Shoes",
      storeName: "Store 2",
      isDiscount: true,
      itemPrice: 20.0,
      discountedPrice: 15.0,
    },
    {
      itemImageUrl: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/9303732b-0301-4904-adc1-04e1e9ade540/NIKE+STRUCTURE+26.png",
      itemName: "This is a long item name for testing",
      barcode: "5555555555555",
      description: "description of a shoe, this is a long description for testing 123abcdefghi.",
      category: "Shoes",
      storeName: "Store 1",
      isDiscount: true,
      itemPrice: 30.0,
      discountedPrice: 15.0,
    },
    ];
  
  return (
    <main className="main">
      <section className="page-container">
        <h1 className="page-title">Dashboard</h1>
        <div className="items-grid">
          {mockItems.map((item) => (
            <ItemCard key={item.barcode} item={item}/>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Dashboard
