/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Indexer API
 * The Querys for the NFT Indexer
 * OpenAPI spec version: 1.0
 */
import type { DynamicNftAttributeMetadata } from './dynamicNftAttributeMetadata';
import type { Nft } from './nft';

export interface DynamicNftAttribute {
  tokenId: string;
  nftTokenId: string;
  collectionType: string;
  traitType: string;
  value: string;
  equipped: boolean;
  equippedAt?: string;
  name: string;
  imageUrl: string;
  rarity?: string;
  metadata?: DynamicNftAttributeMetadata;
  createdAt: string;
  updatedAt: string;
  attributeType: string;
  baseNft: Nft;
}
