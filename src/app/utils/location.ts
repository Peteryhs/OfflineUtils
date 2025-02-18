interface LocationRange {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  name: string;
}

interface Region {
  name: string;
  ranges: LocationRange[];
}

// Basic offline location database
// This is a simplified version and can be expanded with more detailed data
const regions: Region[] = [
  {
    name: "North America",
    ranges: [
      {
        name: "Ontario, Canada",
        minLat: 41.676556,
        maxLat: 56.850833,
        minLng: -95.155699,
        maxLng: -74.344322
      },
      {
        name: "United States (Northeast)",
        minLat: 37.000000,
        maxLat: 47.470000,
        minLng: -83.000000,
        maxLng: -66.934570
      },
      {
        name: "United States (Midwest)",
        minLat: 36.970000,
        maxLat: 49.384358,
        minLng: -104.050000,
        maxLng: -83.000000
      },
      {
        name: "United States (South)",
        minLat: 24.396308,
        maxLat: 36.970000,
        minLng: -106.645646,
        maxLng: -75.000000
      },
      {
        name: "United States (West)",
        minLat: 32.528832,
        maxLat: 49.000000,
        minLng: -125.000000,
        maxLng: -104.050000
      },
      {
        name: "Quebec, Canada",
        minLat: 45.000000,
        maxLat: 62.500000,
        minLng: -79.763435,
        maxLng: -57.105509
      },
      {
        name: "British Columbia, Canada",
        minLat: 48.224431,
        maxLat: 60.000000,
        minLng: -139.035693,
        maxLng: -114.054124
      },
      {
        name: "Alberta, Canada",
        minLat: 49.000000,
        maxLat: 60.000000,
        minLng: -120.000000,
        maxLng: -110.000000
      },
      {
        name: "Manitoba, Canada",
        minLat: 49.000000,
        maxLat: 60.000000,
        minLng: -101.365039,
        maxLng: -89.000000
      }
    ]
  },
  {
    name: "Europe",
    ranges: [
      {
        name: "Western Europe",
        minLat: 36.0,
        maxLat: 71.0,
        minLng: -10.0,
        maxLng: 20.0
      },
      {
        name: "Eastern Europe",
        minLat: 36.0,
        maxLat: 71.0,
        minLng: 20.0,
        maxLng: 40.0
      }
    ]
  },
  {
    name: "Asia",
    ranges: [
      {
        name: "East Asia",
        minLat: 20.0,
        maxLat: 55.0,
        minLng: 100.0,
        maxLng: 145.0
      },
      {
        name: "Southeast Asia",
        minLat: -10.0,
        maxLat: 20.0,
        minLng: 95.0,
        maxLng: 140.0
      }
    ]
  }
];

export function estimateLocation(latitude: number, longitude: number): string {
  for (const region of regions) {
    for (const range of region.ranges) {
      if (
        latitude >= range.minLat &&
        latitude <= range.maxLat &&
        longitude >= range.minLng &&
        longitude <= range.maxLng
      ) {
        return `${range.name}, ${region.name}`;
      }
    }
  }
  
  return "Unknown Location";
}