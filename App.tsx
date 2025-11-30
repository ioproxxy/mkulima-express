import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, useNavigate, Navigate, useLocation, useParams } from 'react-router-dom';
import { ToastContainer, toast, TypeOptions } from 'react-toastify';
import { User, UserRole, Produce, Contract, ContractStatus } from './types';
import { useAuth } from './contexts/AuthContext';
import { useData } from './contexts/DataContext';

// --- ICONS --- //
const HomeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const LeafIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 4 13V8a5 5 0 0 1 10 0v5a7 7 0 0 1-7 7m0 0c-3.33 0-5.46-2.01-6-5h12c-.54 2.99-2.67 5-6 5"></path><path d="M12 13V3"></path></svg>;
const FileTextIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const UserIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const WalletIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>;
const BarChartIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>;
const PlusIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ChevronLeftIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>;
const StarIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;

// --- Notification Context --- //
interface NotificationContextType { notify:(msg:string,type?:TypeOptions)=>void }
const NotificationContext = React.createContext<NotificationContextType|null>(null);
const NotificationProvider = ({ children }: { children:React.ReactNode }) => { const notify = (msg:string,type:TypeOptions='info')=> toast(msg,{ type, position:'top-center'}); const value=useMemo(()=>({notify}),[]); return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>; };
const useNotifier = () => { const ctx=React.useContext(NotificationContext); if(!ctx) throw new Error('useNotifier must be used within NotificationProvider'); return ctx; };

// --- Protected Route --- //
const ProtectedRoute = ({ children }: { children?:React.ReactNode }) => { const { user, isAuthLoading } = useAuth() as any; const location=useLocation(); if(isAuthLoading) return <div className="p-8 text-center">Loading...</div>; if(!user) return <Navigate to="/login" state={{ from: location }} replace/>; return <>{children}</>; };

// --- Layout --- //
const Layout = ({ children, showNav=true }: { children?:React.ReactNode; showNav?:boolean }) => (<div className="max-w-md mx-auto bg-gray-100 min-h-screen flex flex-col font-sans"><main className={`flex-grow ${showNav? 'pb-20':''}`}>{children}</main>{showNav && <BottomNav/>}</div>);

const BottomNav = () => { const { user } = useAuth(); const nav=[{path:'/dashboard',label:'Dashboard',icon:HomeIcon},{path:'/produce',label:'Produce',icon:LeafIcon},{path:'/contracts',label:'Contracts',icon:FileTextIcon},{path:'/insights',label:'Insights',icon:BarChartIcon}]; if(user?.role!==UserRole.ADMIN) nav.push({ path:'/wallet', label:'Wallet', icon:WalletIcon }); nav.push({ path:'/profile', label:'Profile', icon:UserIcon }); return (<nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t"><div className="flex justify-around h-16">{nav.map(item=> <NavLink key={item.path} to={item.path} className={({isActive})=>`flex flex-col items-center justify-center w-full text-sm font-medium ${isActive? 'text-green-600':'text-gray-500 hover:text-green-500'}`}><item.icon className="w-6 h-6 mb-1"/><span>{item.label}</span></NavLink>)}</div></nav>); };

const Header = ({ title, showBack=false }: { title:string; showBack?:boolean }) => { const navigate=useNavigate(); return (<header className="sticky top-0 bg-white shadow-sm z-10 p-4 flex items-center"><h1 className="text-xl font-bold text-center text-gray-800 flex-grow">{title}</h1>{showBack && <button onClick={()=>navigate(-1)} className="absolute left-4"><ChevronLeftIcon className="w-6 h-6 text-gray-600"/></button>}</header>); };

// --- Input Field --- //
const InputField = ({ label, name, type='text', value, onChange, placeholder }: { label:string; name:string; type?:string; value:string; onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void; placeholder?:string }) => (<div><label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label><input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"/></div>);

// --- Login --- //
const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loginWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email and password are required'); return; }
    setSending(true);
    const { success } = await loginWithPassword(email, password);
    setSending(false);
    if (success) navigate('/dashboard', { replace: true }); else setError('Invalid credentials');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <div className="text-center mb-10">
        <LeafIcon className="w-16 h-16 text-green-600 mx-auto" />
        <h1 className="text-4xl font-bold text-green-800 mt-4">Mkulima Express</h1>
        <p className="text-gray-600 mt-2">Connecting Farmers & Vendors with Trust</p>
      </div>
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField label="Email" name="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
          <InputField label="Password" name="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button type="submit" disabled={sending||!email||!password} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300">{sending? 'Logging in...':'Login'}</button>
        </form>
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <div className="flex justify-center gap-4">
            <Link to="/register/farmer" className="font-semibold text-green-600">Register Farmer</Link>
            <Link to="/register/vendor" className="font-semibold text-amber-600">Register Vendor</Link>
          </div>
          <Link to="/admin/login" className="block text-xs text-gray-500 mt-2">Admin Login</Link>
        </div>
      </div>
    </div>
  );
};

// --- Onboarding --- //
const OnboardingScreen = () => { const { user } = useAuth(); const navigate=useNavigate(); useEffect(():any=>{ if(user) return navigate('/dashboard',{replace:true}); }); return (<div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4"><div className="text-center mb-12"><LeafIcon className="w-16 h-16 text-green-600 mx-auto"/><h1 className="text-4xl font-bold text-green-800 mt-4">Join Mkulima Express</h1><p className="text-gray-600 mt-2">Select your role to get started.</p></div><div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-4"><button onClick={()=>navigate('/register/farmer')} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700">Farmer</button><button onClick={()=>navigate('/register/vendor')} className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-amber-600">Vendor</button></div></div>); };

// --- Registration (MINIMAL) --- //
const FarmerRegistrationScreen = () => { const { registerWithPassword, user } = useAuth(); const navigate=useNavigate(); const [form,setForm]=useState({ name:'', email:'', password:'' }); const [error,setError]=useState(''); const [saving,setSaving]=useState(false); useEffect(()=>{ if(user) navigate('/dashboard',{replace:true}); },[user]); const change=(e:React.ChangeEvent<HTMLInputElement>)=> setForm({...form,[e.target.name]:e.target.value}); const submit=async(e:React.FormEvent)=>{ e.preventDefault(); setError(''); if(!form.name||!form.email||!form.password){ setError('All fields required'); return;} if(form.password.length<6){ setError('Password must be at least 6 characters'); return;} setSaving(true); try { await registerWithPassword({ name:form.name, email:form.email, role:UserRole.FARMER }, form.password); navigate('/dashboard',{replace:true}); } catch(err:any){ setError(err.message||'Failed'); } finally { setSaving(false);} }; return (<Layout showNav={false}><Header title="Farmer Registration" showBack/><div className="p-4"><form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md space-y-4"><InputField label="Full Name" name="name" value={form.name} onChange={change}/><InputField label="Email" name="email" type="email" value={form.email} onChange={change}/><InputField label="Password" name="password" type="password" value={form.password} onChange={change} placeholder="At least 6 characters"/>{error && <p className="text-sm text-red-600">{error}</p>}<button type="submit" disabled={saving} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300">{saving? 'Saving...':'Register'}</button></form></div></Layout>); };
const VendorRegistrationScreen = () => { const { registerWithPassword, user } = useAuth(); const navigate=useNavigate(); const [form,setForm]=useState({ name:'', email:'', password:'' }); const [error,setError]=useState(''); const [saving,setSaving]=useState(false); useEffect(()=>{ if(user) navigate('/dashboard',{replace:true}); },[user]); const change=(e:React.ChangeEvent<HTMLInputElement>)=> setForm({...form,[e.target.name]:e.target.value}); const submit=async(e:React.FormEvent)=>{ e.preventDefault(); setError(''); if(!form.name||!form.email||!form.password){ setError('All fields required'); return;} if(form.password.length<6){ setError('Password must be at least 6 characters'); return;} setSaving(true); try { await registerWithPassword({ name:form.name, email:form.email, role:UserRole.VENDOR }, form.password); navigate('/dashboard',{replace:true}); } catch(err:any){ setError(err.message||'Failed'); } finally { setSaving(false);} }; return (<Layout showNav={false}><Header title="Vendor Registration" showBack/><div className="p-4"><form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md space-y-4"><InputField label="Full Name" name="name" value={form.name} onChange={change}/><InputField label="Email" name="email" type="email" value={form.email} onChange={change}/><InputField label="Password" name="password" type="password" value={form.password} onChange={change} placeholder="At least 6 characters"/>{error && <p className="text-sm text-red-600">{error}</p>}<button type="submit" disabled={saving} className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 disabled:bg-gray-300">{saving? 'Saving...':'Register'}</button></form></div></Layout>); };

// Keep authenticated users within app when route not found
const FallbackRoute = () => {
  const { user } = useAuth();
  return <Navigate to={user ? '/dashboard' : '/login'} replace/>;
};

// --- Produce Listing --- //
const ProduceCard: React.FC<{ produce:Produce }> = ({ produce }) => {
  const { user } = useAuth();
  const navigate=useNavigate();
  const { notify } = useNotifier();
  const farmerCreate=()=> navigate(`/my-produce/${produce.id}/new-contract`);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={produce.imageUrl} alt={produce.name} className="w-full h-48 object-cover"/>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{produce.name}</h3>
        <p className="text-sm text-gray-500">{produce.type}</p>
        <div className="mt-2 text-sm text-gray-700">
          <p>By: <span className="font-semibold">{produce.farmerName}</span></p>
          <p>Location: <span className="font-semibold">{produce.location}</span></p>
          <p>Quantity: <span className="font-semibold">{produce.quantity} kg</span></p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-bold text-green-600">KES {produce.pricePerKg}<span className="text-sm text-gray-500">/kg</span></p>
          {user?.role===UserRole.VENDOR && (
            <Link to={`/produce/${produce.id}/new-contract`} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center">Make Offer</Link>
          )}
          {user?.role===UserRole.FARMER && (
            <button onClick={farmerCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Create Contract</button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Dashboard Screen --- //
const DashboardScreen = () => {
  const { user } = useAuth();
  const { produce, contracts } = useData();
  const navigate = useNavigate();
  if (!user) return null;

  const isFarmer = user.role === UserRole.FARMER;
  const isVendor = user.role === UserRole.VENDOR;

  const myProduce = isFarmer ? produce.filter(p => p.farmerId === user.id) : [];
  const myContracts = contracts.filter(c => isFarmer ? c.farmerId === user.id : c.vendorId === user.id);
  const activeContracts = myContracts.filter(c => c.status === ContractStatus.ACTIVE || c.status === ContractStatus.PENDING);
  const completedContracts = myContracts.filter(c => c.status === ContractStatus.COMPLETED);

  return (
    <Layout>
      <Header title="Dashboard" />
      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800">Welcome, {user.name}!</h2>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-700">{activeContracts.length}</p>
            <p className="text-xs text-green-600">Active Contracts</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-700">{completedContracts.length}</p>
            <p className="text-xs text-blue-600">Completed</p>
          </div>
        </div>
        {isFarmer && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">My Produce</h3>
              <button onClick={() => navigate('/produce/new')} className="text-sm text-green-600 font-semibold flex items-center gap-1">
                <PlusIcon className="w-4 h-4" /> Add
              </button>
            </div>
            {myProduce.length > 0 ? (
              <div className="space-y-2">
                {myProduce.slice(0, 3).map(p => (
                  <div key={p.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{p.name}</span>
                    <span className="text-green-600 font-semibold">KES {p.pricePerKg}/kg</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No produce listed yet.</p>
            )}
          </div>
        )}
        {isVendor && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-800 mb-2">Browse Produce</h3>
            <button onClick={() => navigate('/produce')} className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold">
              View All Produce
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

// --- Produce List Screen --- //
const ProduceListScreen = () => {
  const { user } = useAuth();
  const { produce } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  if (!user) return null;

  const isFarmer = user.role === UserRole.FARMER;
  const filtered = produce.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <Header title="Produce" />
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search produce..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          {isFarmer && (
            <button onClick={() => navigate('/produce/new')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1">
              <PlusIcon className="w-4 h-4" /> Add
            </button>
          )}
        </div>
        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map(p => <ProduceCard key={p.id} produce={p} />)}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-16">No produce found.</div>
        )}
      </div>
    </Layout>
  );
};

// --- Add Produce Screen --- //
const AddProduceScreen = () => {
  const { user } = useAuth();
  const { addProduce } = useData();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', type: '', quantity: '', pricePerKg: '', location: '', description: '', harvestDate: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  if (!user) return null;

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.type || !form.quantity || !form.pricePerKg || !form.location) {
      setError('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      await addProduce({
        id: '',
        farmerId: user.id,
        farmerName: user.name,
        name: form.name,
        type: form.type,
        quantity: parseFloat(form.quantity),
        pricePerKg: parseFloat(form.pricePerKg),
        location: form.location,
        description: form.description,
        harvestDate: form.harvestDate || new Date().toISOString().split('T')[0],
        imageUrl: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400',
      });
      navigate('/produce');
    } catch (err: any) {
      setError(err.message || 'Failed to add produce');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout showNav={false}>
      <Header title="Add Produce" showBack />
      <div className="p-4">
        <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <InputField label="Name *" name="name" value={form.name} onChange={change} placeholder="e.g. Tomatoes" />
          <InputField label="Type *" name="type" value={form.type} onChange={change} placeholder="e.g. Vegetables" />
          <InputField label="Quantity (kg) *" name="quantity" type="number" value={form.quantity} onChange={change} placeholder="e.g. 100" />
          <InputField label="Price per kg (KES) *" name="pricePerKg" type="number" value={form.pricePerKg} onChange={change} placeholder="e.g. 50" />
          <InputField label="Location *" name="location" value={form.location} onChange={change} placeholder="e.g. Nairobi" />
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={form.description} onChange={change} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>
          <InputField label="Harvest Date" name="harvestDate" type="date" value={form.harvestDate} onChange={change} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300">
            {saving ? 'Saving...' : 'Add Produce'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

// --- Offer Flow Screen (placeholder) --- //
const OfferFlowScreen = () => {
  const navigate = useNavigate();
  return (
    <Layout showNav={false}>
      <Header title="Make Offer" showBack />
      <div className="p-4 text-center text-gray-500">
        <p>Use the New Contract flow instead.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-green-600 font-semibold">Go Back</button>
      </div>
    </Layout>
  );
};

// --- New Contract Screen (Vendor creates offer) --- //
const NewContractScreen = () => {
  const { user } = useAuth();
  const { produce, users, proposeContract } = useData();
  const { produceId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ quantity: '', deadline: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  if (!user) return null;

  const selectedProduce = produce.find(p => p.id === produceId);
  if (!selectedProduce) return <Layout showNav={false}><Header title="New Contract" showBack /><div className="p-4">Produce not found</div></Layout>;

  const farmer = users.find(u => u.id === selectedProduce.farmerId);
  const totalPrice = parseFloat(form.quantity || '0') * selectedProduce.pricePerKg;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.quantity || !form.deadline) {
      setError('Please fill all fields');
      return;
    }
    if (parseFloat(form.quantity) > selectedProduce.quantity) {
      setError('Quantity exceeds available stock');
      return;
    }
    setSaving(true);
    try {
      await proposeContract({
        id: '',
        produceId: selectedProduce.id,
        produceName: selectedProduce.name,
        farmerId: selectedProduce.farmerId,
        vendorId: user.id,
        farmerName: farmer?.name || 'Unknown',
        vendorName: user.name,
        quantity: parseFloat(form.quantity),
        totalPrice,
        deliveryDeadline: form.deadline,
        status: ContractStatus.PENDING,
      });
      navigate('/contracts');
    } catch (err: any) {
      setError(err.message || 'Failed to create contract');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout showNav={false}>
      <Header title="New Contract" showBack />
      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-gray-800">{selectedProduce.name}</h3>
          <p className="text-sm text-gray-500">By {selectedProduce.farmerName}</p>
          <p className="text-sm text-gray-500">Available: {selectedProduce.quantity} kg @ KES {selectedProduce.pricePerKg}/kg</p>
        </div>
        <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <InputField label="Quantity (kg)" name="quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="How much?" />
          <InputField label="Delivery Deadline" name="deadline" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Price: <span className="font-bold text-green-600">KES {totalPrice.toLocaleString()}</span></p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300">
            {saving ? 'Submitting...' : 'Submit Offer'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

// --- Farmer New Contract Screen (Farmer creates contract) --- //
const FarmerNewContractScreen = () => {
  const { user } = useAuth();
  const { produce, users, addContract } = useData();
  const { produceId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ vendorId: '', quantity: '', deadline: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  if (!user) return null;

  const selectedProduce = produce.find(p => p.id === produceId);
  if (!selectedProduce) return <Layout showNav={false}><Header title="Create Contract" showBack /><div className="p-4">Produce not found</div></Layout>;

  const vendors = users.filter(u => u.role === UserRole.VENDOR);
  const selectedVendor = vendors.find(v => v.id === form.vendorId);
  const totalPrice = parseFloat(form.quantity || '0') * selectedProduce.pricePerKg;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.vendorId || !form.quantity || !form.deadline) {
      setError('Please fill all fields');
      return;
    }
    if (parseFloat(form.quantity) > selectedProduce.quantity) {
      setError('Quantity exceeds available stock');
      return;
    }
    setSaving(true);
    try {
      await addContract({
        id: '',
        produceId: selectedProduce.id,
        produceName: selectedProduce.name,
        farmerId: user.id,
        vendorId: form.vendorId,
        farmerName: user.name,
        vendorName: selectedVendor?.name || 'Unknown',
        quantity: parseFloat(form.quantity),
        totalPrice,
        deliveryDeadline: form.deadline,
        status: ContractStatus.ACTIVE,
      });
      navigate('/contracts');
    } catch (err: any) {
      setError(err.message || 'Failed to create contract');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout showNav={false}>
      <Header title="Create Contract" showBack />
      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-gray-800">{selectedProduce.name}</h3>
          <p className="text-sm text-gray-500">Available: {selectedProduce.quantity} kg @ KES {selectedProduce.pricePerKg}/kg</p>
        </div>
        <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Vendor</label>
            <select
              value={form.vendorId}
              onChange={e => setForm({ ...form, vendorId: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="">Choose a vendor...</option>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <InputField label="Quantity (kg)" name="quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="How much?" />
          <InputField label="Delivery Deadline" name="deadline" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Price: <span className="font-bold text-green-600">KES {totalPrice.toLocaleString()}</span></p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300">
            {saving ? 'Creating...' : 'Create Contract'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

// --- Wallet Screen --- //
const WalletScreen = () => {
  const { user } = useAuth();
  const { transactions } = useData();
  if (!user) return null;

  const myTransactions = transactions.filter(t => t.userId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Layout>
      <Header title="Wallet" />
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-80">Balance</p>
          <p className="text-3xl font-bold">KES {(user.walletBalance || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-3">Recent Transactions</h3>
          {myTransactions.length > 0 ? (
            <div className="space-y-3">
              {myTransactions.slice(0, 10).map(t => (
                <div key={t.id} className="flex justify-between items-center text-sm border-b pb-2">
                  <div>
                    <p className="text-gray-700">{t.description}</p>
                    <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-semibold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {t.amount >= 0 ? '+' : ''}{t.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No transactions yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

// --- Market Insights Screen --- //
const MarketInsightsScreen = () => {
  const { produce, contracts } = useData();

  const totalProduce = produce.length;
  const totalContracts = contracts.length;
  const completedContracts = contracts.filter(c => c.status === ContractStatus.COMPLETED).length;
  const totalVolume = contracts.reduce((sum, c) => sum + c.totalPrice, 0);

  const produceTypes = produce.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <Header title="Market Insights" />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-2xl font-bold text-green-600">{totalProduce}</p>
            <p className="text-xs text-gray-500">Total Produce</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-2xl font-bold text-blue-600">{totalContracts}</p>
            <p className="text-xs text-gray-500">Total Contracts</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-2xl font-bold text-purple-600">{completedContracts}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-2xl font-bold text-amber-600">KES {(totalVolume / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500">Total Volume</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-3">Produce by Type</h3>
          <div className="space-y-2">
            {Object.entries(produceTypes).map(([type, count]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="text-gray-700">{type}</span>
                <span className="font-semibold text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// --- Profile Screen --- //
const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Layout>
      <Header title="Profile" />
      <div className="p-4 space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mt-4">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${user.role === UserRole.FARMER ? 'bg-green-100 text-green-700' : user.role === UserRole.VENDOR ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>
            {user.role}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
          {user.location && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Location</span>
              <span className="text-gray-800">{user.location}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Rating</span>
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-800">{user.rating?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Reviews</span>
            <span className="text-gray-800">{user.reviews || 0}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600">
          Logout
        </button>
      </div>
    </Layout>
  );
};

// --- App --- //
const App = () => (
  <NotificationProvider>
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen/>} />
        <Route path="/onboarding" element={<OnboardingScreen/>} />
        <Route path="/register/farmer" element={<FarmerRegistrationScreen/>} />
        <Route path="/register/vendor" element={<VendorRegistrationScreen/>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen/></ProtectedRoute>} />
        <Route path="/produce" element={<ProtectedRoute><ProduceListScreen/></ProtectedRoute>} />
        <Route path="/produce/new" element={<ProtectedRoute><AddProduceScreen/></ProtectedRoute>} />
        <Route path="/produce/:produceId/offer" element={<ProtectedRoute><OfferFlowScreen/></ProtectedRoute>} />
        <Route path="/produce/:produceId/new-contract" element={<ProtectedRoute><NewContractScreen/></ProtectedRoute>} />
        <Route path="/my-produce/:produceId/new-contract" element={<ProtectedRoute><FarmerNewContractScreen/></ProtectedRoute>} />
        <Route path="/contracts" element={<ProtectedRoute><ContractsScreen/></ProtectedRoute>} />
        <Route path="/contracts/:contractId" element={<ProtectedRoute><ContractDetailScreen/></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><WalletScreen/></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><MarketInsightsScreen/></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileScreen/></ProtectedRoute>} />
        <Route path="*" element={<FallbackRoute/>} />
      </Routes>
    </HashRouter>
    <ToastContainer position="top-right" autoClose={5000} />
  </NotificationProvider>
);

export default App;

const ContractsScreen = () => {
  const { user } = useAuth();
  const { contracts } = useData();
  const [filter, setFilter] = useState<ContractStatus | 'ALL'>('ALL');
  if (!user) return null;
  const isFarmer = user.role === UserRole.FARMER;
  const isVendor = user.role === UserRole.VENDOR;
  const list = contracts.filter(c => isFarmer ? c.farmerId === user.id : isVendor ? c.vendorId === user.id : true);
  const filtered = filter === 'ALL' ? list : list.filter(c => c.status === filter);
  return (
    <Layout>
      <Header title="Contracts" />
      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter('ALL')} className={`px-3 py-1 text-xs font-semibold rounded-full border ${filter==='ALL'?'bg-green-600 text-white':'bg-gray-100 text-gray-600'}`}>All</button>
            {Object.values(ContractStatus).map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 text-xs font-semibold rounded-full border ${filter===s?'bg-green-600 text-white':'bg-gray-100 text-gray-600'}`}>{s}</button>
            ))}
          </div>
        </div>
        {filtered.length ? filtered.map(c => <MiniContractCard key={c.id} c={c} />) : (
          <div className="text-center text-gray-500 mt-16">No contracts.</div>
        )}
      </div>
    </Layout>
  );
};

const statusColor = (status: ContractStatus) => {
  switch (status) {
    case ContractStatus.PENDING: return 'bg-gray-100 text-gray-600';
    case ContractStatus.ACTIVE: return 'bg-blue-100 text-blue-600';
    case ContractStatus.DELIVERY_CONFIRMED: return 'bg-yellow-100 text-yellow-600';
    case ContractStatus.PAYMENT_RELEASED: return 'bg-purple-100 text-purple-600';
    case ContractStatus.COMPLETED: return 'bg-green-100 text-green-600';
    case ContractStatus.DISPUTED: return 'bg-orange-100 text-orange-600';
    case ContractStatus.CANCELLED: return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const MiniContractCard = ({ c }: { c: Contract }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/contracts/${c.id}`)} className="bg-white p-4 rounded-lg shadow-md cursor-pointer">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800 text-sm">{c.produceName}</p>
          <p className="text-xs text-gray-500">Qty {c.quantity} kg • KES {c.totalPrice.toLocaleString()}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor(c.status)}`}>{c.status}</span>
      </div>
    </div>
  );
};

const ContractDetailScreen = () => {
  const { user } = useAuth();
  const { contracts, acceptContract, rejectContract, confirmDelivery, releaseEscrow, finalizeContract, disputeContract } = useData();
  const params = useParams();
  const navigate = useNavigate();
  const [showDispute, setShowDispute] = useState(false);
  const [reason, setReason] = useState('');
  if (!user) return null;
  const c = contracts.find(x => x.id === params.contractId);
  if (!c) return <Layout showNav={false}><Header title="Contract" showBack/><div className="p-4">Not found</div></Layout>;

  const isFarmer = user.id === c.farmerId;
  const isVendor = user.id === c.vendorId;

  const canDispute = [ContractStatus.ACTIVE, ContractStatus.DELIVERY_CONFIRMED, ContractStatus.PAYMENT_RELEASED].includes(c.status);

  const actions: JSX.Element | null = (() => {
    if (isFarmer && c.status === ContractStatus.PENDING) return (
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex gap-2">
          <button onClick={async()=>{ await acceptContract(c.id); }} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold">Accept</button>
          <button onClick={async()=>{ await rejectContract(c.id); navigate('/contracts'); }} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold">Reject</button>
        </div>
        {canDispute && <button onClick={()=>setShowDispute(true)} className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold">Dispute</button>}
      </div>
    );
    if ((isFarmer || isVendor) && c.status === ContractStatus.ACTIVE) return (
      <div className="flex flex-col gap-2 mt-4">
        <button onClick={async()=>{ await confirmDelivery(c.id); }} className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold">Confirm Delivery</button>
        {canDispute && <button onClick={()=>setShowDispute(true)} className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold">Dispute</button>}
      </div>
    );
    if ((isFarmer || isVendor) && c.status === ContractStatus.DELIVERY_CONFIRMED) return (
      <div className="flex flex-col gap-2 mt-4">
        <button onClick={async()=>{ await releaseEscrow(c.id); }} className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-semibold">Release Payment</button>
        {canDispute && <button onClick={()=>setShowDispute(true)} className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold">Dispute</button>}
      </div>
    );
    if (isFarmer && c.status === ContractStatus.PAYMENT_RELEASED) return (
      <div className="flex flex-col gap-2 mt-4">
        <button onClick={async()=>{ await finalizeContract(c.id); }} className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold">Mark Completed</button>
        {canDispute && <button onClick={()=>setShowDispute(true)} className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold">Dispute</button>}
      </div>
    );
    return canDispute ? <button onClick={()=>setShowDispute(true)} className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold">Dispute</button> : null;
  })();

  return (
    <Layout showNav={false}>
      <Header title="Contract Details" showBack />
      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-800">{c.produceName}</h3>
              <p className="text-xs text-gray-500">Farmer: {c.farmerName}</p>
              <p className="text-xs text-gray-500">Vendor: {c.vendorName}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor(c.status)}`}>{c.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-4">
            <div><p className="text-gray-500">Quantity</p><p className="font-semibold">{c.quantity} kg</p></div>
            <div><p className="text-gray-500">Total</p><p className="font-semibold">KES {c.totalPrice.toLocaleString()}</p></div>
            <div><p className="text-gray-500">Deadline</p><p className="font-semibold">{c.deliveryDeadline}</p></div>
            {c.paymentDate && <div><p className="text-gray-500">Paid On</p><p className="font-semibold">{new Date(c.paymentDate).toLocaleDateString()}</p></div>}
            {c.disputeReason && <div className="col-span-2"><p className="text-gray-500">Dispute Reason</p><p className="font-semibold text-orange-600">{c.disputeReason}</p></div>}
          </div>
          {actions}
        </div>
        {showDispute && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold mb-2">File Dispute</h4>
            <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={3} placeholder="Describe the issue" className="w-full border border-gray-300 rounded-md p-2 text-sm" />
            <div className="flex gap-2 mt-3">
              <button onClick={()=>setShowDispute(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold">Cancel</button>
              <button disabled={!reason.trim()} onClick={async()=>{ await disputeContract(c.id, reason.trim(), user.id); setShowDispute(false); }} className="flex-1 bg-orange-600 disabled:bg-orange-300 text-white py-2 rounded-lg text-sm font-semibold">Submit Dispute</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
