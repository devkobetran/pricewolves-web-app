import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

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
}) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/edit-item/${id}`);
  };

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
                <p>${discountedPrice}</p>
                <s>${itemPrice}</s>
                </div> 
            ) : (
                <p>${itemPrice}</p>
            )}
            </div>
            <button className="button edit-button" onClick={handleEditClick}>
                <FontAwesomeIcon icon={faPencilAlt} /> Edit
            </button>
        </div>
    )
}

export default ItemCard;