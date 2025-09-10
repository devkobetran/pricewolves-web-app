import React, { useEffect, useState } from 'react';
import Select from "react-dropdown-select";
import type { Store, StoreOption } from "../types";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

interface StoresDropdownSelectProps {
  onChange: (store: Store) => void;
  value?: Store;
}

const StoresDropdownSelect: React.FC<StoresDropdownSelectProps> = ({ onChange, value }) => {
    const [storeOptions, setStoreOptions] = useState<StoreOption[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const { data: stores } = await client.models.Store.list();

            if (stores && stores.length > 0) {
                const storeList: StoreOption[] = stores
                .filter(store => store !== null && store !== undefined)
                .map(store => ({
                    label: store.storeName,
                    value: store as Store
                }));
                setStoreOptions(storeList);
            } else {
                setStoreOptions([]);
                console.log('Issue: No stores available');
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
            setStoreOptions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleChange = (values: StoreOption[]) => {
        if (values.length > 0) {
            onChange(values[0].value);
        }
    };

    return (
        <Select
            options={storeOptions}
            labelField="label"
            valueField="value"
            values={value ? storeOptions.filter(option => option.value.id === value.id) : []}
            onChange={handleChange}
            clearable
            searchable
            dropdownHandle
            dropdownPosition="bottom"
            placeholder={loading ? "Loading stores..." : "Select a store"}
            style={{
                color: "#888"
            }}
        />
    );
}

export default StoresDropdownSelect;