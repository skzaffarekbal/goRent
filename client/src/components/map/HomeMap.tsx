import type { ICar } from '@gorent/shared';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { generateSvg } from '@/utils/helpers';

interface ICoordinates {
  name: string;
  image?: string;
  id: string;
  lat: number;
  lng: number;
  rentPerDay: number | string;
}

type Props = {
  cars: ICar[];
};

const createMarkerIcon = (price: string) => {
  const priceTagSvg = generateSvg(price);
  return priceTagSvg;
};

const infoWindowContent = (id: string, name: string, rentPerDay: string, image: string) => {
  return `
    <div class="font-sans max-w-55 rounded-lg overflow-hidden shadow-md bg-white">
      <img 
        src="${image}" 
        alt="${name}" 
        class="w-full h-30 object-cover block" 
      />
      <div class="p-2 bg-white flex justify-center items-center">
        <h4 class="m-0 text-sm font-semibold">
          <a href="/car/${id}" class="text-blue-600 hover:underline cursor-pointer" target="_blank" rel="noopener noreferrer">
            ${name} - $${rentPerDay}/day
          </a>
        </h4>
      </div>
    </div>
  `;
};

// Set options once outside the component to avoid re-initializing on every render
setOptions({
  key: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  libraries: ['maps', 'marker', 'core'],
});

function HomeMap({ cars }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const coordinates: ICoordinates[] = cars?.map((car) => ({
    name: car.name,
    id: car?.id,
    image: car.images?.[0]?.url,
    lat: car.location?.coordinates?.[1],
    lng: car.location?.coordinates?.[0],
    rentPerDay: car.rentPerDay || 'N/A',
  }));

  useEffect(() => {
    let isMounted = true;

    const loadMap = async () => {
      if (!mapRef.current) return;

      const { Map } = await importLibrary('maps');

      if (isMounted && !googleMapRef.current) {
        googleMapRef.current = new Map(mapRef.current, {
          mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
        });
      }
    };

    loadMap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!googleMapRef.current || !coordinates || coordinates.length === 0) return;

    const mapInstance = googleMapRef.current;

    const parser = new DOMParser();
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    (async () => {
      const [{ InfoWindow }, { AdvancedMarkerElement }, { LatLngBounds }] = await Promise.all([
        importLibrary('maps'),
        importLibrary('marker'),
        importLibrary('core'),
      ]);

      if (coordinates.length === 1) {
        mapInstance.setCenter({ lat: coordinates[0].lat, lng: coordinates[0].lng });
        mapInstance.setZoom(18);
      } else {
        const bounds = new LatLngBounds();
        coordinates.forEach(({ lat, lng }) => {
          bounds.extend({ lat, lng });
        });
        mapInstance.fitBounds(bounds);
      }

      coordinates.forEach(({ id, name, lat, lng, image, rentPerDay }) => {
        const marker = new AdvancedMarkerElement({
          position: { lat, lng },
          map: mapInstance,
          content: parser.parseFromString(createMarkerIcon(rentPerDay.toString()), 'image/svg+xml')
            .documentElement,
        });

        const contentString = infoWindowContent(id, name, rentPerDay.toString(), image);

        const infoWindow = new InfoWindow({
          content: contentString,
        });
        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
        });

        markersRef.current.push(marker);
      });
    })();
  }, [coordinates]);

  return (
    <Card className='w-full flex-1'>
      <div className='h-screen' ref={mapRef} />
    </Card>
  );
}

export default HomeMap;
