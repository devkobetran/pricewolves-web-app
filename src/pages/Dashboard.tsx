import React, { useState, useEffect } from "react"
import ItemCard from "../components/ItemCard";
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../../amplify/data/resource';
import type { ItemInputs } from "../types/item";

const client = generateClient<Schema>();

const Dashboard: React.FC = () => {
  const [dashboardItems, setDashboardItems] = useState<ItemInputs[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data: items } = await client.models.Item.list();
      if (items && items.length > 0) {
        setDashboardItems(items as ItemInputs[]);
      } else {
        setDashboardItems([]);
        console.log("Issue: No items available");
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      setDashboardItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <p>Loading items...</p>;
  
  return (
    <main className="main">
      <section className="page-container">
        <h1 className="page-title">Dashboard</h1>
        <div className="items-grid">
          {dashboardItems.length === 0 ? (
            <p>No items found.</p>
          ) : (
            dashboardItems.map((item) => (
              <ItemCard key={item.barcode} item={item} />
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Dashboard
