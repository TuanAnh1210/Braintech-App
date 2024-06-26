import { useState } from 'react';

export default function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        const value = localStorage.getItem(key);
        if (!value) {
            localStorage.setItem(key, initialValue);
            return value;
        }

        return JSON.parse(value);
    });

    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            setStoredValue(null);
            localStorage.setItem(key, null);
        }
    };
    return [storedValue, setValue];
}