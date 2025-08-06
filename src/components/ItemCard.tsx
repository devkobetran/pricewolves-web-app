export interface Item {
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

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
    return (
        <div className="item-card">
            <img src={item.itemImageUrl} alt={item.itemName}/>
            <h2>{item.itemName}</h2>
            <div className="item-barcode">{item.barcode}</div>
            <p>{item.description}</p>
            <div className="item-category-and-store">{item.category} | {item.storeName}</div>
            <div className="item-price">
            {item.isDiscount && item.discountedPrice !== undefined ? (
                <div>
                <p>${item.discountedPrice}</p>
                <s>${item.itemPrice}</s>
                </div> 
            ) : (
                <p>${item.itemPrice}</p>
            )}
            </div>
        </div>
    )
}

export default ItemCard;