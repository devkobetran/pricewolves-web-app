import React, { useState } from "react";
import DOMPurify from "dompurify";
import Swal from 'sweetalert2'
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { isSafeUrl } from "../utils/isSafeUrl";

const client = generateClient<Schema>();

interface ItemInputs {
  barcode: string;
  itemName: string;
  itemImageUrl: string;
  itemPrice: number;
  units: string;
  category: string;
  description: string;
  storeName: string;
  storeId: string;
  isDiscount: boolean;
  discountedPrice: number;
}

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

    const sanitizedItemInputs = {
      barcode: DOMPurify.sanitize(inputs.barcode) || undefined,
      itemName: DOMPurify.sanitize(inputs.itemName),
      itemImageUrl: DOMPurify.sanitize(safeItemImageUrl) || undefined,
      itemPrice: itemPrice,
      units: DOMPurify.sanitize(inputs.units),
      category: DOMPurify.sanitize(inputs.category),
      description: DOMPurify.sanitize(inputs.description) || undefined,
      storeName: DOMPurify.sanitize(inputs.storeName),
      storeId: DOMPurify.sanitize(inputs.storeId),
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
            <input
              type="text"
              id="barcode"
              name="barcode"
              placeholder="Barcode (recommended)"
              value={DOMPurify.sanitize(inputs.barcode)}
              onChange={handleChange}
              autoComplete="off"
              maxLength={200}
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

            <label htmlFor="itemImageUrl">Item Image Url (recommended)</label>
            <input
              type="text"
              id="itemImageUrl"
              name="itemImageUrl"
              placeholder="Item Image url (recommended)"
              value={DOMPurify.sanitize(inputs.itemImageUrl)}
              onChange={handleChange}
              autoComplete="off"
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
            <input
              type="text"
              id="units"
              name="units"
              placeholder="Units IMPLEMENT REACT-DROPDOWN-SELECT HERE WITH PRE-DEFINED LIST & LET USER ADD THEIR OWN UNITS"
              value={DOMPurify.sanitize(inputs.units)}
              onChange={handleChange}
              autoComplete="off"
              maxLength={50}
              required
            />

            <label htmlFor="category">Category<span className="required-form-item">*</span></label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="Category IMPLEMENT REACT-DROPDOWN-SELECT HERE WITH PRE-DEFINED LIST & LET USER ADD THEIR OWN CATEGORIES"
              value={DOMPurify.sanitize(inputs.category)}
              onChange={handleChange}
              autoComplete="off"
              maxLength={50}
              required
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
            <input
              type="text"
              id="storeName"
              name="storeName"
              placeholder="IMPLEMENT REACT-DROPDOWN-SELECT HERE"
              value={DOMPurify.sanitize(inputs.storeName)}
              onChange={handleChange}
              autoComplete="off"
              maxLength={100}
              required
            />

            <label htmlFor="storeId">StoreId<span className="required-form-item">*</span></label>
            <input
              type="text"
              id="storeId"
              name="storeId"
              placeholder="IMPLEMENT REACT-DROPDOWN-SELECT HERE"
              value={DOMPurify.sanitize(inputs.storeId)}
              onChange={handleChange}
              autoComplete="off"
              maxLength={200}
              required
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
