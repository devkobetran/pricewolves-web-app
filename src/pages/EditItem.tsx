import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import Swal from 'sweetalert2'
import { isSafeUrl } from "../utils/isSafeUrl";
import type { ItemInputs, Store } from "../types";
import CategoriesDropdownSelect from "../custom-dropdown-select/CategoriesDropdownSelect";
import UnitsDropdownSelect from "../custom-dropdown-select/UnitsDropdownSelect";
import StoresDropdownSelect from "../custom-dropdown-select/StoresDropdownSelect";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import Scanner from "../components/Scanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const client = generateClient<Schema>();

const EditItem: React.FC = () => {
  const [inputs, setInputs] = useState<ItemInputs>();
  const [selectedStore, setSelectedStore] = useState<Store>();
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();

  const fetchStoreById = async (storeId: string): Promise<Store | undefined> => {
    try {
      const response = await client.models.Store.get({ id: storeId });
      if (response.data) {
        const store = {
          ...response.data,
          storeLocations: Array.isArray(response.data.storeLocations)
            ? response.data.storeLocations.filter((loc): loc is NonNullable<typeof loc> => loc !== null)
            : [],
        };
        return store as Store;
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching store:", error);
      return undefined;
    }
  };

  useEffect(() => {
    const fetchItemAndStore = async () => {
      if (!itemId) {
        Swal.fire("Error", "No item ID provided.", "error");
        return;
      }
      try {
        const response = await client.models.Item.get({ id: itemId });
        const dbItem = response.data;
        if (dbItem) {
        const item: ItemInputs = {
          id: dbItem.id,
          barcode: dbItem.barcode ?? "",
          itemName: dbItem.itemName,
          itemImageUrl: dbItem.itemImageUrl,
          itemPrice: dbItem.itemPrice,
          units: dbItem.units,
          category: dbItem.category,
          description: dbItem.description ?? "",
          storeName: dbItem.storeName,
          storeId: dbItem.storeId,
          isDiscount: dbItem.isDiscount ?? false,
          discountedPrice: dbItem.discountedPrice ?? 0,
        };
        setInputs(item);
        const store = await fetchStoreById(item.storeId);
        if (store) setSelectedStore(store);
        }
      } catch (error) {
        console.error("Error fetching item:", error);
        Swal.fire("Error", "Failed to load item details.", "error");
      }
    };
    fetchItemAndStore();
  }, [itemId]);


  // Generic change handler for text, number, and checkbox fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> 
  ) => {
    const { name, type, value } = e.target;
    const fieldValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setInputs((prev) => ({
      ...prev!,
      [name]: fieldValue,
    }));
  };

  const handleStoreSelect = (store: Store) => {
    if (!store) return;
    setSelectedStore({
      id: store.id,
      storeName: store.storeName,
      storeLocations: store.storeLocations,
      isBigChain: store.isBigChain,
      storeLogoUrl: store.storeLogoUrl,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputs || !selectedStore) return;

    const itemPrice = Number(inputs.itemPrice);
    if(isNaN(itemPrice) || itemPrice < 0) {
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Item price must be a positive number.',
        icon: 'error',
      })
      throw new Error(`Invalid price upon submission`)
    }

    const discountedPrice = Number(inputs.discountedPrice);
    if(isNaN(discountedPrice) || discountedPrice < 0) {
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Discounted price must be a positive number.',
        icon: 'error',
      })
      throw new Error("Invalid discounted price upon submission")
    } else if(discountedPrice >= itemPrice) {
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Discounted price must be less than the original price.',
        icon: 'error',
      })
      throw new Error("Discounted price cannot be greater than or the same as the original price upon submission")
    }

    const itemImageUrl = inputs.itemImageUrl;
    let safeItemImageUrl: string;
    if(itemImageUrl && isSafeUrl(itemImageUrl)) {
      const url = new URL(itemImageUrl);
      safeItemImageUrl = url.href;
    } else {
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Item image URL is not safe or valid.',
        icon: 'error',
      })
      throw new Error("Invalid image URL upon submission")
    }

    const selectedStoreId = selectedStore?.id;
    const selectedStoreName = selectedStore?.storeName;
    if (!selectedStoreId || !selectedStoreName) {
      Swal.fire({ title: 'Error', text: 'Please select a store', icon: 'error' });
      return;
    }

    const sanitizedItemInputs = {
      barcode: DOMPurify.sanitize(inputs.barcode) || undefined,
      itemName: DOMPurify.sanitize(inputs.itemName),
      itemImageUrl: DOMPurify.sanitize(safeItemImageUrl),
      itemPrice: itemPrice,
      units: DOMPurify.sanitize(inputs.units),
      category: DOMPurify.sanitize(inputs.category),
      description: DOMPurify.sanitize(inputs.description) || undefined,
      storeName: DOMPurify.sanitize(selectedStoreName),
      storeId: DOMPurify.sanitize(selectedStoreId),
      isDiscount: inputs.isDiscount,
      discountedPrice: inputs.isDiscount
      ? discountedPrice
      : undefined,
    }

    try {
      await client.models.Item.update({  
        id: itemId!,
        ...sanitizedItemInputs,
      });

      const newHistory = await client.models.PriceHistory.create({
        itemId: itemId!,
        itemName: sanitizedItemInputs.itemName,
        price: sanitizedItemInputs.itemPrice,
        discountedPrice: sanitizedItemInputs.isDiscount ? sanitizedItemInputs.discountedPrice : undefined,
        changedAt: new Date().toISOString(),
      });
      console.log("created pricehistory:", newHistory);
      const successMessage = `Item: ${sanitizedItemInputs.itemName} updated successfully`;
      Swal.fire({
        title: 'Item Successfully Updated',
        text: successMessage,
        icon: 'success',
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      console.error("Error updating item:", error);
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Failed to update item. Please try again. Contact admin for support if issue persists.',
        icon: 'error',
      })
      return;
    }
  };

  if (!inputs) {
    return <p>Loading item...</p>;
  }

  return (
    <>
      <main className="main">
        <section className="page-container">
          <div className="page-header">
            <h1 className="page-title">Edit Item</h1>
          </div>
          <form
            className="add-form"
            onSubmit={handleSubmit}
          >

          <label htmlFor="storeName">Store Name<span className="required-form-item">*</span></label>
          <StoresDropdownSelect
            value={selectedStore}
            onChange={handleStoreSelect}
          />
          <button
            type="button"
            className="new-store-redirect"
            onClick={() => navigate("/create-new-store")}
          >
          <FontAwesomeIcon icon={faCircleInfo} />
          Store not listed? Add here.
          </button>
            
          <label htmlFor="barcode">Barcode (recommended)</label>
          <Scanner
            value={DOMPurify.sanitize(inputs.barcode)}
              onChange={(val: string) =>
              setInputs((prev) => ({...prev!, barcode: val}))
            }
          />

            <label htmlFor="itemName">Item Name<span className="required-form-item">*</span></label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              placeholder="Item Name (required)"
              value={DOMPurify.sanitize(inputs.itemName)}
              onChange={handleChange}
              autoComplete="off"
              maxLength={120}
              required
            />

            <label htmlFor="itemImageUrl">Item Image Url<span className="required-form-item">*</span></label>
            <input
              type="text"
              id="itemImageUrl"
              name="itemImageUrl"
              placeholder="Item Image url (required)"
              value={DOMPurify.sanitize(inputs.itemImageUrl)}
              onChange={handleChange}
              autoComplete="off"
              maxLength={2000}
              required
            />

            <label htmlFor="itemPrice">Item Price<span className="required-form-item">*</span></label>
            <input
              type="number"
              id="itemPrice"
              name="itemPrice"
              placeholder="Item Price (required)"
              step="0.01"
              min="0"
              value={inputs.itemPrice}
              onChange={handleChange}
              autoComplete="off"
              maxLength={20}
              required
            />

            <label htmlFor="units">Units<span className="required-form-item">*</span></label>
            <UnitsDropdownSelect
              value={DOMPurify.sanitize(inputs.units)}
              onChange={(value: string) =>
                setInputs((prev) => ({ ...prev!, units: value }))
              }
            />

            <label htmlFor="category">Category<span className="required-form-item">*</span></label>
            <CategoriesDropdownSelect
              value={DOMPurify.sanitize(inputs.category)}
              onChange={(value: string) =>
                setInputs((prev) => ({ ...prev!, category: value }))
              }
            />

            <label htmlFor="description">
              Item Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Item Description (optional)"
              value={DOMPurify.sanitize(inputs.description)}
              onChange={handleChange}
              autoComplete="off"
              maxLength={2000}
            />

            <div className="discount-group">
              <label htmlFor="isDiscount">Discount?</label>
              <input
                type="checkbox"
                id="isDiscount"
                name="isDiscount"
                checked={inputs.isDiscount}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <label htmlFor="discountedPrice">
              Discounted Price?
            </label>
            <input
              type="number"
              id="discountedPrice"
              name="discountedPrice"
              placeholder="Discounted Price (optional)"
              step="0.01"
              min="0"
              value={inputs.discountedPrice}
              onChange={handleChange}
              disabled={!inputs.isDiscount}
              maxLength={20}
            />

            <button type="submit" className="button">
              Submit
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default EditItem;
