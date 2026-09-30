import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Toolbar from '../components/Toolbar';
import ItemsContainer from '../components/ItemsContainer';

export default function SharedWishlist() {
  const { userId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(window.innerWidth >= 768 ? 'grid' : 'list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortMethod, setSortMethod] = useState('newest');

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    }
    loadData();
  }, [userId]);

  return (
    <div className="app-shell">
      <header className="global-header">
        <div className="brand-group">
          <div className="brand-logo" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <div className="brand-titles">
            <h1>Shared Wishlist</h1>
            <p className="subtitle">Curated collection of items.</p>
          </div>
        </div>
        <div>
           <Link to="/signup" className="primary-btn">Create your own</Link>
        </div>
      </header>
      
      <main className="app-layout" style={{ display: 'block' }}>
        <section className="main-col">
          <Toolbar 
            items={items}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            filterCategory={filterCategory} setFilterCategory={setFilterCategory}
            sortMethod={sortMethod} setSortMethod={setSortMethod}
            viewMode={viewMode} setViewMode={setViewMode}
          />
          
          <ItemsContainer 
            items={items} 
            loading={loading}
            viewMode={viewMode}
            searchQuery={searchQuery}
            filterCategory={filterCategory}
            sortMethod={sortMethod}
            setEditingItem={() => {}} 
            refreshItems={() => {}} 
            readOnly={true}
          />
        </section>
      </main>
    </div>
  );
}
