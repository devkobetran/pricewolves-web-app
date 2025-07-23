import React from "react"
import { Link } from "react-router-dom";

const AddItem: React.FC = () => {
  return (
    <main className="main">
      <section className="page-container">
        <h1 className="page-title">Add Item</h1>
          <form className="add-form">
            <label htmlFor="itemName"> Item Name </label>
            <input type="text" id="itemName" name="itemName" placeholder="Item Name" required />
          
            <label htmlFor="store"> Store </label>
            <input type="text" id="store" name="store" placeholder="Store" required />
            {/* <Link to="/create-new-store"> Create New Store</Link> */}
          
            <label htmlFor="units"> Units </label>
            <input type="text" id="units" name="units" placeholder="Units" />
          
            <label htmlFor="itemPrice"> Item Price</label>
            <input type="number" id="itemPrice" name="itemPrice" placeholder="Item Price" step="0.01" min="0" required />
          
            <label htmlFor="barcode"> Barcode (Optional) </label>
            <input type="text" id="barcode" name="barcode" placeholder="Barcode" />
          
            <label htmlFor="description"> Item Description (Optional) </label>
            <input type="text" id="description" name="description" placeholder="Description" />
          
            <label htmlFor="otherStoreItemListings"> Other Store Item Listings </label>
            <input type="text" id="otherStoreItemListings" name="otherStoreItemListings" placeholder="Other Store Item Listings" />
            
            <div className="discount-group">
              <label htmlFor="isDiscount">Discount?</label>
              <input type="checkbox" id="isDiscount" name="isDiscount" />
            </div>
          
            <label htmlFor="discountedPrice"> Discounted Price</label>
            <input type="number" id="discountedPrice" name="discountedPrice" placeholder="Discounted Price" step="0.01" min="0" />
          
            <button type="submit" className="button">Submit</button>

          </form>
      </section>
    </main>
  );
};

export default AddItem
