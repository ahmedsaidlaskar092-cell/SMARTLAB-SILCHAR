

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
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
        <div className="fixed top-5 right-5 left-5 max-w-md mx-auto z-50">
            <Card className="bg-primary text-white shadow-2xl animate-pulse">
                <div className="flex items-start space-x-3">
                    <Icon name="spark" className="w-6 h-6 mt-1" />
                    <div>
                        <h3 className="font-bold text-lg">{currentNotification.title}</h3>
                        <p>{currentNotification.message}</p>
                    </div>
                    <button onClick={() => setVisible(false)} className="absolute top-2 right-2"><Icon name="close" className="w-5 h-5"/></button>
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
    <div className="h-screen w-screen flex flex-col">
        <NotificationPopup />
        <div className="flex-grow overflow-y-auto pb-20">
            {renderScreen()}
        </div>
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
    </div>
  );
};


const UserHomeScreen: React.FC<{setActiveScreen: (screen: string) => void}> = ({setActiveScreen}) => {
    const { user } = useContext(AppContext);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-3xl font-bold">Hello, {user?.name.split(' ')[0]}!</h1>
            
            <Card className="bg-primary text-white">
                <h2 className="text-xl font-bold">Book a Lab Test</h2>
                <p className="mt-2 mb-4">Book with or without a prescription. Fast, accurate, and convenient. Enjoy 20% OFF on all tests!</p>
                <Button variant="secondary" onClick={() => setActiveScreen('book')}>Book Now</Button>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <HomeCard icon="location" title="Track Sample" onClick={() => setActiveScreen('track')} />
                <HomeCard icon="file" title="My Reports" onClick={() => setActiveScreen('reports')} />
                <HomeCard icon="spark" title="AI Assistant" onClick={() => setActiveScreen('ai')} />
                <HomeCard icon="users" title="Notifications" onClick={() => setActiveScreen('notifications')} />
            </div>
            <OurServicesCard />
            <FindLabsCard />
        </div>
    );
};

const OurServicesCard: React.FC = () => (
    <Card>
        <h2 className="text-lg font-bold">Our Services</h2>
        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
            We provide home sample collection services in <span className="font-semibold">Silchar and up to 25km</span> outside the city.
        </p>
        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
            Our trusted partners include: Biomed, Lal Path Labs, Metropolis, Lupin (Jibon Jyoti) JJIMS LAB, and more.
        </p>
    </Card>
);

const HomeCard: React.FC<{icon: string; title: string; onClick: () => void}> = ({icon, title, onClick}) => (
    <Card onClick={onClick} className="text-center flex flex-col items-center justify-center p-6 space-y-2 cursor-pointer hover:shadow-lg transition-shadow active:scale-95">
        <Icon name={icon} className="w-10 h-10 text-primary" />
        <h3 className="font-semibold">{title}</h3>
    </Card>
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
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({ lat: position.coords.latitude, long: position.coords.longitude });
                setLocating(false);
            },
            (error) => {
                console.error("Error getting location", error);
                alert("Could not get location. Please enable permissions and try again.");
                setLocating(false);
            }
        );
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
        if (!name || !age || !phone || !address || !location) {
            alert("Please fill all required fields and capture your location.");
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
            live_location_lat: location.lat,
            live_location_long: location.long,
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
            alert("Booking successful! Our team will contact you shortly.");
            setActiveScreen('home');
        }, 1500);
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
                <button onClick={() => setActiveScreen('home')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-secondary">
                    <Icon name="close" className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Book a Test</h1>
            </div>

            <Card>
                <h2 className="font-bold text-lg mb-2">Patient Details</h2>
                <div className="space-y-3">
                    <Input label="Name" value={name} onChange={e => setName(e.target.value)} required/>
                    <Input label="Age" type="number" value={age} onChange={e => setAge(e.target.value)} required/>
                    <Input label="Phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required/>
                    <Input label="Address" value={address} onChange={e => setAddress(e.target.value)} required/>
                    <Button onClick={handleGetLocation} fullWidth disabled={locating}>
                        {locating ? <Spinner/> : <Icon name="location" className="w-5 h-5 inline mr-2"/>}
                        {location ? 'Location Captured!' : 'Capture Live Location'}
                    </Button>
                </div>
            </Card>

            <div className="flex items-center justify-center space-x-2 bg-gray-200 dark:bg-dark-secondary p-1 rounded-full">
                <button onClick={() => setBookingType('with_tests')} className={`px-4 py-2 rounded-full font-semibold w-1/2 ${bookingType === 'with_tests' ? 'bg-white dark:bg-dark shadow' : ''}`}>Select Tests</button>
                <button onClick={() => setBookingType('without_tests')} className={`px-4 py-2 rounded-full font-semibold w-1/2 ${bookingType === 'without_tests' ? 'bg-white dark:bg-dark shadow' : ''}`}>Book without Tests</button>
            </div>

            {bookingType === 'with_tests' ? (
                <Card>
                    <h2 className="font-bold text-lg mb-2">Select Tests</h2>
                    <Input placeholder="Search test by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                    <div className="max-h-60 overflow-y-auto mt-2 space-y-1">
                        {filteredTests.map(test => (
                            <div key={test.id} onClick={() => toggleTest(test)} className={`p-2 rounded-lg flex justify-between items-center cursor-pointer ${selectedTests.find(t => t.id === test.id) ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-dark'}`}>
                                <span>{test.name}</span>
                                <span className="font-bold">${test.mrp}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            ) : (
                <Card>
                    <h2 className="font-bold text-lg mb-2">Book without Tests</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Our phlebotomist will help you with test selection during sample collection.</p>
                    <Input label="Symptoms (Optional)" placeholder="e.g., Fever, cough" value={symptoms} onChange={e => setSymptoms(e.target.value)} />
                </Card>
            )}

            <Card>
                <h2 className="font-bold text-lg mb-2">Payment</h2>
                 {bookingType === 'with_tests' && selectedTests.length > 0 && (
                    <div className="p-3 bg-light dark:bg-dark-secondary rounded-xl mb-3 space-y-1">
                        <div className="flex justify-between"><span>Total MRP:</span> <span>${totalMrp.toFixed(2)}</span></div>
                        <div className="flex justify-between text-green-600"><span>Discount (20%):</span> <span>-${discount.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-xl border-t pt-1 mt-1"><span>Payable Amount:</span> <span>${finalAmount.toFixed(2)}</span></div>
                    </div>
                 )}
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full p-3 bg-gray-100 dark:bg-dark-secondary border border-gray-300 dark:border-gray-600 rounded-xl">
                    <option value="Online">Pay Online (After Booking)</option>
                    <option value="Cash">Pay with Cash</option>
                    <option value="UPI">Pay with UPI</option>
                </select>
            </Card>

            <Button fullWidth onClick={handleSubmit} disabled={loading}>
                {loading ? <Spinner /> : 'Confirm Booking'}
            </Button>
        </div>
    );
};


const TrackSampleScreen: React.FC = () => {
    const { bookings, user } = useContext(AppContext);
    const userBookings = bookings.filter(b => b.userId === user?.id);
    const statusOrder: SampleStatus[] = ['Pending', 'Assigned', 'On Way', 'Collected', 'In Lab', 'Processing', 'Report Ready', 'Completed'];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Sample Tracking</h1>
            {userBookings.length > 0 ? (
                userBookings.map(booking => (
                    <Card key={booking.id} className="mb-4">
                        <h2 className="font-bold text-lg">Booking #{booking.id.slice(0,6)}</h2>
                        <p className="text-sm text-gray-500 mb-2">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                         <div className={`p-2 rounded-lg ${booking.paymentStatus === 'Fully Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            <p className="font-bold">Payment: {booking.paymentStatus}</p>
                            <p>Paid: ${booking.paidAmount.toFixed(2)}, Due: ${booking.dueAmount.toFixed(2)}</p>
                        </div>
                        <div className="mt-4">
                            <div className="relative">
                                <div className="absolute left-4 top-0 h-full border-l-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                                {statusOrder.map((status, index) => {
                                    const currentIndex = statusOrder.indexOf(booking.status);
                                    const isCompleted = index <= currentIndex;
                                    const isCurrent = index === currentIndex;
                                    return (
                                        <div key={status} className="flex items-center mb-6 relative">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${isCompleted ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                                {isCompleted ? <Icon name="check" className="w-5 h-5"/> : <div className="w-3 h-3 bg-gray-400 rounded-full"></div>}
                                            </div>
                                            <div className="ml-4">
                                                <p className={`font-semibold ${isCurrent ? 'text-primary' : ''}`}>{status}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                ))
            ) : <p>No active samples to track.</p>}
        </div>
    );
};

const ReportsScreen: React.FC = () => {
    const { reports, user } = useContext(AppContext);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const userReports = reports.filter(r => r.userId === user?.id);

    if (selectedReport) {
        return <ReportDetailScreen report={selectedReport} onBack={() => setSelectedReport(null)} />;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Reports</h1>
            {userReports.length > 0 ? (
                userReports.map(report => (
                    <Card key={report.id} className="mb-4 flex justify-between items-center">
                        <div>
                            <h2 className="font-bold">Report #{report.bookingId.slice(0,6)}</h2>
                            <p className="text-sm text-gray-500">{new Date(report.generatedDate).toLocaleDateString()}</p>
                        </div>
                        <Button onClick={() => setSelectedReport(report)}>View</Button>
                    </Card>
                ))
            ) : <p>No reports found.</p>}
        </div>
    );
};

const ReportDetailScreen: React.FC<{report: Report, onBack: () => void}> = ({ report, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(report.aiSummarySimple || '');

    const handleAnalyze = async () => {
        setLoading(true);
        const result = await GeminiService.analyzeReport(report.mockContent, 'user');
        setSummary(result);
        report.aiSummarySimple = result; 
        setLoading(false);
    };

    return (
        <div className="p-4">
            <button onClick={onBack} className="mb-4 font-semibold text-primary flex items-center"><Icon name="chevronLeft" className="w-5 h-5"/> Back to Reports</button>
            <Card>
                <div className="bg-gray-200 dark:bg-gray-700 h-64 flex items-center justify-center rounded-lg mb-4"><p>Mobile PDF Viewer</p></div>
                <Button fullWidth onClick={() => alert("Downloading PDF...")}><Icon name="download" className="inline-block w-5 h-5 mr-2" />Download Report</Button>
            </Card>

            <Card className="mt-4">
                <h2 className="text-xl font-bold mb-2">AI Explanation</h2>
                {loading && <Spinner />}
                {!loading && summary && <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">{summary}</div>}
                {!loading && !summary && <Button onClick={handleAnalyze}>Analyze My Report</Button>}
            </Card>
        </div>
    );
};

const AIChatbotScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your AI Health Assistant. How can I help you today?', timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // FIX: Correctly map 'ai' sender to 'model' role for Gemini API compatibility.
    const chatHistory = messages.map(m => ({ role: m.sender === 'ai' ? 'model' : 'user', parts: [{text: m.text}] }));
    const aiResponseText = await GeminiService.getHealthAdvice(input, chatHistory);

    const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
        <div className="p-4 border-b dark:border-gray-700"><h1 className="text-xl font-bold text-center">AI Health Assistant</h1></div>
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
            {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-dark-secondary rounded-bl-none'}`}>{msg.text}</div>
                </div>
            ))}
            {loading && <div className="flex justify-start"><div className="p-3 rounded-2xl bg-gray-200 dark:bg-dark-secondary"><Spinner /></div></div>}
            <div ref={chatEndRef} />
        </div>
        <div className="p-4 bg-white dark:bg-dark-secondary border-t dark:border-gray-700 flex items-center space-x-2">
            <button className="p-3 hover:bg-light dark:hover:bg-gray-700 rounded-full"><Icon name="mic" /></button>
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask something..." onKeyPress={e => e.key === 'Enter' && handleSend()} className="flex-grow"/>
            <button className="p-3 hover:bg-light dark:hover:bg-gray-700 rounded-full"><Icon name="volume" /></button>
            <Button onClick={handleSend} disabled={loading || !input.trim()}>Send</Button>
        </div>
    </div>
  );
};

const OffersScreen: React.FC<{setActiveScreen: (screen: string) => void}> = ({ setActiveScreen }) => {
    const { user, notifications, markNotificationsAsRead } = useContext(AppContext);

    useEffect(() => {
        markNotificationsAsRead(user!.id);
    }, [user, markNotificationsAsRead]);

    const userNotifications = notifications.filter(n => n.userId === 'all' || n.userId === user?.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Offers & Notifications</h1>
            {userNotifications.length > 0 ? (
                userNotifications.map(n => (
                    <Card key={n.id}>
                        <h2 className="font-bold text-lg">{n.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(n.timestamp).toLocaleString()}</p>
                    </Card>
                ))
            ) : (
                <p>No new notifications.</p>
            )}
        </div>
    );
};

const ProfileScreen: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => (
  <div className="p-4 space-y-4">
    <h1 className="text-2xl font-bold">My Profile</h1>
    <Card className="text-center">
        <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-4xl font-bold">{user.name.charAt(0)}</div>
        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
    </Card>
    <Button fullWidth variant="secondary">Edit Profile</Button>
    <Button fullWidth variant="danger" onClick={onLogout}>Logout</Button>
  </div>
);

const FindLabsCard: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{text: string; chunks: any[] | undefined}>({text: '', chunks: []});

    const handleFindLabs = async () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const res = await GeminiService.findNearbyLabs(position.coords.latitude, position.coords.longitude);
            setResult(res);
            setLoading(false);
        }, (error) => {
             console.error("Geolocation error:", error);
             alert("Please enable location services to find nearby labs.");
             setLoading(false);
        });
    };

    return (
        <Card>
            <h2 className="text-lg font-bold">Find Nearby Centers</h2>
            {loading && <Spinner />}
            {!loading && !result.text && <Button onClick={handleFindLabs} className="mt-2">Find Now</Button>}
            {result.text && (
                <div className="mt-2 text-sm space-y-2">
                    <p className="whitespace-pre-wrap">{result.text}</p>
                    {result.chunks && result.chunks.length > 0 && (
                        <div>
                            <h3 className="font-bold mt-2">Sources on Google Maps:</h3>
                            <ul className="list-disc list-inside">
                                {result.chunks.map((chunk, index) => (
                                    chunk.maps && <li key={index}><a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-primary underline">{chunk.maps.title}</a></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

export default UserPanel;
