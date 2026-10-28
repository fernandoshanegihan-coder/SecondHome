export type EntityChoice = {
  id: string;
  name: string;
  kind: string;
  detail?: string;
};
export type CityChoice = {
  id: string;
  label: string;
  lat: number;
  lon: number;
};
export type Preferences = {
  budget?: string;
  atmosphere?: string;
  area?: string;
};
export type DiscoveryRequest = {
  city: CityChoice;
  tastes: EntityChoice[];
  preferences: Preferences;
};
export type PlaceCandidate = {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lon?: number;
  description?: string;
  image?: string;
  category?: string;
  tags: string[];
  evidence: string[];
  affinity?: number;
  price?: number;
  ambience?: string;
};
export type Discovery = {
  place: PlaceCandidate;
  reason: string;
  mapUrl: string;
};
export type DiscoveryResult = {
  items: Discovery[];
  warnings: string[];
  steps: string[];
};
export type ReplacementRequest = {
  context: DiscoveryRequest;
  current: Discovery[];
  replaceId: string;
  feedback: string;
  excludedIds?: string[];
};
