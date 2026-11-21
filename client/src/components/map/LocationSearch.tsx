import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MapPinned } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';

interface AutocompleteSuggestion {
  placePrediction?: {
    placeId: string;
    text: {
      text: string;
    };
  };
}

interface PlaceSuggestion {
  placeId: string;
  text: string;
}

interface Props {
  onLocationChange?: (location: string) => void;
}

function LocationSearch({ onLocationChange }: Props) {
  const [open, setOpen] = useState(false);
  const [locationValue, setLocationValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (!val.trim()) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (!inputValue.trim()) return;

    const timer = setTimeout(async () => {
      try {
        const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAP_API_KEY,
          },
          body: JSON.stringify({
            input: inputValue,
          }),
        });

        const data = await response.json();

        if (data.suggestions) {
          const formatted = data.suggestions
            .filter((item: AutocompleteSuggestion) => item.placePrediction)
            .map((item: AutocompleteSuggestion) => ({
              placeId: item.placePrediction!.placeId,
              text: item.placePrediction!.text.text,
            }));
          setSuggestions(formatted);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        setSuggestions([]);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <div className='w-full'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='justify-between w-full items-center'
          >
            <MapPinned className='h-4 w-4 shrink-0 opacity-50 mr-2' />
            <span className='grow truncate text-left'>{locationValue || 'Pick-up location'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-125 p-0'>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder='Search location...'
              value={inputValue}
              onValueChange={handleInputChange}
            />
            <CommandList>
              <CommandEmpty>No location found.</CommandEmpty>
              <CommandGroup heading='Suggested locations'>
                {suggestions.map(({ placeId, text }) => (
                  <CommandItem
                    key={placeId}
                    value={text}
                    onSelect={() => {
                      setLocationValue(text);
                      onLocationChange?.(text);
                      setOpen(false);
                    }}
                  >
                    <div className='flex justify-between items-center w-full'>
                      <div className='flex items-center grow truncate'>
                        <MapPinned className='h-4 w-4 shrink-0 mr-2' />
                        <span className='grow truncate'>{text}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default LocationSearch;
