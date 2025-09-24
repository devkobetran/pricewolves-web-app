import React, { useState, useEffect } from "react"
import ItemCard from "../components/ItemCard";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import type { ItemInputs } from "../types/item";
import FilterSidebar from "../components/FilterSidebar";

const client = generateClient<Schema>();

const Dashboard: React.FC = () => {
  const [dashboardItems, setDashboardItems] = useState<ItemInputs[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"none" | "lowToHigh" | "highToLow">("none");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data: items } = await client.models.Item.list();
      const itemsWithHistory = await Promise.all(
        (items ?? []).map(async (item) => {
          const { data: history } = await client.models.PriceHistory.list({
            filter: { itemId: { eq: item.id } }
          });
          return { ...item, priceHistory: history ?? [] };
        })
      );
      setDashboardItems(itemsWithHistory as ItemInputs[]);
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
  
  const filteredItems = dashboardItems.filter(item => {
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(item.category);

    const storesMatch =
      selectedStores.length === 0 || selectedStores.includes(item.storeName);
    
    const price = item.isDiscount ? item.discountedPrice : item.itemPrice;

    const pricesMatch =
      price !== undefined &&
      (minPrice === null || price >= minPrice) &&
      (maxPrice === null || price <= maxPrice);

    return categoryMatch && storesMatch && pricesMatch;
  });

  const handleSortToggle = () => {
    setSortOption((prev) => {
      if (prev === "none") return "lowToHigh";
      if (prev === "lowToHigh") return "highToLow";
      return "none";
    });
  };

  let sortedItems = [...filteredItems];

  if (sortOption === "lowToHigh") {
    sortedItems.sort((a, b) => {
      const priceA = a.isDiscount ? a.discountedPrice : a.itemPrice;
      const priceB = b.isDiscount ? b.discountedPrice : b.itemPrice;
      return (priceA ?? 0) - (priceB ?? 0);
    });
  } else if (sortOption === "highToLow") {
    sortedItems.sort((a, b) => {
      const priceA = a.isDiscount ? a.discountedPrice : a.itemPrice;
      const priceB = b.isDiscount ? b.discountedPrice : b.itemPrice;
      return (priceB ?? 0) - (priceA ?? 0);
    });
}

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <main className="main">
      <section className="page-container">
        <div className="page-header">
          <button className="button sidebar-toggle-button" onClick={toggleSidebar}>
            Filters
          </button>
          <h1 className="page-title">Dashboard</h1>
          <button className="button sort-button" onClick={handleSortToggle}>
            {sortOption === "none" && "No Sort"}
            {sortOption === "lowToHigh" && "Price ↑"}
            {sortOption === "highToLow" && "Price ↓"}
          </button>
        </div>

        <div className="dashboard">
          {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
          <div className={`filter-sidebar ${isSidebarOpen ? "open" : ""}`}>
              <p className="sidebar-results-counter">Showing {sortedItems.length} results </p>
              <button className="button sidebar-close-button" onClick={toggleSidebar}>
                Close and apply filters
              </button>
            <FilterSidebar
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              selectedStores={selectedStores}
              onStoreChange={setSelectedStores}
              minPrice={minPrice}
              onMinPriceChange={setMinPrice}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
            />
          </div>
          <div className="items-grid">
            {sortedItems.length === 0 ? (
              <p>No items found.</p>
            ) : (
              sortedItems.map((item) => (
                <ItemCard
                  key={item.barcode}
                  id={item.id}
                  itemImageUrl={item.itemImageUrl}
                  itemName={item.itemName}
                  barcode={item.barcode}
                  description={item.description}
                  category={item.category}
                  storeName={item.storeName}
                  isDiscount={item.isDiscount}
                  itemPrice={item.itemPrice}
                  discountedPrice={item.discountedPrice}
                  priceHistory={item.priceHistory}/>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard
