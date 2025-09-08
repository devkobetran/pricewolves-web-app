import React, { useEffect, useState } from "react";
import { categoryOptions } from "../custom-dropdown-select/CategoriesDropdownSelect";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

interface FilterSidebarProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedStores: string[];
  onStoreChange: (stores: string[]) => void;
  minPrice: number | null;
  maxPrice: number | null;
  onMinPriceChange: (value: number | null) => void;
  onMaxPriceChange: (value: number | null) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategories,
  onCategoryChange,
  selectedStores,
  onStoreChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}) => {
  const [storeOptions, setStoreOptions] = useState<string[]>([]);

  const fetchStores = async () => {
    try {
      const { data: stores } = await client.models.Store.list();
      if (stores && stores.length > 0) {
        setStoreOptions(stores.map(store => store.storeName));
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      setStoreOptions([]);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);


  const handleCategoryChange = (value: string) => {
    const newSelected = selectedCategories.includes(value)
      ? selectedCategories.filter(v => v !== value)
      : [...selectedCategories, value];
    onCategoryChange(newSelected);
  };

  const handleStoreChange = (store: string) => {
    const newSelected = selectedStores.includes(store)
      ? selectedStores.filter(s => s !== store)
      : [...selectedStores, store];
    onStoreChange(newSelected);
  };

  return (
    <div>
      <div className="filter-section">
        <h3>Filter by Store</h3>
        {storeOptions.map(store => (
          <div key={store}>
            <label>
              <input
                type="checkbox"
                checked={selectedStores.includes(store)}
                onChange={() => handleStoreChange(store)}
              />
              {store}
            </label>
          </div>
        ))}
      </div>

      <div className="filter-section">
        <h3>Filter by Price</h3>
        <div className="price-filter">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice ?? ""}
            onChange={(e) =>
              onMinPriceChange(e.target.value ? Number(e.target.value) : null)
            }
          />
          to
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice ?? ""}
            onChange={(e) =>
              onMaxPriceChange(e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>
      </div>

      <div className="filter-section">
        <h3>Filter by Category</h3>
        {categoryOptions.map(option => (
          <div key={option.value}>
            <label>
              <input
                type="checkbox"
                checked={selectedCategories.includes(option.value)}
                onChange={() => handleCategoryChange(option.value)}
              />
              {option.label}
            </label>
          </div>
        ))}
      </div>  
    </div>
  );
};

export default FilterSidebar;
