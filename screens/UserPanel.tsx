
import React, { useState, useContext, useRef, useEffect } from 'react';
import type { User, Test, SampleStatus, Booking, ChatMessage, Report, Notification, PaymentMethod, PaymentStatus } from '../types';
import { Screen, BottomNav, Card, Icon, Button, Spinner, Input, Modal } from '../components';
import { AppContext } from '../App';
import * as GeminiService from '../services/geminiService';

// ========== NOTIFICATION POPUP ==========
const NotificationPopup: React.FC = () => {
    const { user, notifications } = useContext(AppContext);
    const [visible, setVisible] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

    useEffect(() => {
        const unread = notifications.find(n => !n.read && (n.userId === user?.id || n.userId === 'all'));
        if (unread) {
            setCurrentNotification(unread);
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notifications, user?.id]);

    if (!visible || !currentNotification) return null;

    return (
        <div className="fixed top-5 right-5 left-5 max-w-md mx-auto z-50 animate-slideDown">
            <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 shadow-2xl text-white border-none ring-2 ring-white/30 p-4">
                <div className="flex items-start space-x-3">
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm shrink-0">
                        <Icon name="whatsapp" className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white flex-grow min-w-0">
                        <h3 className="font-bold text-base truncate">{currentNotification.title}</h3>
                        <p className="text-emerald-50 text-xs leading-relaxed mt-1 font-medium">{currentNotification.message}</p>
                    </div>
                    <button onClick={() => setVisible(false)} className="text-white/80 hover:bg-white/20 rounded-full p-1 transition-colors shrink-0">
                        <Icon name="close" className="w-5 h-5"/>
                    </button>
                </div>
            </Card>
        </div>
    );
};


const UserPanel: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [activeScreen, setActiveScreen] = useState('home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <UserHomeScreen setActiveScreen={setActiveScreen}/>;
      case 'book': return <BookTestScreen setActiveScreen={setActiveScreen} />;
      case 'track': return <TrackSampleScreen />;
      case 'reports': return <ReportsScreen />;
      case 'ai': return <AIChatbotScreen />;
      case 'notifications': return <OffersScreen setActiveScreen={setActiveScreen} />;
      case 'profile': return <ProfileScreen user={user} onLogout={onLogout} />;
      default: return <UserHomeScreen setActiveScreen={setActiveScreen}/>;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-light dark:bg-dark">
        <NotificationPopup />
        <div className="flex-grow overflow-y-auto pb-24 scrollbar-hide">
            <div key={activeScreen} className="animate-fadeIn">
                {renderScreen()}
            </div>
        </div>
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
    </div>
  );
};


const UserHomeScreen: React.FC<{setActiveScreen: (screen: string) => void}> = ({setActiveScreen}) => {
    const { user } = useContext(AppContext);

    return (
        <Screen>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center animate-slideInUp">
                     <div>
                        <p className="text-text-muted text-xs font-bold tracking-widest uppercase mb-1">Welcome Back</p>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{user?.name.split(' ')[0]}</h1>
                     </div>
                     <button onClick={() => setActiveScreen('profile')} className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary/30 transform transition-transform active:scale-95 border-2 border-white">
                        {user?.name.charAt(0)}
                     </button>
                </div>
                
                {/* Hero Card */}
                <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white border-none shadow-glow animate-slideInUp overflow-hidden relative group h-48 flex flex-col justify-center" style={{animationDelay: '100ms'}}>
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                     <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/30 rounded-full blur-2xl -ml-10 -mb-10"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-extrabold text-white leading-tight mb-2">Full Body<br/>Checkup</h2>
                                <p className="text-indigo-100 text-sm font-medium">Starting at <span className="font-bold text-amber-300 text-lg">₹599</span></p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-inner">
                                <Icon name="flask" className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <Button onClick={() => setActiveScreen('book')} className="bg-white text-indigo-700 font-extrabold px-6 py-3 shadow-xl hover:bg-gray-50 border-none mt-6 w-fit rounded-xl text-sm">Book Now</Button>
                    </div>
                </Card>

                {/* Action Grid - Colorful & Clear */}
                <div className="grid grid-cols-2 gap-4">
                    <HomeCard 
                        icon="location" 
                        title="Track" 
                        subtitle="Live Status"
                        color="bg-blue-500" 
                        gradient="from-blue-500 to-blue-600"
                        onClick={() => setActiveScreen('track')} 
                        delay={200} 
                    />
                    <HomeCard 
                        icon="file" 
                        title="Reports" 
                        subtitle="View PDF"
                        color="bg-emerald-500" 
                        gradient="from-emerald-500 to-teal-600"
                        onClick={() => setActiveScreen('reports')} 
                        delay={300} 
                    />
                    <HomeCard 
                        icon="spark" 
                        title="AI Help" 
                        subtitle="Ask Dr. AI"
                        color="bg-violet-500" 
                        gradient="from-violet-500 to-purple-600"
                        onClick={() => setActiveScreen('ai')} 
                        delay={400} 
                    />
                    <HomeCard 
                        icon="users" 
                        title="Offers" 
                        subtitle="Discounts"
                        color="bg-amber-500" 
                        gradient="from-amber-500 to-orange-500"
                        onClick={() => setActiveScreen('notifications')} 
                        delay={500} 
                    />
                </div>

                <div className="animate-slideInUp" style={{animationDelay: '600ms'}}>
                    <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shadow-lg">
                        <div className="flex items-center mb-2">
                            <div className="bg-green-500 p-1.5 rounded-full mr-3 shadow-lg shadow-green-500/50"><Icon name="check" className="w-4 h-4 text-white" /></div>
                            <h2 className="text-lg font-bold text-white">Trusted Partners</h2>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">
                            We collaborate with top NABL labs like <span className="font-bold text-white">Biomed, Lal Path Labs, Metropolis</span>.
                        </p>
                    </Card>
                </div>
            </div>
        </Screen>
    );
};

interface HomeCardProps {
    icon: string;
    title: string;
    subtitle: string;
    color: string;
    gradient: string;
    onClick: () => void;
    delay: number;
}

const HomeCard: React.FC<HomeCardProps> = ({icon, title, subtitle, gradient, onClick, delay}) => (
    <button 
        onClick={onClick} 
        className={`
            relative overflow-hidden rounded-[24px] p-5 text-left shadow-card transition-all duration-300
            hover:shadow-lg hover:-translate-y-1 active:scale-95
            bg-gradient-to-br ${gradient}
            animate-slideInUp group h-36 flex flex-col justify-between
        `}
        style={{animationDelay: `${delay}ms`}}
    >
        <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
        <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
            <Icon name={icon} className="w-5 h-5 text-white" />
        </div>
        <div>
            <h3 className="font-bold text-white text-lg tracking-tight">{title}</h3>
            <p className="text-white/80 text-xs font-semibold mt-0.5">{subtitle}</p>
        </div>
    </button>
);

// ========== BOOK TEST SCREEN ==========
const BookTestScreen: React.FC<{setActiveScreen: (screen: string) => void}> = ({ setActiveScreen }) => {
    const { user, createBooking, tests: allTests } = useContext(AppContext);
    const [bookingType, setBookingType] = useState<'with_tests' | 'without_tests'>('with_tests');
    
    // Form State
    const [name, setName] = useState(user?.name || '');
    const [age, setAge] = useState(user?.age?.toString() || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [location, setLocation] = useState<{lat: number, long: number} | null>(null);
    const [locating, setLocating] = useState(false);
    const [symptoms, setSymptoms] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Online');
    
    // Test Selection State
    const [selectedTests, setSelectedTests] = useState<Test[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [loading, setLoading] = useState(false);

    const handleGetLocation = () => {
        setLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({ lat: position.coords.latitude, long: position.coords.longitude });
                    setLocating(false);
                },
                (error) => {
                    console.error("Error getting location", error);
                    // Fallback for demo/if location denied
                    alert("Could not get location. Using default.");
                    setLocation({lat: 28.6139, long: 77.2090}); // Default to Delhi
                    setLocating(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setLocating(false);
        }
    };

    const toggleTest = (test: Test) => {
        if (selectedTests.find(t => t.id === test.id)) {
            setSelectedTests(selectedTests.filter(t => t.id !== test.id));
        } else {
            setSelectedTests([...selectedTests, test]);
        }
    };

    const filteredTests = allTests.filter(t => t.active && t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalMrp = selectedTests.reduce((acc, test) => acc + test.mrp, 0);
    const discount = totalMrp * 0.20;
    const finalAmount = totalMrp - discount;

    const handleSubmit = () => {
        if (!name || !age || !phone || !address) {
            alert("Please fill all required fields.");
            return;
        }
        if (bookingType === 'with_tests' && selectedTests.length === 0) {
            alert("Please select at least one test.");
            return;
        }

        setLoading(true);

        const bookingData = {
            userId: user!.id,
            name, age: parseInt(age), phone, address,
            live_location_lat: location?.lat,
            live_location_long: location?.long,
            symptoms,
            tests: bookingType === 'with_tests' ? selectedTests : [],
            totalAmount: bookingType === 'with_tests' ? totalMrp : 0,
            discount: bookingType === 'with_tests' ? discount : 0,
            paidAmount: 0,
            dueAmount: bookingType === 'with_tests' ? finalAmount : 0,
            paymentMethod,
            paymentStatus: 'Pending' as PaymentStatus,
        };
        
        setTimeout(() => {
            createBooking(bookingData);
            setLoading(false);
            setActiveScreen('home');
        }, 1500);
    };

    return (
        <Screen>
            <div className="p-5 space-y-5">
                <div className="flex items-center space-x-3 mb-2">
                    <button onClick={() => setActiveScreen('home')} className="p-3 rounded-full bg-white dark:bg-dark-secondary shadow-sm hover:bg-gray-100 text-primary">
                        <Icon name="chevronLeft" className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">Book Test</h1>
                </div>

                <Card className="border-none shadow-lg ring-1 ring-gray-100 dark:ring-gray-700">
                    <h2 className="font-bold text-lg mb-5 text-primary flex items-center"><Icon name="user" className="w-5 h-5 mr-2"/>Patient Details</h2>
                    <div className="space-y-4">
                        <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required/>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Age" type="number" value={age} onChange={e => setAge(e.target.value)} required/>
                            <Input label="Phone No" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required/>
                        </div>
                        <Input label="Full Address" value={address} onChange={e => setAddress(e.target.value)} required/>
                        <Button onClick={handleGetLocation} fullWidth disabled={locating} variant={location ? "secondary" : "primary"} className={location ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold" : "bg-gradient-to-r from-secondary to-emerald-500"}>
                            {locating ? <Spinner/> : <Icon name="location" className="w-5 h-5 inline mr-2"/>}
                            {location ? 'Location Captured ✓' : 'Auto Capture Location'}
                        </Button>
                    </div>
                </Card>

                <div className="flex p-1.5 bg-gray-200 dark:bg-gray-800 rounded-2xl">
                    <button onClick={() => setBookingType('with_tests')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${bookingType === 'with_tests' ? 'bg-white text-primary shadow-md scale-100' : 'text-gray-500 dark:text-gray-400'}`}>Select Tests</button>
                    <button onClick={() => setBookingType('without_tests')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${bookingType === 'without_tests' ? 'bg-white text-primary shadow-md scale-100' : 'text-gray-500 dark:text-gray-400'}`}>Upload Rx</button>
                </div>

                {bookingType === 'with_tests' ? (
                    <Card className="overflow-hidden">
                        <h2 className="font-bold text-lg mb-3 text-primary">Select Tests</h2>
                        <div className="relative mb-4">
                            <Icon name="search" className="absolute left-4 top-4 text-gray-400 w-5 h-5"/>
                            <input 
                                type="text" 
                                placeholder="Search test (e.g. CBC, Thyroid)" 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {filteredTests.map(test => {
                                const isSelected = !!selectedTests.find(t => t.id === test.id);
                                return (
                                    <div key={test.id} onClick={() => toggleTest(test)} className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all border ${isSelected ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-dark border-gray-100 hover:bg-gray-50'}`}>
                                        <div>
                                            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{test.name}</p>
                                            <p className="text-xs text-gray-500">₹{test.mrp}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                            {isSelected && <Icon name="check" className="w-4 h-4 text-white"/>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {selectedTests.length > 0 && (
                            <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                                <div className="flex justify-between text-sm mb-1"><span>Total MRP:</span> <span className="line-through text-gray-400">₹{totalMrp}</span></div>
                                <div className="flex justify-between text-sm mb-2 text-green-600 font-bold"><span>Discount (20%):</span> <span>-₹{discount.toFixed(0)}</span></div>
                                <div className="flex justify-between text-lg font-extrabold text-primary border-t border-indigo-200 pt-2"><span>To Pay:</span> <span>₹{finalAmount.toFixed(0)}</span></div>
                            </div>
                        )}
                    </Card>
                ) : (
                    <Card className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                         <div className="bg-white dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Icon name="file" className="w-8 h-8 text-gray-400"/>
                         </div>
                         <p className="text-gray-500 font-medium">Upload Prescription Logic Here</p>
                         <p className="text-xs text-gray-400 mt-2">(Coming Soon)</p>
                    </Card>
                )}

                <Button onClick={handleSubmit} fullWidth disabled={loading} className="bg-gradient-to-r from-primary to-indigo-600 shadow-xl shadow-primary/30 text-lg py-4">
                    {loading ? <Spinner /> : `Confirm Booking (₹${bookingType === 'with_tests' ? finalAmount.toFixed(0) : '0'})`}
                </Button>
                <div className="h-10"></div>
            </div>
        </Screen>
    );
};

// ========== TRACK SAMPLE SCREEN ==========
const TrackSampleScreen: React.FC = () => {
    const { bookings } = useContext(AppContext);
    // Filter for active bookings only
    const activeBookings = bookings.filter(b => b.status !== 'Completed');
    
    // Sort by date descending
    activeBookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

    return (
        <Screen>
            <div className="p-5 space-y-5">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Track Order</h1>
                {activeBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center opacity-60">
                        <Icon name="search" className="w-16 h-16 mb-4 text-gray-300"/>
                        <p className="font-bold text-xl">No active orders</p>
                        <p className="text-sm">Book a test to track it here.</p>
                    </div>
                ) : (
                    activeBookings.map(booking => (
                        <BookingStatusCard key={booking.id} booking={booking} />
                    ))
                )}
            </div>
        </Screen>
    );
};

const BookingStatusCard: React.FC<{booking: Booking}> = ({booking}) => {
    const steps = ['Pending', 'Collected', 'In Lab', 'Processing', 'Report Ready'];
    // Handle Rejection or Completion
    const isRejected = booking.status === 'Rejected';
    const currentStepIndex = steps.indexOf(booking.status) === -1 ? (booking.status === 'Completed' ? 5 : 0) : steps.indexOf(booking.status);
    
    return (
        <Card className={`overflow-hidden border-l-4 ${isRejected ? 'border-l-red-500' : 'border-l-primary'}`}>
             <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order #{booking.id.slice(-6)}</p>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{booking.tests.length > 0 ? booking.tests[0].name + (booking.tests.length > 1 ? ` + ${booking.tests.length-1} more` : '') : 'Prescription Upload'}</h3>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${isRejected ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'}`}>{booking.status}</span>
             </div>
             
             {isRejected ? (
                 <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-bold flex items-center">
                     <Icon name="close" className="w-5 h-5 mr-2"/> Sample Rejected. Please contact support.
                 </div>
             ) : (
                 /* Timeline */
                 <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-6 my-4">
                     {steps.map((step, index) => {
                         const isCompleted = index <= currentStepIndex;
                         const isCurrent = index === currentStepIndex;
                         return (
                             <div key={step} className="relative">
                                 <div className={`absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 ${isCompleted ? 'bg-primary border-primary scale-110' : 'bg-white border-gray-300 dark:bg-dark dark:border-gray-600'}`}></div>
                                 <p className={`text-sm transition-colors duration-300 ${isCompleted ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-400'}`}>{step}</p>
                                 {isCurrent && booking.status !== 'Report Ready' && <p className="text-xs text-primary font-medium animate-pulse">In Progress...</p>}
                             </div>
                         )
                     })}
                 </div>
             )}
             
             <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-500 font-medium">Est. Report: 24 Hrs</p>
                <p className="font-bold text-primary">₹{booking.dueAmount} Due</p>
             </div>
        </Card>
    )
}

// ========== REPORTS SCREEN ==========
const ReportsScreen: React.FC = () => {
    const { reports, bookings } = useContext(AppContext);
    
    return (
         <Screen>
            <div className="p-5 space-y-5">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Reports</h1>
                {reports.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-64 text-center opacity-60">
                        <Icon name="file" className="w-16 h-16 mb-4 text-gray-300"/>
                        <p className="font-bold text-xl">No reports yet</p>
                    </div>
                ) : (
                    reports.map(report => {
                        const booking = bookings.find(b => b.id === report.bookingId);
                        return (
                            <Card key={report.id} className="group">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-red-100 text-red-600 p-4 rounded-2xl group-hover:scale-105 transition-transform">
                                        <span className="font-bold text-xs">PDF</span>
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-gray-800 dark:text-white">Lab Report</h3>
                                        <p className="text-xs text-gray-500">{new Date(report.generatedDate).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-400 mt-1">Booking #{report.bookingId.slice(-6)}</p>
                                    </div>
                                    <button className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 hover:bg-primary hover:text-white transition-colors">
                                        <Icon name="download" className="w-5 h-5" />
                                    </button>
                                </div>
                                {report.aiSummarySimple && (
                                    <div className="mt-4 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-xl border border-indigo-100 dark:border-indigo-800">
                                        <div className="flex items-center mb-2 text-primary font-bold text-sm">
                                            <Icon name="spark" className="w-4 h-4 mr-2" /> AI Summary
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{report.aiSummarySimple}</p>
                                    </div>
                                )}
                            </Card>
                        )
                    })
                )}
            </div>
         </Screen>
    );
};

// ========== AI CHATBOT SCREEN ==========
const AIChatbotScreen: React.FC = () => {
    const { user } = useContext(AppContext);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', sender: 'ai', text: `Hello ${user?.name}! I'm Dr. AI. I can help you understand your symptoms or lab reports. What's on your mind?`, timestamp: new Date().toISOString() }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Convert chat history for API
            const history = messages.map(m => ({ role: m.sender === 'ai' ? 'model' : 'user', parts: [{ text: m.text }] }));
            const responseText = await GeminiService.getHealthAdvice(input, history);
            
            const aiMsg: ChatMessage = { id: (Date.now()+1).toString(), sender: 'ai', text: responseText, timestamp: new Date().toISOString() };
            setMessages(prev => [...prev, aiMsg]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Screen>
            <div className="flex flex-col h-screen pb-24 bg-gray-50 dark:bg-dark">
                {/* Header */}
                <div className="p-4 bg-white dark:bg-dark-secondary shadow-sm z-10 flex items-center space-x-3 sticky top-0">
                    <div className="w-10 h-10 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-lg">
                        <Icon name="spark" className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Dr. AI Assistant</h1>
                        <p className="text-xs text-green-500 font-medium flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>Online</p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-scaleIn`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-dark-secondary text-gray-800 dark:text-white rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                         <div className="flex justify-start">
                            <div className="bg-white dark:bg-dark-secondary p-4 rounded-2xl rounded-bl-none shadow-sm flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-dark-secondary border-t border-gray-100 dark:border-gray-800 sticky bottom-20">
                    <div className="flex items-center space-x-2">
                        <input 
                            className="flex-grow bg-gray-100 dark:bg-gray-800 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="Ask a health question..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} disabled={loading || !input.trim()} className="p-3.5 bg-primary text-white rounded-xl hover:bg-primary-light disabled:opacity-50 shadow-lg shadow-primary/30 transition-transform active:scale-95">
                            <Icon name="chevronRight" className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </Screen>
    );
};

const OffersScreen: React.FC<{setActiveScreen: (screen: string) => void}> = ({setActiveScreen}) => {
    return (
        <Screen>
            <div className="p-5 space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                    <button onClick={() => setActiveScreen('home')} className="p-3 rounded-full bg-white dark:bg-dark-secondary shadow-sm hover:bg-gray-100">
                        <Icon name="chevronLeft" className="w-6 h-6 text-primary" />
                    </button>
                    <h1 className="text-2xl font-extrabold">Special Offers</h1>
                </div>
                <Card className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none relative overflow-hidden">
                     <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                    <h2 className="text-2xl font-bold">Flat 20% OFF</h2>
                    <p className="font-medium mt-1 opacity-90">On all Full Body Checkups</p>
                    <div className="mt-4 bg-white/20 backdrop-blur-sm p-2 rounded-lg inline-block">
                        <code className="font-bold text-lg">CODE: HEALTH20</code>
                    </div>
                </Card>
                 <Card className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-none relative overflow-hidden">
                    <h2 className="text-xl font-bold">Family Pack</h2>
                    <p className="font-medium mt-1 opacity-90">Book for 3 members, get 1 test FREE</p>
                </Card>
            </div>
        </Screen>
    )
}

const ProfileScreen: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => (
    <Screen>
        <div className="p-6 bg-white dark:bg-dark min-h-screen">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">My Profile</h1>
            
            <div className="flex flex-col items-center mb-8 animate-scaleIn">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 shadow-2xl mb-4">
                    <div className="w-full h-full bg-white dark:bg-dark-secondary rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary">{user?.name.charAt(0)}</span>
                    </div>
                </div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-gray-500 font-medium">{user?.email}</p>
            </div>

            <div className="space-y-3 animate-slideInUp" style={{animationDelay: '100ms'}}>
                <Card className="flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="bg-blue-100 p-2.5 rounded-xl mr-4 text-blue-600"><Icon name="user" /></div>
                    <div className="flex-grow">
                        <p className="text-xs text-gray-400 uppercase font-bold">Full Name</p>
                        <p className="font-semibold">{user?.name}</p>
                    </div>
                </Card>
                 <Card className="flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="bg-green-100 p-2.5 rounded-xl mr-4 text-green-600"><Icon name="location" /></div>
                    <div className="flex-grow">
                        <p className="text-xs text-gray-400 uppercase font-bold">Address</p>
                        <p className="font-semibold">{user?.address}</p>
                    </div>
                </Card>
                 <Card className="flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="bg-purple-100 p-2.5 rounded-xl mr-4 text-purple-600"><Icon name="bookings" /></div>
                    <div className="flex-grow">
                        <p className="text-xs text-gray-400 uppercase font-bold">Phone</p>
                        <p className="font-semibold">{user?.phone}</p>
                    </div>
                </Card>
            </div>

            <Button variant="danger" onClick={onLogout} fullWidth className="mt-10 py-4 text-lg shadow-red-500/30">
                Log Out
            </Button>
            
            <p className="text-center text-gray-400 text-xs mt-6 font-medium">App Version 2.4.0 (Build 2025)</p>
        </div>
    </Screen>
);

export default UserPanel;
