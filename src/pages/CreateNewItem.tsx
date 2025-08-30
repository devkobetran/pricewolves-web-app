import React, { useState } from "react";
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

const client = generateClient<Schema>();

const initialItemInputs: ItemInputs = {
  barcode: "",
  itemName: "",
  itemImageUrl: "",
  itemPrice: 0,
  units: "",
  category: "",
  description: "",
  storeName: "",
  storeId: "",
  isDiscount: false,
  discountedPrice: 0,
};

const CreateNewItem: React.FC = () => {
  const [inputs, setInputs] = useState<ItemInputs>(initialItemInputs);
  const [selectedStore, setSelectedStore] = useState<Store>();

  // Generic change handler for text, number, and checkbox fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> 
  ) => {
    const { name, type, value } = e.target;
    const fieldValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setInputs((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
  };

  // Submit to AWS Amplify Data API
  const handleSubmit = async (
   e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

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
      await client.models.Item.create(sanitizedItemInputs);
      const successMessage = `Item: ${sanitizedItemInputs.itemName} created successfully for $${sanitizedItemInputs.itemPrice} per ${sanitizedItemInputs.units}`;
      Swal.fire({
        title: 'New Item Successfully Created',
        text: successMessage,
        icon: 'success',
      })

      setInputs(initialItemInputs);
      setSelectedStore(undefined);
      return;
    } catch (error) {
      console.error("Error creating item:", error);
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Failed to create item. Please try again. Contact admin for support if issue persists.',
        icon: 'error',
      })
      return;
    }
  };

  return (
    <>
      <title>Create New Item - Price Wolves</title>
      <meta
        name="description"
        content="Create a brand-new item in our store catalog on Price Wolves."
      />
      <meta 
        property="og:title" 
        content="Create New Item | Price Wolves" 
      />
      <meta
        property="og:description"
        content="Create a brand-new item in our store catalog on Price Wolves."
      />
      <meta property="og:type" content="website" />
      <link
        rel="canonical"
        href="https://pricewolves.com/create-new-item"
      />

      <main className="main">
        <section className="page-container">
          <h1 className="page-title">Create New Item</h1>
          <form
            className="add-form"
            onSubmit={handleSubmit}
            method="POST"
          >
            
          <label htmlFor="barcode">Barcode (recommended)</label>
          <Scanner
            value={DOMPurify.sanitize(inputs.barcode)}
            onChange={(val) =>
              handleChange({
                target: { name: "barcode", value: val },
              } as React.ChangeEvent<HTMLInputElement>)
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
                setInputs((prev) => ({ ...prev, units: value }))
              }
            />

            <label htmlFor="category">Category<span className="required-form-item">*</span></label>
            <CategoriesDropdownSelect
              value={DOMPurify.sanitize(inputs.category)}
              onChange={(value: string) =>
                setInputs((prev) => ({ ...prev, category: value }))
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

            <label htmlFor="storeName">Store Name<span className="required-form-item">*</span></label>
            <StoresDropdownSelect 
              value={selectedStore}
              onChange={(store: Store) => handleStoreSelect(store)}
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

export default CreateNewItem;
