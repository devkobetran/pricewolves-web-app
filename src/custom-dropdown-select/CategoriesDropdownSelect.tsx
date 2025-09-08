import Select from "react-dropdown-select";

interface CategoryOption {
  label: string;
  value: string;
}

interface CategoriesDropdownSelectProps {
    onChange: (value: string) => void;
    value?: string;
}

export const categoryOptions = [
  { label: "Meat", value: "Meat" },
  { label: "Seafood", value: "Seafood" },
  { label: "Fruits & Vegetables", value: "Fruits & Vegetables" },
  { label: "Bakery", value: "Bakery" },
  { label: "Grains", value: "Grains" },
  { label: "Coffee & Tea", value: "Coffee & Tea" },
  { label: "Seasoning & Spices", value: "Seasoning & Spices" },
  { label: "Frozen Items", value: "Frozen Items" },
  { label: "Snacks", value: "Snacks" },
  { label: "Packaged Items", value: "Packaged Items" },
  { label: "Sauces", value: "Sauces" },
  { label: "To-go Food", value: "To-go Food" },
  { label: "Household Items", value: "Household Items" },
  { label: "Toiletries", value: "Toiletries" },
  { label: "Personal Care", value: "Personal Care" },
  { label: "OTC Medicines", value: "OTC Medicines" },
  { label: "Drinks", value: "Drinks" },
  { label: "Dairy", value: "Dairy" },
  { label: "Health & Wellness", value: "Health & Wellness" },
    // amazon categories here
  { label: "Clothing, Shoes, Jewelry, Watches", value: "Clothing, Shoes, Jewelry, Watches" },
  { label: "Books", value: "Books" },
  { label: "Movies, Music, Games", value: "Movies, Music, Games" },
  { label: "Electronics & Computers", value: "Electronics & Computers" },
  { label: "Smart Home", value: "Smart Home" },
  { label: "Home, Garden, Tools", value: "Home, Garden, Tools" },
  { label: "Pet Supplies", value: "Pet Supplies" },
  { label: "Toys", value: "Toys" },
  { label: "Baby & Kids", value: "Baby & Kids" },
  { label: "Handmade", value: "Handmade" },
  { label: "Sports & Outdoors", value: "Sports & Outdoors" },
  { label: "Automobile", value: "Automobile" },
  { label: "Industrial", value: "Industrial" },
  {label: "Other", value: "Other"}
];

const CategoriesDropdownSelect: React.FC<CategoriesDropdownSelectProps> = ({ onChange, value }) => {
    const handleChange = (values: CategoryOption[]) => {
        if (values.length > 0) {
        onChange(values[0].value);
        }
    };

    return (
        <Select
            clearable
            searchable
            create
            dropdownHandle
            dropdownPosition="bottom"
            options={categoryOptions}
            values={value ? categoryOptions.filter(option => option.value === value) : []}
            onChange={handleChange}
            style={{
                color: "#888"
            }}
            placeholder="Select a category"
        />
    )
}

export default CategoriesDropdownSelect;