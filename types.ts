
export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: Role;
  phone?: string;
  address?: string;
  age?: number;
  blocked?: boolean;
}

export interface Test {
  id: string;
  name: string;
  code: string;
  mrp: number;
  category: string;
  sampleType: string;
  referenceRange: string;
  unit: string;
  active: boolean;
}

export type SampleStatus = 'Pending' | 'Assigned' | 'On Way' | 'Collected' | 'In Lab' | 'Processing' | 'Report Ready' | 'Completed' | 'Rejected';

export type PaymentStatus = 'Pending' | 'Partially Paid' | 'Fully Paid';
export type PaymentMethod = 'Cash' | 'UPI' | 'Online' | 'Split';

export interface Payment {
    id: string;
    bookingId: string;
    amount: number;
    method: 'Cash' | 'UPI' | 'Online';
    date: string;
}

export interface Booking {
  id: string;
  userId: string;
  // Patient info
  name: string;
  age: number;
  phone: string;
  address: string;
  live_location_lat?: number;
  live_location_long?: number;
  symptoms?: string;
  preferredTimeSlot?: string;
  notes?: string;
  
  // Test and payment info
  tests: Test[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  discount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  
  // Tracking
  bookingDate: string;
  status: SampleStatus;
}

export interface Report {
  id: string;
  bookingId: string;
  userId: string;
  pdfUrl: string; // Mock URL
  generatedDate: string;
  aiSummarySimple?: string;
  aiSummaryTechnical?: string;
  mockContent: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    userId?: 'all' | string; // 'all' for broadcast, or a specific userId
}

// APP CONTEXT INTERFACE
export interface IAppContext {
  user: User | null;
  users: User[];
  tests: Test[];
  bookings: Booking[];
  reports: Report[];
  notifications: Notification[];
  handlePasswordReset: (email: string, newPass: string) => boolean;
  updateBookingStatus: (bookingId: string, status: SampleStatus) => void;
  createBooking: (newBooking: Omit<Booking, 'id' | 'bookingDate' | 'status'>) => void;
  updateBookingDetails: (bookingId: string, updatedDetails: Partial<Booking>) => void;
  markNotificationsAsRead: (userId: string) => void;
  sendNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  addReport: (report: Omit<Report, 'id'>) => void;
  updateUser: (userId: string, updatedDetails: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addTest: (test: Omit<Test, 'id'>) => void;
  updateTest: (testId: string, updatedDetails: Partial<Test>) => void;
  updateUserProfile: (userId: string, profileData: Partial<Pick<User, 'name' | 'phone' | 'address' | 'age'>>) => void;
}
