import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import NodeGeocoder from 'node-geocoder';

const options = {
  provider: 'google' as const,
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

export default geocoder;
