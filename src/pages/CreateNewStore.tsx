import React, { useState } from "react";
import DOMPurify from "dompurify";
import Swal from 'sweetalert2'
import { isSafeUrl } from "../utils/isSafeUrl";
import type { StoreLocation } from "../types";
import StatesDropdownSelect from "../custom-dropdown-select/StatesDropdownSelect";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

interface StoreInputs {
  storeName: string;
  storeLocations: StoreLocation[];  
  isBigChain: boolean;
  storeLogoUrl: string;
}

const initialStoreInputs: StoreInputs = {
  storeName: "",
  storeLocations: [
    {
      streetName: "",
      optionalSecondaryStreetDetails: "",
      city: "",
      state: "",
      zipCode: "",
    },
  ],
  isBigChain: false,
  storeLogoUrl: "",
}

const CreateNewStore: React.FC = () => {
  const [inputs, setInputs] = useState<StoreInputs>(initialStoreInputs);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> 
  ) => {
    const { name, type, value } = e.target;
    const fieldValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setInputs((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleLocationChange = (index: number, field: keyof StoreLocation, value: string) => {
    setInputs(prev => ({
      ...prev,
      storeLocations: prev.storeLocations.map((location, i) => 
        i === index ? { ...location, [field]: value } : location
      )
    }));
  };

  const handleZipCodeChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 9) {
      const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
      handleLocationChange(index, 'zipCode', formatted);
    }
  };

  const addLocation = () => {
    setInputs(prev => ({
      ...prev,
      storeLocations: [...prev.storeLocations, {
        streetName: "",
        optionalSecondaryStreetDetails: "",
        city: "",
        state: "",
        zipCode: ""
      }]
    }));
  };

  const removeLocation = (index: number) => {
    if (inputs.storeLocations.length > 1) {
      setInputs(prev => ({
        ...prev,
        storeLocations: prev.storeLocations.filter((_, i) => i !== index)
      }));
    }
  };

  // Submit to AWS Amplify Data API
  const handleSubmit = async (
   e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const storeLogoUrl = inputs.storeLogoUrl;
    let safeStoreLogoUrl: string;
    if(storeLogoUrl && isSafeUrl(storeLogoUrl)) {
      const url = new URL(storeLogoUrl);
      safeStoreLogoUrl = url.href;
    } else {
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Store logo URL is not safe or valid.',
        icon: 'error',
      })
      throw new Error("Invalid store logo URL upon submission")
    }

    const sanitizedStoreInputs = {
      storeName: DOMPurify.sanitize(inputs.storeName),
      storeLocations: inputs.storeLocations.map(location => ({
        streetName: DOMPurify.sanitize(location.streetName),
        optionalSecondaryStreetDetails: DOMPurify.sanitize(location.optionalSecondaryStreetDetails || ''),
        city: DOMPurify.sanitize(location.city),
        state: DOMPurify.sanitize(location.state),
        zipCode: DOMPurify.sanitize(location.zipCode)
      })),
      isBigChain: inputs.isBigChain,
      storeLogoUrl: DOMPurify.sanitize(safeStoreLogoUrl) || "",
    }

    try {
      await client.models.Store.create(sanitizedStoreInputs);
      const successMessage = `Store: ${sanitizedStoreInputs.storeName} created successfully`;
      Swal.fire({
        title: 'New Store Successfully Created',
        text: successMessage,
        icon: 'success',
      })

      setInputs(initialStoreInputs);
    } catch (error) {
      console.error("Error creating store:", error);
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Failed to create store. Please try again. Contact admin for support if issue persists.',
        icon: 'error',
      })
      return;
    } 
  };

  return (
    <>
      <title>Create New Store - Price Wolves</title>
      <meta
        name="description"
        content="Create a Store not yet in our system on Price Wolves."
      />
      <meta 
        property="og:title" 
        content="Create New Store | Price Wolves" 
      />
      <meta
        property="og:description"
        content="Create a Store not yet in our system on Price Wolves."
      />
      <meta property="og:type" content="website" />
      <link
        rel="canonical"
        href="https://pricewolves.com/create-new-store"
      />

      <main className="main">
        <section className="page-container">
          <div className="page-header">
            <h1 className="page-title">Create New Store</h1>
          </div>
          <form
            className="add-form"
            onSubmit={handleSubmit}
            method="POST"
          >
            <label htmlFor="storeName">Store Name<span className="required-form-item">*</span></label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              placeholder="Store Name (required)"
              value={DOMPurify.sanitize(inputs.storeName)}
              onChange={handleChange}
              autoComplete="off"
              maxLength={120}
              required
            />

            <label>Store Locations<span className="required-form-item">*</span></label>
            {inputs.storeLocations.map((location, index) => (
              <div key={index} className="store-locations-group">
                <h4>Location {index + 1}</h4>
                <label>Street Name<span className="required-form-item">*</span></label>
                <input
                  type="text"
                  placeholder="Street Name (required)"
                  value={DOMPurify.sanitize(location.streetName)}
                  onChange={(e) => handleLocationChange(index, 'streetName', e.target.value)}
                  autoComplete="off"
                  maxLength={120}
                  required
                />
                <label>APT/Unit/Suite #</label>
                <input
                  type="text"
                  placeholder="APT/Unit/Suite #, etc. (optional)"
                  value={DOMPurify.sanitize(location.optionalSecondaryStreetDetails || '')}
                  onChange={(e) => handleLocationChange(index, 'optionalSecondaryStreetDetails', e.target.value)}
                  autoComplete="off"
                  maxLength={120}
                />
                <label>City<span className="required-form-item">*</span></label>
                <input
                  type="text"
                  placeholder="City (required)"
                  value={DOMPurify.sanitize(location.city)}
                  onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
                  autoComplete="off"
                  maxLength={120}
                  required
                />
                <label>State<span className="required-form-item">*</span></label>
                <StatesDropdownSelect
                  value={DOMPurify.sanitize(location.state)}
                  onChange={(value) => handleLocationChange(index, 'state', value)}
                />
                <label>Zip Code (5 or 9 digits, 9-digit format optional)<span className="required-form-item">*</span></label>
                <input
                  type="text"
                  placeholder="12345 or 12345-6789"
                  value={DOMPurify.sanitize(location.zipCode)}
                  onChange={(e) => handleZipCodeChange(index, e.target.value)}
                  pattern="^\d{5}(-\d{4})?$"
                  title="Enter 5 digits (12345) or 9 digits (12345-6789)"
                  minLength={5}
                  maxLength={10}
                  required
                />
                <div className="location-buttons">
                  {index === inputs.storeLocations.length - 1 && (
                    <button type="button" className="location-button" onClick={addLocation}>Add Another Location</button>
                  )}
                  {inputs.storeLocations.length > 1 && (
                    <button type="button" className="location-button" onClick={() => removeLocation(index)}>Remove Location</button>
                  )}
                </div>
              </div>
            ))}

            <div className="big-chain-group">
              <span>Is this a big chain store?<span className="required-form-item">*</span></span>
              <div className="radio-options">
                <label htmlFor="isBigChainYes">
                  <input
                    type="radio"
                    id="isBigChainYes"
                    name="isBigChain"
                    value="true"
                    checked={inputs.isBigChain === true}
                    onChange={() => setInputs(prev => ({ ...prev, isBigChain: true }))}
                    autoComplete="off"
                    required
                  /> Yes
                </label>
                <label htmlFor="isBigChainNo">
                  <input
                    type="radio"
                    id="isBigChainNo"
                    name="isBigChain"
                    value="false"
                    checked={inputs.isBigChain === false}
                    onChange={() => setInputs(prev => ({ ...prev, isBigChain: false }))}
                    autoComplete="off"
                    required
                  /> No
                </label>
              </div>
            </div>

            <label htmlFor="storeLogoUrl">Store Logo Url<span className="required-form-item">*</span></label>
            <input
              type="text"
              id="storeLogoUrl"
              name="storeLogoUrl"
              placeholder="Store Logo url (required)"
              value={DOMPurify.sanitize(inputs.storeLogoUrl)}
              onChange={handleChange}
              autoComplete="off"
              required
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

export default CreateNewStore
