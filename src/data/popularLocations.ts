import { LocationPoint } from '../types';

export interface CityPreset {
  id: string;
  name: string;
  state: string;
  center: [number, number];
  popularRoutes: {
    title: string;
    description: string;
    pickup: LocationPoint;
    destination: LocationPoint;
  }[];
  locations: LocationPoint[];
}

export const CITIES: CityPreset[] = [
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'Delhi / UP / Haryana',
    center: [28.6139, 77.2090],
    popularRoutes: [
      {
        title: 'Noida Sec 62 ➔ Connaught Place',
        description: 'Office to Central Hub • ~19 km',
        pickup: {
          name: 'Electronic City, Sector 62, Noida',
          shortName: 'Noida Sector 62',
          lat: 28.6280,
          lng: 77.3649,
          address: 'Sector 62, Noida, Uttar Pradesh 201309'
        },
        destination: {
          name: 'Connaught Place, Inner Circle, New Delhi',
          shortName: 'Connaught Place (CP)',
          lat: 28.6328,
          lng: 77.2197,
          address: 'Connaught Place, New Delhi, Delhi 110001'
        }
      },
      {
        title: 'Cyber City ➔ IGI Airport T3',
        description: 'Gurugram Tech Park to Airport • ~11 km',
        pickup: {
          name: 'DLF Cyber City, DLF Phase 2, Gurugram',
          shortName: 'DLF Cyber City',
          lat: 28.4950,
          lng: 77.0895,
          address: 'Cyber City, Gurugram, Haryana 122002'
        },
        destination: {
          name: 'Indira Gandhi International Airport, Terminal 3',
          shortName: 'IGI Airport T3',
          lat: 28.5562,
          lng: 77.0999,
          address: 'Terminal 3, IGI Airport, New Delhi 110037'
        }
      },
      {
        title: 'Hauz Khas Social ➔ India Gate',
        description: 'South Delhi to Central Vista • ~10 km',
        pickup: {
          name: 'Hauz Khas Village, New Delhi',
          shortName: 'Hauz Khas Village',
          lat: 28.5539,
          lng: 77.1944,
          address: 'Hauz Khas, New Delhi 110016'
        },
        destination: {
          name: 'India Gate, Rajpath, New Delhi',
          shortName: 'India Gate',
          lat: 28.6129,
          lng: 77.2295,
          address: 'Rajpath, India Gate, New Delhi 110001'
        }
      }
    ],
    locations: [
      { name: 'Noida Sector 62, Metro Station', shortName: 'Noida Sec 62', lat: 28.6280, lng: 77.3649 },
      { name: 'Connaught Place, New Delhi', shortName: 'Connaught Place', lat: 28.6328, lng: 77.2197 },
      { name: 'DLF Cyber City, Gurugram', shortName: 'DLF Cyber City', lat: 28.4950, lng: 77.0895 },
      { name: 'Indira Gandhi International Airport (T3)', shortName: 'Delhi Airport T3', lat: 28.5562, lng: 77.0999 },
      { name: 'Hauz Khas Village, South Delhi', shortName: 'Hauz Khas', lat: 28.5539, lng: 77.1944 },
      { name: 'Akshardham Temple, East Delhi', shortName: 'Akshardham', lat: 28.6127, lng: 77.2773 },
      { name: 'Chandni Chowk, Old Delhi', shortName: 'Chandni Chowk', lat: 28.6506, lng: 77.2303 },
      { name: 'Indirapuram Habitat Centre, Ghaziabad', shortName: 'Indirapuram', lat: 28.6392, lng: 77.3713 }
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    center: [12.9716, 77.5946],
    popularRoutes: [
      {
        title: 'Indiranagar ➔ Koramangala Sony Signal',
        description: '100ft Road to Koramangala 4th Block • ~7 km',
        pickup: {
          name: '100 Feet Road, Indiranagar, Bengaluru',
          shortName: 'Indiranagar',
          lat: 12.9784,
          lng: 77.6408,
          address: 'Indiranagar, Bengaluru, Karnataka 560038'
        },
        destination: {
          name: 'Sony World Signal, Koramangala, Bengaluru',
          shortName: 'Koramangala 4th Block',
          lat: 12.9345,
          lng: 77.6265,
          address: 'Koramangala, Bengaluru, Karnataka 560034'
        }
      },
      {
        title: 'Whitefield ITPL ➔ MG Road Metro',
        description: 'Tech Hub to Central Business District • ~16 km',
        pickup: {
          name: 'ITPB / International Tech Park, Whitefield',
          shortName: 'Whitefield ITPL',
          lat: 12.9863,
          lng: 77.7337,
          address: 'Whitefield, Bengaluru, Karnataka 560066'
        },
        destination: {
          name: 'MG Road Metro Station, Bengaluru',
          shortName: 'MG Road',
          lat: 12.9754,
          lng: 77.6066,
          address: 'MG Road, Bengaluru, Karnataka 560001'
        }
      }
    ],
    locations: [
      { name: 'Indiranagar 100 Feet Road, Bengaluru', shortName: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
      { name: 'Koramangala 4th Block, Bengaluru', shortName: 'Koramangala', lat: 12.9345, lng: 77.6265 },
      { name: 'Whitefield ITPL, Bengaluru', shortName: 'Whitefield ITPL', lat: 12.9863, lng: 77.7337 },
      { name: 'Kempegowda International Airport (BLR)', shortName: 'BLR Airport', lat: 13.1986, lng: 77.7066 },
      { name: 'MG Road Metro Station, Bengaluru', shortName: 'MG Road', lat: 12.9754, lng: 77.6066 },
      { name: 'HSR Layout Sector 2, Bengaluru', shortName: 'HSR Layout', lat: 12.9116, lng: 77.6389 }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    center: [19.0760, 72.8777],
    popularRoutes: [
      {
        title: 'BKC Complex ➔ Marine Drive',
        description: 'Financial Hub to South Mumbai • ~18 km',
        pickup: {
          name: 'Bandra Kurla Complex (BKC), Mumbai',
          shortName: 'BKC Complex',
          lat: 19.0657,
          lng: 72.8687,
          address: 'BKC, Bandra East, Mumbai 400051'
        },
        destination: {
          name: 'Marine Drive Promenade, Churchgate, Mumbai',
          shortName: 'Marine Drive',
          lat: 18.9432,
          lng: 72.8230,
          address: 'Marine Drive, Mumbai, Maharashtra 400020'
        }
      }
    ],
    locations: [
      { name: 'Bandra Kurla Complex (BKC), Mumbai', shortName: 'BKC Mumbai', lat: 19.0657, lng: 72.8687 },
      { name: 'Chhatrapati Shivaji Maharaj International Airport (T2)', shortName: 'Mumbai Airport T2', lat: 19.0896, lng: 72.8656 },
      { name: 'Marine Drive, Churchgate, Mumbai', shortName: 'Marine Drive', lat: 18.9432, lng: 72.8230 },
      { name: 'Andheri West Station, Mumbai', shortName: 'Andheri West', lat: 19.1197, lng: 72.8464 },
      { name: 'Powai Hiranandani Gardens, Mumbai', shortName: 'Powai Hiranandani', lat: 19.1197, lng: 72.9051 }
    ]
  }
];

export const DEFAULT_PICKUP: LocationPoint = CITIES[0].popularRoutes[0].pickup;
export const DEFAULT_DESTINATION: LocationPoint = CITIES[0].popularRoutes[0].destination;
