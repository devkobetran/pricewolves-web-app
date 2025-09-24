import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import type { PriceHistory } from "../types/priceHistory";

export interface ItemCardProps {
  id: string;
  itemImageUrl: string;
  itemName: string;
  barcode?: string;
  description: string;
  category: string;
  storeName: string;
  isDiscount: boolean;
  itemPrice: number;
  discountedPrice?: number;
  priceHistory?: PriceHistory[];
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  itemImageUrl,
  itemName,
  barcode,
  description,
  category,
  storeName,
  isDiscount,
  itemPrice,
  discountedPrice,
  priceHistory
}) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/edit-item/${id}`);
  };

  const formatPrice = (price: number) => {
    return price % 1 === 0 ? `${price}` : `${price.toFixed(2)}` 
  }

    return (
        <div className="item-card">
            <img src={itemImageUrl} alt={itemName}/>
            <h2>{itemName}</h2>
            <div className="item-barcode">{barcode}</div>
            <p>{description}</p>
            <div className="item-category">{category}</div>
            <div className="item-store">{storeName}</div>
            <div className="item-price">
              {isDiscount && discountedPrice !== undefined ? (
                  <div>
                  <p>${formatPrice(discountedPrice)}</p>
                  <s>${formatPrice(itemPrice)}</s>
                  </div> 
              ) : (
                  <p>${formatPrice(itemPrice)}</p>
              )}
            </div>
            <button className="button edit-button" onClick={handleEditClick}>
                <FontAwesomeIcon icon={faPencilAlt} /> Edit
            </button>
        
          {/* price history stuff */}
          {Array.isArray(priceHistory) && priceHistory.length > 0 && (
            <div className="price-history">
              <h4>Price History</h4>
              <table className="price-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {[...priceHistory]
                    .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime())
                    .map((h) => (
                      <tr key={h.id}>
                      <td>
                        {new Date(h.changedAt).toLocaleDateString(undefined, {
                          year: '2-digit',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </td>
                      <td>
                        {h.discountedPrice !== undefined && h.discountedPrice !== null
                          ? (
                            <span>${formatPrice(h.discountedPrice)}</span>
                          ) : (
                            <span>${formatPrice(h.price)}</span>
                          )}
                      </td>
                    </tr>
                    ))}
                </tbody>
              </table>
            </div>
            )}
        </div>
    )
}

export default ItemCard;