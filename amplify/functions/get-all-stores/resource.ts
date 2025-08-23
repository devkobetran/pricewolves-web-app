import { defineFunction } from '@aws-amplify/backend';

export const getAllStores = defineFunction({
    name: 'get-all-stores',
    entry: './handler.ts', 
    environment: {
        STORE_TABLE_NAME: "Store-je2axagd2fgxbjftvk7lknyuwm-NONE"
    },
})
