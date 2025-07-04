/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Indexer API
 * The Querys for the NFT Indexer
 * OpenAPI spec version: 1.0
 */
import type { CollectionOffer } from './collectionOffer';
import type { Nft } from './nft';

export interface Collection {
  type: string;
  name: string;
  description: string;
  imageUrl: string;
  verified: boolean;
  volume: number;
  createdAt: string;
  updatedAt: string;
  bannerUrl?: string;
  CollectionOffer: CollectionOffer[];
  nfts: Nft[];
}
