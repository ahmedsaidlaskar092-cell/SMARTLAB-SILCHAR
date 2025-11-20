
import React, { useState, useContext, useMemo } from 'react';
import type { User, Test, Booking, Report, SampleStatus, PaymentStatus, PaymentMethod, IAppContext } from '../types';
import { AppContext } from '../App';
import { Card, Icon, Button, Spinner, Input, SideMenu, Modal } from '../components';
import * as GeminiService from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminPanel: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <AdminDashboardScreen />;
      case 'bookings': return <BookingManagementScreen />;
      case 'tests': return <TestMasterScreen />;
      case 'reports': return <ReportManagementScreen />;
      case 'users': return <UserManagementScreen />;
      case 'notifications': return <BroadcastNotificationScreen />;
      default: return <AdminDashboardScreen />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-dark text-slate-800 dark:text-gray-100">
        <header className="p-4 bg-white dark:bg-dark-secondary flex items-center justify-between shadow-md z-30 sticky top-0">
            <div className="flex items-center">
                <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mr-3">
                    <Icon name="menu" className="w-7 h-7 text-gray-700 dark:text-white"/>
                </button>
                <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 tracking-tight">
                    {activeScreen === 'dashboard' ? 'Admin Dashboard' : activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)}
                </h1>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {user.name.charAt(0)}
            </div>
        </header>

        <SideMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} activeScreen={activeScreen} setActiveScreen={setActiveScreen} onLogout={onLogout} />
        <main className="flex-grow overflow-y-auto p-4 lg:p-8 scrollbar-hide">
            <div key={activeScreen} className="animate-fadeIn max-w-6xl mx-auto">
                {renderScreen()}
            </div>
        </main>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string; delay?: number }> = ({ title, value, icon, color, delay = 0 }) => (
    <div className={`p-6 rounded-3xl shadow-lg text-white ${color} animate-slideInUp relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`} style={{animationDelay: `${delay}ms`}}>
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-2xl transition-all group-hover:scale-150"></div>
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-white/80 text-sm font-bold uppercase tracking-wider">{title}</p>
                <p className="text-4xl font-extrabold mt-2 shadow-sm">{value}</p>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                <Icon name={icon} className="w-8 h-8 text-white" />
            </div>
        </div>
    </div>
);

const AdminDashboardScreen: React.FC = () => {
    const { bookings, reports } = useContext(AppContext);
    const today = new Date().toISOString().split('T')[0];
    const todaysBookings = bookings.filter(b => b.bookingDate.startsWith(today));
    const revenueToday = todaysBookings.reduce((acc, b) => acc + b.paidAmount, 0);

    const data = useMemo(() => {
        const dailyRevenue: {[key: string]: number} = {};
        bookings.forEach(b => {
            const date = new Date(b.bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); // 12 Jan
            if(!dailyRevenue[date]) dailyRevenue[date] = 0;
            dailyRevenue[date] += b.paidAmount;
        });
        return Object.keys(dailyRevenue).map(date => ({ name: date, revenue: dailyRevenue[date] })).slice(-7);
    }, [bookings]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Today's Bookings" value={todaysBookings.length} icon="bookings" color="bg-gradient-to-br from-blue-500 to-indigo-600" delay={100} />
                <StatCard title="Samples Collected" value={bookings.filter(b => b.status === 'Collected').length} icon="flask" color="bg-gradient-to-br from-emerald-500 to-teal-600" delay={200} />
                <StatCard title="Revenue Today" value={`₹${revenueToday.toLocaleString()}`} icon="chart" color="bg-gradient-to-br from-violet-500 to-purple-600" delay={300} />
                <StatCard title="Pending Reports" value={bookings.filter(b => b.status === 'Processing').length} icon="file" color="bg-gradient-to-br from-orange-400 to-red-500" delay={400} />
            </div>
             <Card className="animate-slideInUp border-none shadow-xl" style={{animationDelay: '500ms'}}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-xl text-gray-800 dark:text-white flex items-center"><Icon name="chart" className="mr-2 text-primary"/> Revenue Analytics</h2>
                    <select className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-sm font-bold text-gray-600 dark:text-white border-none outline-none"><option>Last 7 Days</option></select>
                </div>
                <div style={{width: '100%', height: 300}}>
                    <ResponsiveContainer>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#64748B'}} dy={10} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#64748B'}} tickFormatter={(value) => `₹${value}`}/>
                            <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}/>
                            <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} barSize={40} />
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={1}/>
                                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.6}/>
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

// Booking Management
const BookingManagementScreen: React.FC = () => {
    const { bookings } = useContext(AppContext);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Sort by new
    const sortedBookings = [...bookings].sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    
    const filteredBookings = sortedBookings.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedBooking) {
        return <BookingDetailScreen booking={selectedBooking} onBack={() => setSelectedBooking(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                <Icon name="search" className="absolute left-4 top-4 text-gray-400"/>
                <input 
                    placeholder="Search Patient, ID, Status..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-md focus:ring-2 focus:ring-primary bg-white dark:bg-dark-secondary"
                />
            </div>
            <div className="space-y-3">
                {filteredBookings.map((booking, idx) => (
                    <div key={booking.id} onClick={() => setSelectedBooking(booking)} className="bg-white dark:bg-dark-secondary p-5 rounded-2xl shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer animate-slideInUp flex justify-between items-center group border-l-4 border-transparent hover:border-primary" style={{animationDelay: `${idx * 50}ms`}}>
                         <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                                {booking.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white text-lg">{booking.name}</p>
                                <p className="text-xs text-gray-400 font-mono">#{booking.id.slice(0,8)}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'Completed' ? 'bg-green-100 text-green-700' : (booking.status === 'Report Ready' ? 'bg-blue-100 text-blue-700' : (booking.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'))}`}>
                                {booking.status}
                            </span>
                            <p className="text-sm font-bold mt-1">₹{booking.totalAmount}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BookingDetailScreen: React.FC<{ booking: Booking; onBack: () => void }> = ({ booking, onBack }) => {
    const { updateBookingStatus, updateBookingDetails, tests: allTests, addReport } = useContext(AppContext);
    const [isCollecting, setIsCollecting] = useState(false);
    const [isUploadingReport, setIsUploadingReport] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    }

    const handleUpdateStatus = (status: SampleStatus) => {
        updateBookingStatus(booking.id, status);
        showToast(`Status updated to "${status}". WhatsApp notification sent to user.`);
    }

    const handleUpdateDetails = (updatedDetails: Partial<Booking>) => {
        updateBookingDetails(booking.id, updatedDetails);
        showToast("Details updated & User notified.");
    };

    const handleReportUpload = async (file: File) => {
        const mockContent = `File: ${file.name}\nPATIENT: ${booking.name}\n...`;
        const summarySimple = await GeminiService.analyzeReport(mockContent, 'user');
        const summaryTech = await GeminiService.analyzeReport(mockContent, 'technical');
        addReport({
            bookingId: booking.id,
            userId: booking.userId,
            pdfUrl: `/reports/${file.name}`,
            generatedDate: new Date().toISOString(),
            mockContent,
            aiSummarySimple: summarySimple,
            aiSummaryTechnical: summaryTech
        });
        setIsUploadingReport(false);
        showToast("Report Uploaded & Sent to User.");
    }
    
    return (
        <div className="space-y-6 relative">
            {toast && (
                <div className="fixed top-20 right-10 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-slideDown flex items-center font-bold">
                    <Icon name="whatsapp" className="mr-2 w-5 h-5"/> {toast}
                </div>
            )}
            
            <button onClick={onBack} className="font-bold text-primary flex items-center hover:underline"><Icon name="chevronLeft" className="w-5 h-5 mr-1"/> Back to List</button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient Info */}
                <Card className="lg:col-span-2 border-none shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-700">Patient Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                             <p className="text-gray-400 text-xs uppercase font-bold">Full Name</p>
                             <p className="font-semibold text-lg">{booking.name}</p>
                         </div>
                         <div>
                             <p className="text-gray-400 text-xs uppercase font-bold">Age</p>
                             <p className="font-semibold text-lg">{booking.age} Years</p>
                         </div>
                         <div>
                             <p className="text-gray-400 text-xs uppercase font-bold">Phone</p>
                             <p className="font-semibold text-lg">{booking.phone}</p>
                         </div>
                         <div>
                             <p className="text-gray-400 text-xs uppercase font-bold">Current Status</p>
                             <span className={`inline-block px-3 py-1 rounded-lg font-bold text-sm mt-1 ${booking.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'}`}>{booking.status}</span>
                         </div>
                         <div className="col-span-2">
                             <p className="text-gray-400 text-xs uppercase font-bold">Address</p>
                             <p className="font-medium">{booking.address}</p>
                         </div>
                    </div>
                    <div className="flex space-x-3 mt-6">
                        <Button onClick={() => window.open(`tel:${booking.phone}`)} variant="outline" className="flex-1 border-gray-300 text-gray-700 dark:text-white hover:bg-gray-50">Call User</Button>
                        <Button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${booking.live_location_lat},${booking.live_location_long}`)} variant="outline" className="flex-1 border-gray-300 text-gray-700 dark:text-white hover:bg-gray-50">Map Location</Button>
                    </div>
                </Card>
                
                {/* Payment Info */}
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-none shadow-inner">
                    <h3 className="font-bold text-lg mb-4 text-gray-700 dark:text-gray-200">Payment Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between"><span>Total MRP</span> <span className="font-medium">₹{booking.totalAmount}</span></div>
                        <div className="flex justify-between text-green-600"><span>Discount</span> <span>-₹{booking.discount.toFixed(0)}</span></div>
                        <div className="flex justify-between border-t border-gray-300 pt-2 font-bold text-xl"><span>To Pay</span> <span>₹{(booking.totalAmount - booking.discount).toFixed(0)}</span></div>
                        <div className="flex justify-between text-gray-500 text-sm mt-2"><span>Paid So Far</span> <span>₹{booking.paidAmount}</span></div>
                        <div className="flex justify-between text-red-500 font-bold text-lg"><span>Due Amount</span> <span>₹{booking.dueAmount}</span></div>
                    </div>
                    <div className={`mt-4 p-2 text-center rounded-lg font-bold text-sm ${booking.paymentStatus === 'Fully Paid' ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
                        {booking.paymentStatus.toUpperCase()}
                    </div>
                </Card>
            </div>

            <Card className="border-none shadow-lg">
                <h3 className="font-bold text-xl mb-4 flex items-center"><Icon name="whatsapp" className="w-6 h-6 text-green-500 mr-2"/> Update Status & Notify User</h3>
                <p className="text-sm text-gray-500 mb-4">Clicking these buttons will trigger the exact notification text requested.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Button onClick={() => setIsCollecting(true)} className="bg-blue-600 hover:bg-blue-700 shadow-blue-200 text-sm">Collected</Button>
                    <Button onClick={() => handleUpdateStatus('In Lab')} className="bg-purple-600 hover:bg-purple-700 shadow-purple-200 text-sm">In Main Lab</Button>
                    <Button onClick={() => handleUpdateStatus('Processing')} className="bg-amber-500 hover:bg-amber-600 shadow-amber-200 text-sm">Processing</Button>
                    <Button onClick={() => setIsUploadingReport(true)} className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 text-sm">Upload Report</Button>
                    <Button onClick={() => handleUpdateStatus('Rejected')} className="bg-red-600 hover:bg-red-700 shadow-red-200 text-sm">Reject Sample</Button>
                </div>
                
                <div className="mt-6 text-right pt-4 border-t border-gray-100 dark:border-gray-700">
                     <Button onClick={() => handleUpdateStatus('Completed')} variant="outline" className="text-xs py-2">Mark Order Completed</Button>
                </div>
            </Card>
            
            {isCollecting && <SampleCollectionModal booking={booking} onSave={handleUpdateDetails} onClose={() => setIsCollecting(false)} allTests={allTests} />}
            {isUploadingReport && <ReportUploadModal onUpload={handleReportUpload} onClose={() => setIsUploadingReport(false)}/>}
        </div>
    );
};

// Sample Collection Modal
const SampleCollectionModal: React.FC<{booking: Booking, onClose: () => void, onSave: (d: Partial<Booking>) => void, allTests: Test[]}> = ({booking, onClose, onSave, allTests}) => {
    const [selectedTests, setSelectedTests] = useState<Test[]>(booking.tests);
    const [additionalDiscount, setAdditionalDiscount] = useState(0);
    const [cashPaid, setCashPaid] = useState(0);
    const [upiPaid, setUpiPaid] = useState(0);

    const totalMrp = useMemo(() => selectedTests.reduce((sum, test) => sum + test.mrp, 0), [selectedTests]);
    const autoDiscount = totalMrp * 0.20;
    const totalDiscount = autoDiscount + additionalDiscount;
    const finalAmount = totalMrp - totalDiscount;
    const totalPaid = cashPaid + upiPaid;
    const dueAmount = finalAmount - totalPaid;

    const handleSave = () => {
        const paymentStatus: PaymentStatus = dueAmount <= 0 ? 'Fully Paid' : (totalPaid > 0 ? 'Partially Paid' : 'Pending');
        onSave({
            tests: selectedTests,
            totalAmount: totalMrp,
            discount: totalDiscount,
            paidAmount: totalPaid,
            dueAmount: dueAmount > 0 ? dueAmount : 0,
            paymentStatus,
            status: 'Collected'
        });
        onClose();
    };
    
    return (
        <Modal title="Sample Collection" onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold mb-2 text-gray-700 dark:text-gray-300">Confirm Tests</h4>
                    <div className="max-h-40 overflow-y-auto border rounded-xl p-2 dark:border-gray-600 bg-gray-50 dark:bg-dark">
                        {allTests.filter(t => t.active).map(test => (
                            <div key={test.id} className="flex items-center p-1">
                                <input type="checkbox" id={`test-${test.id}`} checked={!!selectedTests.find(t=>t.id===test.id)} onChange={() => setSelectedTests(p => p.find(t=>t.id===test.id) ? p.filter(t=>t.id!==test.id) : [...p, test])} className="w-4 h-4 text-primary rounded"/>
                                <label htmlFor={`test-${test.id}`} className="ml-2 text-sm">{test.name} (₹{test.mrp})</label>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl space-y-2 border border-indigo-100 dark:border-indigo-800">
                    <div className="flex justify-between text-sm"><span>Total MRP:</span> <span>₹{totalMrp.toFixed(0)}</span></div>
                    <div className="flex justify-between text-sm text-green-600 font-bold"><span>Discount (20%):</span> <span>-₹{autoDiscount.toFixed(0)}</span></div>
                    <Input label="Extra Discount (₹)" type="number" value={additionalDiscount} onChange={e => setAdditionalDiscount(parseFloat(e.target.value) || 0)} className="py-2 text-sm"/>
                    <div className="flex justify-between font-extrabold text-xl border-t border-indigo-200 pt-2 mt-1"><span>To Collect:</span> <span>₹{finalAmount.toFixed(0)}</span></div>
                </div>

                 <div>
                    <h4 className="font-bold mb-2 text-gray-700 dark:text-gray-300">Receive Payment</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Cash (₹)" type="number" value={cashPaid} onChange={e => setCashPaid(parseFloat(e.target.value) || 0)} />
                        <Input label="UPI (₹)" type="number" value={upiPaid} onChange={e => setUpiPaid(parseFloat(e.target.value) || 0)} />
                    </div>
                </div>
                 <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-center">
                    <p className="text-sm text-gray-500">Total Received: ₹{totalPaid.toFixed(0)}</p>
                    <p className={`text-lg font-bold ${dueAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {dueAmount > 0 ? `Balance Due: ₹${dueAmount.toFixed(0)}` : 'Payment Complete'}
                    </p>
                </div>
                <Button fullWidth onClick={handleSave} className="bg-gradient-to-r from-primary to-indigo-600 shadow-lg">Save & Mark Collected</Button>
            </div>
        </Modal>
    )
}

// Report Upload Modal
const ReportUploadModal: React.FC<{onClose: () => void, onUpload: (file: File) => void}> = ({onClose, onUpload}) => {
    const [file, setFile] = useState<File | null>(null);
    return (
        <Modal title="Upload Final Report" onClose={onClose}>
            <div className="space-y-6 text-center">
                <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl p-10 flex flex-col items-center justify-center">
                    <Icon name="file" className="w-16 h-16 text-primary/50 mb-4"/>
                    <input type="file" accept=".pdf" id="file-upload" className="hidden" onChange={e => setFile(e.target.files ? e.target.files[0] : null)}/>
                    <label htmlFor="file-upload" className="cursor-pointer bg-white text-primary font-bold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                        {file ? 'Change File' : 'Select PDF File'}
                    </label>
                    {file && <p className="mt-2 font-medium text-gray-700">{file.name}</p>}
                </div>
                <p className="text-xs text-gray-400">Uploading will automatically trigger "Your Final Report Is Ready" notification.</p>
                <Button fullWidth disabled={!file} onClick={() => onUpload(file!)} className="shadow-xl">Upload & Notify User</Button>
            </div>
        </Modal>
    )
}


// Other Admin Screens
const TestMasterScreen: React.FC = () => {
    const { tests, addTest, updateTest } = useContext(AppContext);
    const [editingTest, setEditingTest] = useState<Test | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleSave = (testData: Omit<Test, 'id'> | Test) => {
        if ('id' in testData) {
            updateTest(testData.id, testData);
        } else {
            addTest(testData);
        }
        setEditingTest(null);
        setIsCreating(false);
    }
    
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {tests.map((test, idx) => (
                 <Card key={test.id} className="flex justify-between items-center animate-slideInUp border-l-4 border-l-primary" style={{animationDelay: `${idx * 20}ms`}}>
                     <div>
                        <p className={`font-bold text-lg ${!test.active && 'line-through text-gray-400'}`}>{test.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{test.code}</p>
                        <p className="text-primary font-bold mt-1">₹{test.mrp}</p>
                     </div>
                     <Button onClick={() => setEditingTest(test)} variant="secondary" className="text-sm px-4 py-2">Edit</Button>
                 </Card>
             ))}
             </div>
             <div className="fixed bottom-8 right-8 z-20">
                <Button onClick={() => setIsCreating(true)} className="rounded-full w-16 h-16 !p-0 shadow-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center"><Icon name="plus" className="w-8 h-8"/></Button>
            </div>
            {(editingTest || isCreating) && <TestEditModal test={editingTest} onSave={handleSave} onClose={() => {setEditingTest(null); setIsCreating(false)}} />}
        </div>
    )
};

const TestEditModal: React.FC<{test: Test | null, onClose: () => void, onSave: (t: Test | Omit<Test, 'id'>) => void}> = ({test, onClose, onSave}) => {
    const [formData, setFormData] = useState({
        name: test?.name || '', code: test?.code || '', mrp: test?.mrp || 0, category: test?.category || '', sampleType: test?.sampleType || '', referenceRange: test?.referenceRange || '', unit: test?.unit || '', active: test?.active ?? true
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = e.target;
        setFormData(p => ({...p, [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)}));
    };
    
    const handleSubmit = () => {
        onSave(test ? {...formData, id: test.id} : formData);
    }

    return (
        <Modal title={test ? 'Edit Test' : 'Add Test'} onClose={onClose}>
            <div className="space-y-3 max-h-96 overflow-y-auto p-1 custom-scrollbar">
                <Input label="Test Name" name="name" value={formData.name} onChange={handleChange}/>
                <div className="grid grid-cols-2 gap-3">
                    <Input label="Code" name="code" value={formData.code} onChange={handleChange}/>
                    <Input label="Price (₹)" name="mrp" type="number" value={formData.mrp} onChange={handleChange}/>
                </div>
                <Input label="Category" name="category" value={formData.category} onChange={handleChange}/>
                <Input label="Sample Type" name="sampleType" value={formData.sampleType} onChange={handleChange}/>
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"><input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="h-5 w-5 text-primary"/><label className="ml-2 font-bold text-gray-700 dark:text-white">Test Active</label></div>
            </div>
            <Button fullWidth onClick={handleSubmit} className="mt-4">Save Test</Button>
        </Modal>
    )
}

const ReportManagementScreen: React.FC = () => {
    const { bookings } = useContext(AppContext);
    const bookingsNeedingReports = bookings.filter(b => b.status === 'Processing');
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Pending Reports</h2>
            {bookingsNeedingReports.length > 0 ? bookingsNeedingReports.map((b, idx) => (
                <Card key={b.id} className="animate-slideInUp mb-4 flex justify-between items-center" style={{animationDelay: `${idx * 100}ms`}}>
                    <div>
                        <p className="font-bold text-lg">{b.name}</p>
                        <p className="text-gray-400 text-sm">Booking #{b.id.slice(0,6)}</p>
                    </div>
                    <Button className="text-sm">Upload</Button>
                </Card>
            )) : (
                <div className="text-center py-20 bg-white dark:bg-dark-secondary rounded-3xl shadow-sm">
                    <Icon name="check" className="w-16 h-16 text-green-400 mx-auto mb-4"/>
                    <p className="text-xl font-bold text-gray-400">All caught up!</p>
                    <p className="text-gray-400">No bookings pending for reports.</p>
                </div>
            )}
        </div>
    );
};

const UserManagementScreen: React.FC = () => {
    const { users, updateUser, deleteUser } = useContext(AppContext);
    const nonAdminUsers = users.filter(u => u.role !== 'admin');
    return (
        <div className="space-y-4">
            {nonAdminUsers.map((user, idx) => (
                <Card key={user.id} className="animate-slideInUp flex items-center justify-between" style={{animationDelay: `${idx * 100}ms`}}>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="secondary" className={`text-xs px-3 py-2 ${user.blocked ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`} onClick={() => updateUser(user.id, {blocked: !user.blocked})}>{user.blocked ? 'Unblock' : 'Block'}</Button>
                        <button onClick={() => confirm('Are you sure?') && deleteUser(user.id)} className="p-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-xl transition-colors"><Icon name="close" className="w-4 h-4"/></button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

const BroadcastNotificationScreen: React.FC = () => {
    const { sendNotification, users } = useContext(AppContext);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetUser, setTargetUser] = useState<'all' | string>('all');

    const handleSend = () => {
        if(!title || !message) return alert("Title and message are required.");
        sendNotification({
            userId: targetUser,
            title,
            message
        });
        alert("Notification sent!");
        setTitle(''); setMessage('');
    }

    return (
        <Card className="space-y-6 max-w-2xl mx-auto border-none shadow-2xl">
            <div className="text-center mb-4">
                <div className="w-16 h-16 bg-indigo-100 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="volume" className="w-8 h-8"/>
                </div>
                <h2 className="text-2xl font-bold">Send Broadcast</h2>
                <p className="text-gray-500">Send announcements or offers to users.</p>
            </div>
            
            <Input label="Notification Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Monsoon Offer" />
            <div className="w-full">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Message</label>
                <textarea 
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                    rows={4}
                    className="w-full p-4 bg-white dark:bg-dark-secondary border border-gray-200 dark:border-gray-700 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Type your message here..."
                />
            </div>
            
            <div className="w-full">
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Target Audience</label>
                <select value={targetUser} onChange={e => setTargetUser(e.target.value)} className="w-full p-4 bg-white dark:bg-dark-secondary border border-gray-200 dark:border-gray-700 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="all">All Users (Broadcast)</option>
                    {users.filter(u=>u.role==='user').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
            </div>

            <Button fullWidth onClick={handleSend} className="shadow-xl text-lg">Send Notification</Button>
        </Card>
    );
};

export default AdminPanel;
