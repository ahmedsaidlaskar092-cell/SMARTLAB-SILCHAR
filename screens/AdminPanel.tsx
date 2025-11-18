

import React, { useState, useContext, useMemo } from 'react';
import type { User, Test, Booking, Report, SampleStatus, PaymentStatus, PaymentMethod } from '../types';
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
    <div className="h-screen w-screen flex flex-col bg-light dark:bg-dark">
        <header className="p-4 bg-white dark:bg-dark-secondary flex items-center justify-between shadow-md z-10">
            <button onClick={() => setIsMenuOpen(true)}><Icon name="menu" className="w-8 h-8"/></button>
            <h1 className="text-xl font-bold text-primary">{activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)}</h1>
            <div className="w-8"></div>
        </header>

        <SideMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} activeScreen={activeScreen} setActiveScreen={setActiveScreen} onLogout={onLogout} />
        <main className="flex-grow overflow-y-auto p-4">{renderScreen()}</main>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <Card className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}><Icon name={icon} className="w-8 h-8 text-white" /></div>
        <div>
            <p className="text-gray-500 dark:text-gray-400">{title}</p><p className="text-2xl font-bold">{value}</p>
        </div>
    </Card>
);

const AdminDashboardScreen: React.FC = () => {
    const { bookings, reports } = useContext(AppContext);
    const today = new Date().toISOString().split('T')[0];
    const todaysBookings = bookings.filter(b => b.bookingDate.startsWith(today));
    const revenueToday = todaysBookings.reduce((acc, b) => acc + b.paidAmount, 0);
    const abnormalReports = reports.filter(r => r.aiSummarySimple?.toLowerCase().includes('high') || r.aiSummarySimple?.toLowerCase().includes('low')).length;

    const data = useMemo(() => {
        const dailyRevenue: {[key: string]: number} = {};
        bookings.forEach(b => {
            const date = new Date(b.bookingDate).toLocaleDateString('en-CA');
            if(!dailyRevenue[date]) dailyRevenue[date] = 0;
            dailyRevenue[date] += b.paidAmount;
        });
        return Object.keys(dailyRevenue).map(date => ({ name: date, revenue: dailyRevenue[date] })).slice(-7);
    }, [bookings]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <StatCard title="Today's Bookings" value={todaysBookings.length} icon="bookings" color="bg-blue-500" />
                <StatCard title="Samples Collected" value={bookings.filter(b => b.status === 'Collected').length} icon="flask" color="bg-green-500" />
                <StatCard title="Reports Pending" value={bookings.filter(b => b.status !== 'Report Ready' && b.status !== 'Completed').length} icon="file" color="bg-yellow-500" />
                <StatCard title="Revenue Today" value={`$${revenueToday.toFixed(2)}`} icon="chart" color="bg-indigo-500" />
                <StatCard title="Abnormal Reports" value={abnormalReports} icon="spark" color="bg-red-500" />
            </div>
             <Card>
                <h2 className="font-bold text-lg mb-4">Daily Revenue (Last 7 Days)</h2>
                <div style={{width: '100%', height: 200}}>
                    <ResponsiveContainer><BarChart data={data}><XAxis dataKey="name" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="revenue" fill="#1E88E5" /></BarChart></ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

// Booking Management
const BookingManagementScreen: React.FC = () => {
    const { bookings } = useContext(AppContext);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    return selectedBooking ? 
        <BookingDetailScreen booking={selectedBooking} onBack={() => setSelectedBooking(null)} /> : 
        (
            <div className="space-y-4">
                {bookings.map(booking => (
                    <Card key={booking.id} onClick={() => setSelectedBooking(booking)} className="cursor-pointer hover:shadow-lg">
                         <p className="font-bold">{booking.name} <span className="text-sm font-normal text-gray-500">({booking.age})</span></p>
                         <p className="text-sm">Due: <span className="font-bold">${booking.dueAmount.toFixed(2)}</span></p>
                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'Report Ready' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{booking.status}</span>
                    </Card>
                ))}
            </div>
        );
};

const BookingDetailScreen: React.FC<{ booking: Booking; onBack: () => void }> = ({ booking, onBack }) => {
    const { updateBookingStatus, updateBookingDetails, tests: allTests, addReport } = useContext(AppContext);
    const [isCollecting, setIsCollecting] = useState(false);
    const [isUploadingReport, setIsUploadingReport] = useState(false);

    const handleUpdateDetails = (updatedDetails: Partial<Booking>) => {
        updateBookingDetails(booking.id, updatedDetails);
    };

    const handleReportUpload = async (file: File) => {
        // Mock upload and analysis
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
    }
    
    return (
        <div className="space-y-4">
            <button onClick={onBack} className="font-semibold text-primary flex items-center"><Icon name="chevronLeft" className="w-5 h-5"/> Back to Bookings</button>
            <Card>
                <h2 className="text-xl font-bold">Booking #{booking.id.slice(0,6)}</h2>
                <p><span className="font-semibold">Patient:</span> {booking.name}, {booking.age}</p>
                <p><span className="font-semibold">Contact:</span> {booking.phone}</p>
                <p><span className="font-semibold">Address:</span> {booking.address}</p>
                <div className="flex space-x-2 mt-2">
                    <Button onClick={() => window.open(`tel:${booking.phone}`)} className="flex-1">Call</Button>
                    <Button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${booking.live_location_lat},${booking.live_location_long}`)} className="flex-1">Navigate</Button>
                </div>
            </Card>
            <Card>
                <h3 className="font-bold mb-2">Payment Details</h3>
                <p>Total: ${booking.totalAmount.toFixed(2)} | Paid: ${booking.paidAmount.toFixed(2)} | Due: <span className="font-bold text-red-500">${booking.dueAmount.toFixed(2)}</span></p>
                <p>Status: <span className="font-semibold">{booking.paymentStatus}</span></p>
            </Card>
            <Card>
                <h3 className="font-bold mb-2">Tests</h3>
                {booking.tests.length > 0 ? <ul className="list-disc list-inside">{booking.tests.map(t => <li key={t.id}>{t.name}</li>)}</ul> : <p className="text-gray-500">No tests selected by user.</p>}
            </Card>
            <Card>
                <h3 className="font-bold mb-2">Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => setIsCollecting(true)}>Sample Collection</Button>
                    <Button onClick={() => updateBookingStatus(booking.id, 'In Lab')}>Mark In Lab</Button>
                    <Button onClick={() => updateBookingStatus(booking.id, 'Processing')}>Mark Processing</Button>
                    <Button onClick={() => setIsUploadingReport(true)}>Upload Report</Button>
                    <Button onClick={() => updateBookingStatus(booking.id, 'Completed')} variant='secondary'>Mark Completed</Button>
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
                    <h4 className="font-bold mb-2">Select Tests</h4>
                    <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                        {allTests.filter(t => t.active).map(test => (
                            <div key={test.id} className="flex items-center">
                                <input type="checkbox" id={`test-${test.id}`} checked={!!selectedTests.find(t=>t.id===test.id)} onChange={() => setSelectedTests(p => p.find(t=>t.id===test.id) ? p.filter(t=>t.id!==test.id) : [...p, test])}/>
                                <label htmlFor={`test-${test.id}`} className="ml-2">{test.name} (${test.mrp})</label>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="p-2 bg-blue-50 dark:bg-dark rounded-lg space-y-1">
                    <div className="flex justify-between"><span>Total MRP:</span> <span>${totalMrp.toFixed(2)}</span></div>
                    <div className="flex justify-between text-green-600"><span>Auto Discount (20%):</span> <span>-${autoDiscount.toFixed(2)}</span></div>
                    <Input label="Additional Discount ($)" type="number" value={additionalDiscount} onChange={e => setAdditionalDiscount(parseFloat(e.target.value) || 0)}/>
                    <div className="flex justify-between font-bold text-xl border-t pt-1 mt-1"><span>Final Amount:</span> <span>${finalAmount.toFixed(2)}</span></div>
                </div>

                 <div>
                    <h4 className="font-bold mb-2">Payment</h4>
                    <Input label="Cash Received" type="number" value={cashPaid} onChange={e => setCashPaid(parseFloat(e.target.value) || 0)} />
                    <Input label="UPI Received" type="number" value={upiPaid} onChange={e => setUpiPaid(parseFloat(e.target.value) || 0)} />
                </div>
                 <div className="p-2 bg-yellow-50 dark:bg-gray-700 rounded-lg text-center">
                    <p>Total Paid: ${totalPaid.toFixed(2)}</p>
                    <p className="text-xl font-bold text-red-600">Due Amount: ${dueAmount > 0 ? dueAmount.toFixed(2) : '0.00'}</p>
                </div>
                <Button fullWidth onClick={handleSave}>Save & Mark Collected</Button>
            </div>
        </Modal>
    )
}

// Report Upload Modal
const ReportUploadModal: React.FC<{onClose: () => void, onUpload: (file: File) => void}> = ({onClose, onUpload}) => {
    const [file, setFile] = useState<File | null>(null);
    return (
        <Modal title="Upload Report" onClose={onClose}>
            <div className="space-y-4">
                <Input type="file" accept=".pdf" onChange={e => setFile(e.target.files ? e.target.files[0] : null)}/>
                <Button fullWidth disabled={!file} onClick={() => onUpload(file!)}>Upload & Notify User</Button>
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
             {tests.map(test => (
                 <Card key={test.id} className="flex justify-between items-center">
                     <div>
                        <p className={`font-bold ${!test.active && 'line-through text-gray-400'}`}>{test.name} ({test.code})</p>
                        <p className="text-sm">${test.mrp}</p>
                     </div>
                     <Button onClick={() => setEditingTest(test)}>Edit</Button>
                 </Card>
             ))}
             <div className="fixed bottom-24 right-4">
                <Button onClick={() => setIsCreating(true)} className="rounded-full !p-4 shadow-lg"><Icon name="plus" className="w-8 h-8"/></Button>
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
            <div className="space-y-2 max-h-96 overflow-y-auto p-1">
                <Input label="Name" name="name" value={formData.name} onChange={handleChange}/>
                <Input label="Code" name="code" value={formData.code} onChange={handleChange}/>
                <Input label="MRP" name="mrp" type="number" value={formData.mrp} onChange={handleChange}/>
                <Input label="Category" name="category" value={formData.category} onChange={handleChange}/>
                <Input label="Sample Type" name="sampleType" value={formData.sampleType} onChange={handleChange}/>
                <Input label="Reference Range" name="referenceRange" value={formData.referenceRange} onChange={handleChange}/>
                <Input label="Unit" name="unit" value={formData.unit} onChange={handleChange}/>
                <div className="flex items-center"><input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="h-5 w-5"/><label className="ml-2">Active</label></div>
            </div>
            <Button fullWidth onClick={handleSubmit} className="mt-4">Save Test</Button>
        </Modal>
    )
}

const ReportManagementScreen: React.FC = () => {
    const { bookings } = useContext(AppContext);
    // This is a simplified view. In a real app, this would be more integrated.
    const bookingsNeedingReports = bookings.filter(b => b.status === 'Processing');
    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Bookings Awaiting Reports</h2>
            {bookingsNeedingReports.length > 0 ? bookingsNeedingReports.map(b => (
                <Card key={b.id}>
                    <p>{b.name} - Booking #{b.id.slice(0,6)}</p>
                </Card>
            )) : <p>No bookings are currently in processing.</p>}
        </div>
    );
};

const UserManagementScreen: React.FC = () => {
    const { users, updateUser, deleteUser } = useContext(AppContext);
    const nonAdminUsers = users.filter(u => u.role !== 'admin');
    return (
        <div className="space-y-4">
            {nonAdminUsers.map(user => (
                <Card key={user.id}>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm">{user.email}</p>
                    <div className="flex space-x-2 mt-2">
                        <Button variant="secondary" onClick={() => updateUser(user.id, {blocked: !user.blocked})}>{user.blocked ? 'Unblock' : 'Block'}</Button>
                        <Button variant="danger" onClick={() => confirm('Are you sure?') && deleteUser(user.id)}>Delete</Button>
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
        <Card className="space-y-4">
            <h2 className="text-xl font-bold">Send Notification</h2>
            <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <Input label="Message" value={message} onChange={e => setMessage(e.target.value)} />
            <select value={targetUser} onChange={e => setTargetUser(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-dark-secondary rounded-xl">
                <option value="all">All Users</option>
                {users.filter(u=>u.role==='user').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <Button fullWidth onClick={handleSend}>Send Broadcast</Button>
        </Card>
    );
};

export default AdminPanel;
