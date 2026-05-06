// REGIONS: maps UI labels to Ticketmaster countryCode filter values.
// Empty countryCode = Global (no filter sent to API).
// ZA = South Africa (Ticketmaster's supported African market).
// KE = Kenya (may return empty results — not in TM's documented coverage).
export const REGIONS = [
  { label: 'Global', value: 'global', countryCode: '' },
  { label: 'Africa', value: 'africa', countryCode: 'ZA' },
  { label: 'Kenya', value: 'kenya', countryCode: 'KE' },
  { label: 'United States', value: 'us', countryCode: 'US' },
  { label: 'Canada', value: 'ca', countryCode: 'CA' },
  { label: 'United Kingdom', value: 'gb', countryCode: 'GB' },
  { label: 'Australia', value: 'au', countryCode: 'AU' },
];

// CATEGORIES: maps UI labels to Ticketmaster segmentName filter values.
// Empty segmentName = General (no segment filter sent to API, returns all types).
// Values must match Ticketmaster's exact segment names — do not rename them.
export const CATEGORIES = [
  { label: 'General', value: 'general', segmentName: '' },
  { label: 'Music', value: 'music', segmentName: 'Music' },
  { label: 'Sports', value: 'sports', segmentName: 'Sports' },
  { label: 'Arts & Theatre', value: 'arts-theatre', segmentName: 'Arts & Theatre' },
  { label: 'Film', value: 'film', segmentName: 'Film' },
  { label: 'Miscellaneous', value: 'misc', segmentName: 'Miscellaneous' },
];