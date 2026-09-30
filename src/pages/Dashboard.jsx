import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import SidebarForm from '../components/SidebarForm';
import StatsOverview from '../components/StatsOverview';
import Toolbar from '../components/Toolbar';
import ItemsContainer from '../components/ItemsContainer';

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(localStorage.getItem('wishlist:viewMode') || (window.innerWidth >= 768 ? 'grid' : 'list'));
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortMethod, setSortMethod] = useState('newest');

  useEffect(() => {
    localStorage.setItem('wishlist:viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    setLoading(true);
    // Fetch Items
    const { data: fetchItems, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!itemsError && fetchItems) {
      setItems(fetchItems);
    }
    
    // Fetch Budget (we can create a profiles table or just use one for now, lets say preferences table. 
    // If not, we can stick to no budget for now or manage via a settings table). 
    // To simplify, let's keep budget in local storage for now or skip it if we haven't made a table yet.
    // Let's create a profile/settings row if possible, but for MVP local storage budget is fine.
    const storedBudget = localStorage.getItem('wishlist:budget');
    if (storedBudget) setBudget(Number(storedBudget));
    
    setLoading(false);
  }

  function handleSaveBudget(newBudget) {
    setBudget(newBudget);
    localStorage.setItem('wishlist:budget', newBudget);
  }

  return (
    <div className="app-shell">
      <Header refreshItems={loadData} />
      
      <main className="app-layout">
        <aside className="sidebar-col" id="sidebarCol">
          <SidebarForm 
            user={user} 
            editingItem={editingItem} 
            setEditingItem={setEditingItem} 
            refreshItems={loadData} 
          />
        </aside>
        
        <section className="main-col">
          <StatsOverview items={items} budget={budget} onSaveBudget={handleSaveBudget} />
          
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
            setEditingItem={setEditingItem}
            refreshItems={loadData}
          />
        </section>
      </main>
    </div>
  );
}
