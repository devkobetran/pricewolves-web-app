import type { Schema } from '../../data/resource';
import { env } from '$amplify/env/get-all-stores';
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: 'us-east-1' });

export const handler: Schema["getAllStores"]["functionHandler"] = async () => {
  try {
    const command = new ScanCommand({
      TableName: `${env.STORE_TABLE_NAME}`,
    });

    const response = await client.send(command);

    // Convert DynamoDB items to JavaScript objects
    const items = (response.Items || []).map(item => {
      const { storeName, storeLocations, isBigChain, storeLogoUrl, id, createdAt, updatedAt } = unmarshall(item);
      return { storeName, storeLocations, isBigChain, storeLogoUrl, id, createdAt, updatedAt };
    });
    
    return items;
  } catch (error) {
    console.error("Error scanning DynamoDB table:", error);
    return [];
  }
};