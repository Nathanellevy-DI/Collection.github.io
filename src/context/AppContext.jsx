import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Collections: An array of collection objects { id, name, icon? }
    // We start with an empty array as requested
    const [collections, setCollections] = useLocalStorage('lumina_collections', []);

    // Items: An array of item objects { id, collectionId, name, value, image, owned, ... }
    // We change the key to ensure a fresh start
    const [items, setItems] = useLocalStorage('lumina_items', []);

    const [activeCollectionId, setActiveCollectionId] = useState(collections[0]?.id || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentView, setCurrentView] = useState('collection'); // 'collection', 'overview', 'analysis'

    const addCollection = (name) => {
        const newId = name.toLowerCase().replace(/\s+/g, '-');
        const newCollection = {
            id: newId,
            name,
        };
        setCollections([...collections, newCollection]);
        setActiveCollectionId(newId);
    };

    const addItem = (item) => {
        const newItem = {
            id: crypto.randomUUID(),
            collectionId: activeCollectionId,
            dateAdded: new Date().toISOString(),
            ...item,
        };
        setItems([...items, newItem]);
    };

    const updateItem = (id, updates) => {
        setItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    };

    const deleteItem = (id) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const toggleOwned = (id) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, owned: !item.owned } : item
            )
        );
    };

    // Filter items based on active collection and search query
    const filteredItems = items.filter((item) => {
        const matchesCollection = item.collectionId === activeCollectionId;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCollection && matchesSearch;
    });

    // Theme
    const [theme, setTheme] = useLocalStorage('tracker_theme', 'dark');

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const value = {
        collections,
        activeCollectionId,
        setActiveCollectionId,
        addCollection,
        items: filteredItems,
        allItems: items,
        addItem,
        updateItem,
        deleteItem,
        toggleOwned,
        searchQuery,
        setSearchQuery,
        theme,
        toggleTheme,
        currentView,
        setCurrentView,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
