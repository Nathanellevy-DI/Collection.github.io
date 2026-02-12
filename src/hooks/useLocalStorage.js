import { useState, useEffect } from 'react';
import { compressData, decompressData } from '../utils/imageProcessor';

/**
 * Hook to use localStorage with optional LZ-string compression
 * @param {string} key - The key for localStorage
 * @param {any} initialValue - The initial value if key doesn't exist
 * @returns {[any, Function]} - [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
    // Get from local storage then parse stored json or return initialValue
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                // Try to decompress first, assuming it might be compressed
                // If decompression returns null or empty, it might be raw JSON (legacy) or just broken
                // But for this app, we assume all new data is compressed. 
                // We can add a check if it starts with a specific marker if needed, but LZString usually handles it.
                const decompressed = decompressData(item);
                if (decompressed) {
                    return JSON.parse(decompressed);
                }
                // Fallback: try parsing as raw JSON in case it wasn't compressed
                try {
                    return JSON.parse(item);
                } catch {
                    return initialValue;
                }
            }
            return initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Compress and save to local storage
            const jsonString = JSON.stringify(valueToStore);
            const compressed = compressData(jsonString);

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, compressed);
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
};
