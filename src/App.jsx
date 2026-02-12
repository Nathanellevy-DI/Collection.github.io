import { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/layout/Layout';
import CollectionGrid from './components/collection/CollectionGrid';
import AddItemModal from './components/modals/AddItemModal';
import Overview from './components/dashboard/Overview';
import ValueAnalysis from './components/dashboard/ValueAnalysis';
import Settings from './components/settings/Settings';
import { Search, Scan } from 'lucide-react';

const Dashboard = () => {
  const { activeCollectionId, collections, items, setSearchQuery, searchQuery, addCollection, currentView, setCurrentView } = useAppContext();
  const currentCollection = collections.find(c => c.id === activeCollectionId);

  // UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-4">
          <Scan className="text-white" size={48} />
        </div>
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
          Welcome to Lumina
        </h2>
        <p className="text-gray-400 max-w-md text-lg">
          Your premium collection tracker. Create your first category to get started.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newCollectionName.trim()) addCollection(newCollectionName.trim());
          }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <input
            type="text"
            autoFocus
            placeholder="e.g. Lighters, Coins..."
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-center placeholder:text-gray-600"
          />
          <button
            type="submit"
            disabled={!newCollectionName.trim()}
            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Collection
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header / Search Bar Area - Only show for Collection View */}
      {currentView === 'collection' && (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {currentCollection?.name || 'Collection'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} in this collection
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collection..."
              className="block w-full pl-10 pr-12 py-3 border border-white/10 rounded-2xl leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 sm:text-sm transition-all shadow-lg shadow-black/20"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <button
                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-emerald-400 transition-colors"
                title="Mock Scan"
              >
                <Scan size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Views */}
      {currentView === 'collection' && (
        <CollectionGrid
          onAddItem={() => setIsAddModalOpen(true)}
          onEditItem={handleEditItem}
        />
      )}

      {currentView === 'overview' && <Overview />}
      {currentView === 'analysis' && <ValueAnalysis />}
      {currentView === 'settings' && <Settings />}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        collectionName={currentCollection?.name}
        itemToEdit={editingItem}
      />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </AppProvider>
  );
}

export default App;
