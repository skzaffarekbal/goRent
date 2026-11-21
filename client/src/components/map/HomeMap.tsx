import type { ICar } from '@gorent/shared';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
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
  const [isMapReady, setIsMapReady] = useState(false);

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
        const mapInstance = new Map(mapRef.current, {
          mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
          center: { lat: 39.8283, lng: -98.5795 },
          zoom: 3,
        });

        googleMapRef.current = mapInstance;

        // Trigger resize event once map instance is attached to fix gray container bugs
        google.maps.event.addListenerOnce(mapInstance, 'idle', () => {
          google.maps.event.trigger(mapInstance, 'resize');
          setIsMapReady(true);
        });
      }
    };

    loadMap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!googleMapRef.current || !isMapReady) return;

    const mapInstance = googleMapRef.current;

    // 1. Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    if (!coordinates || coordinates.length === 0) return;

    // 2. Helper function to handle center/bounds viewport
    const updateViewport = (LatLngBounds) => {
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
    };

    // 3. Function to load libraries and render markers
    const renderMarkers = async () => {
      const [{ InfoWindow }, { AdvancedMarkerElement }, { LatLngBounds }] = await Promise.all([
        importLibrary('maps'),
        importLibrary('marker'),
        importLibrary('core'),
      ]);

      // Update map viewport
      updateViewport(LatLngBounds);

      // Render individual markers and info windows
      const parser = new DOMParser();
      coordinates.forEach(({ id, name, lat, lng, image, rentPerDay }) => {
        const marker = new AdvancedMarkerElement({
          position: { lat, lng },
          map: mapInstance,
          gmpClickable: true,
          content: parser.parseFromString(createMarkerIcon(rentPerDay.toString()), 'image/svg+xml')
            .documentElement,
        });

        const contentString = infoWindowContent(id, name, rentPerDay.toString(), image);
        const infoWindow = new InfoWindow({
          content: contentString,
        });

        marker.addListener('gmp-click', () => {
          infoWindow.open(mapInstance, marker);
        });

        markersRef.current.push(marker);
      });
    };

    // 4. Conditional call
    renderMarkers();
  }, [coordinates, isMapReady]);

  return (
    <Card className='w-full flex-1'>
      <div className='h-screen' ref={mapRef} />
    </Card>
  );
}

export default HomeMap;
