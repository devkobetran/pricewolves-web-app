export interface ItemCardProps {
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
        </div>
    )
}

export default ItemCard;