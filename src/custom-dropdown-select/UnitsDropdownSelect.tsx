import Select from "react-dropdown-select";

interface UnitOption {
  label: string;
  value: string;
}

interface UnitsDropdownSelect {
    onChange: (value: string) => void;
    value?: string;
}

const unitOptions = [
  { label: "count", value: "ct" },
  { label: "set", value: "set" },
  { label: "inch", value: "in" },
  { label: "foot", value: "ft" },
  { label: "centimeter", value: "cm" },
  { label: "ounce", value: "oz" },
  { label: "pound", value: "lb" },
  { label: "gram", value: "g" },
  { label: "milligram", value: "mg" },
  { label: "kilogram", value: "kg" },
  { label: "milliliter", value: "mL" },
  { label: "liter", value: "L" },
  { label: "fluid ounce", value: "fl oz" },
  { label: "cup", value: "cup" },
  { label: "pint", value: "pt" },
  { label: "quart", value: "qt" },
  { label: "gallon", value: "gal" }
];

const UnitsDropdownSelect: React.FC<UnitsDropdownSelect> = ({ onChange, value }) => {
    const handleChange = (values: UnitOption[]) => {
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
            options={unitOptions}
            values={value ? unitOptions.filter(option => option.value === value) : []}
            onChange={handleChange}
            style={{
                color: "#888"
            }}
            placeholder="Select a unit"
        />
    )
}

export default UnitsDropdownSelect;