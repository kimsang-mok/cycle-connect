import { Price } from './value-objects/price.value-object';

export interface BikeProps {
  ownerId: string;
  type: BikeTypes;
  model: string;
  enginePower: number /* e.g. CC for motorbike or gear count for bicycle */;
  pricePerDay: Price;
  description: string;
  isActive: boolean;
  photoKeys: string[];
  thumbnailKey: string;
}

export interface CreateBikeProps {
  ownerId: string;
  type: BikeTypes;
  model: string;
  enginePower: number;
  pricePerDay: Price;
  description: string;
  photoKeys: string[];
  thumbnailKey?: string;
}

export enum BikeTypes {
  motorbike = 'motorbike',
  bicycle = 'bicycle',
}

export interface UpdateDetailsProps {
  description: string;
  pricePerDay: number;
  enginePower?: number;
  model?: string;
  photoKeys?: string[];
  thumbnailKey?: string;
}
