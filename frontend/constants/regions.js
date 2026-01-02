// src/constants/regions.js

/**
 * Static metadata for AWS Regions.
 * Includes ID, Display Name, and Geographical Zone.
 * PUE (Power Usage Effectiveness) defaults to 1.15 for all regions.
 */
export const AWS_REGIONS = [
  // --- North America (US) ---
  {
    id: "us-east-1",
    name: "US East (N. Virginia)",
    zone: "North America",
    pue: 1.15,
  },
  {
    id: "us-east-2",
    name: "US East (Ohio)",
    zone: "North America",
    pue: 1.15,
  },
  {
    id: "us-west-1",
    name: "US West (N. California)",
    zone: "North America",
    pue: 1.15,
  },
  {
    id: "us-west-2",
    name: "US West (Oregon)",
    zone: "North America",
    pue: 1.15,
  },

  // --- North America (Canada & Mexico) ---
  {
    id: "ca-central-1",
    name: "Canada Central",
    zone: "Canada",
    pue: 1.15,
  },
  {
    id: "ca-west-1",
    name: "Canada West",
    zone: "Canada",
    pue: 1.15,
  },
  {
    id: "mx-central-1",
    name: "Mexico Central",
    zone: "North America",
    pue: 1.15,
  },

  // --- South America ---
  {
    id: "sa-east-1",
    name: "South America (São Paulo)",
    zone: "South America",
    pue: 1.15,
  },

  // --- Europe ---
  {
    id: "eu-west-1",
    name: "Europe (Ireland)",
    zone: "Europe",
    pue: 1.15,
  },
  {
    id: "eu-west-2",
    name: "Europe (London)",
    zone: "Europe",
    pue: 1.15,
  },
  {
    id: "eu-west-3",
    name: "Europe (Paris)",
    zone: "Europe",
    pue: 1.15,
  },
  {
    id: "eu-central-1",
    name: "Europe (Frankfurt)",
    zone: "Europe",
    pue: 1.15,
  },
  {
    id: "eu-central-2",
    name: "Europe (Zurich)",
    zone: "Europe",
    pue: 1.15,
  },
  {
    id: "eu-south-1",
    name: "Europe (Milan)",
    zone: "Europe",
    pue: 1.15,
  },
  {
    id: "eu-south-2",
    name: "Europe (Spain)",
    zone: "Europe",
    pue: 1.15,
  },
  {
    id: "eu-north-1",
    name: "Europe (Stockholm)",
    zone: "Europe",
    pue: 1.15,
  },

  // --- Middle East & Israel ---
  {
    id: "il-central-1",
    name: "Israel (Tel Aviv)",
    zone: "Middle East",
    pue: 1.15,
  },
  /*{
    id: "me-south-1",
    name: "Middle East (Bahrain)",
    zone: "Middle East",
    pue: 1.15,
  },*/
  {
    id: "me-central-1",
    name: "Middle East (UAE)",
    zone: "Middle East",
    pue: 1.15,
  },

  // --- Africa ---
  {
    id: "af-south-1",
    name: "Africa (Cape Town)",
    zone: "Africa",
    pue: 1.15,
  },

  // --- Asia Pacific ---
  {
    id: "ap-south-1",
    name: "Asia Pacific (Mumbai)",
    zone: "Asia Pacific",
    pue: 1.15,
  },
  {
    id: "ap-south-2",
    name: "Asia Pacific (Hyderabad)",
    zone: "Asia Pacific",
    pue: 1.15,
  },
  /*{
    id: "ap-southeast-1",
    name: "Asia Pacific (Singapore)",
    zone: "Asia Pacific",
    pue: 1.15,
  },*/
  {
    id: "ap-southeast-2",
    name: "Asia Pacific (Sydney)",
    zone: "Asia Pacific",
    pue: 1.15,
  },
  {
    id: "ap-southeast-3",
    name: "Asia Pacific (Jakarta)",
    zone: "Asia Pacific",
    pue: 1.15,
  },
  {
    id: "ap-southeast-4",
    name: "Asia Pacific (Melbourne)",
    zone: "Asia Pacific",
    pue: 1.15,
  },
  {
    id: "ap-northeast-1",
    name: "Asia Pacific (Tokyo)",
    zone: "Asia Pacific",
    pue: 1.15,
  },
  {
    id: "ap-northeast-2",
    name: "Asia Pacific (Seoul)",
    zone: "Asia Pacific",
    pue: 1.15,
  },
  {
    id: "ap-northeast-3",
    name: "Asia Pacific (Osaka)",
    zone: "Asia Pacific",
    pue: 1.15,
  },
  {
    id: "ap-east-1",
    name: "Asia Pacific (Hong Kong)",
    zone: "Asia Pacific",
    pue: 1.15,
  },
  /*{
    id: "ap-east-2",
    name: "Asia Pacific (Taipei)",
    zone: "Asia Pacific",
    pue: 1.15,
  },*/

 /* // --- China ---
  {
    id: "cn-north-1",
    name: "China (Beijing)",
    zone: "China",
    pue: 1.15,
  },
  {
    id: "cn-northwest-1",
    name: "China (Ningxia)",
    zone: "China",
    pue: 1.15,
  },*/
];

// Helper: Fast Lookup Map (id -> object)
// Usage: const region = REGION_LOOKUP["us-east-1"];
export const REGION_LOOKUP = AWS_REGIONS.reduce((acc, region) => {
  acc[region.id] = region;
  return acc;
}, {});