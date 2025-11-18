
import React from 'react';

// ========== ICONS ==========
const icons: { [key: string]: React.ReactNode } = {
  logo: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  home: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  user: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  file: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  location: <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />,
  spark: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l-3 3m5.657 5.657l-3-3M4.343 4.343l3 3m-3 5.657l3 3m12 .657l-3-3M21 5l-3 3M5 21v-4m-2 2h4" />,
  logout: <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
  menu: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />,
  close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  chevronRight: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />,
  chevronLeft: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />,
  mic: <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />,
  volume: <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />,
  dashboard: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  bookings: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
  flask: <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.443 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.443a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.443-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477M12 6.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />,
  chart: <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />,
  users: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197" />,
  plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
  download: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
  check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
};

interface IconProps extends React.SVGProps<SVGSVGElement> { name: string; }
export const Icon: React.FC<IconProps> = ({ name, className = "w-6 h-6", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>{icons[name] || <path />}</svg>
);

// ========== LAYOUT ==========
export const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => (<main className="w-full h-full max-w-md mx-auto bg-light dark:bg-dark text-dark-secondary dark:text-gray-200 overflow-y-auto">{children}</main>);

// ========== UI ELEMENTS ==========
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'danger'; fullWidth?: boolean; }
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth = false, className = '', ...props }) => {
  const base = 'px-6 py-3 font-bold rounded-xl text-lg transform transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = { primary: 'bg-primary text-white hover:bg-primary-dark', secondary: 'bg-secondary text-white hover:bg-blue-500', danger: 'bg-red-500 text-white hover:bg-red-600' };
  return <button className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>{children}</button>;
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; }
export const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
    <div className="w-full">
        {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
        <input id={id} className="w-full p-4 bg-gray-100 dark:bg-dark-secondary border border-gray-300 dark:border-gray-600 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary" {...props}/>
    </div>
);

export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white dark:bg-dark-secondary rounded-2xl shadow-md p-4 md:p-6 ${className} ${onClick ? 'cursor-pointer' : ''}`}>{children}</div>
);

export const Spinner: React.FC = () => (<div className="flex justify-center items-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>);

export const Modal: React.FC<{children: React.ReactNode, title: string, onClose: () => void}> = ({children, title, onClose}) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-dark-secondary rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold">{title}</h2>
                <button onClick={onClose}><Icon name="close" /></button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    </div>
);


// ========== NAVIGATION ==========
interface BottomNavProps { activeScreen: string; setActiveScreen: (screen: string) => void; }
const navItems = [
  { name: 'home', label: 'Home', icon: 'home' },
  { name: 'track', label: 'Track', icon: 'location' },
  { name: 'reports', label: 'Reports', icon: 'file' },
  { name: 'ai', label: 'AI', icon: 'spark' },
  { name: 'profile', label: 'Profile', icon: 'user' },
];
export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => (
  <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-dark-secondary border-t border-gray-200 dark:border-gray-700 shadow-lg">
    <div className="flex justify-around items-center h-20">
      {navItems.map(item => (
        <button key={item.name} onClick={() => setActiveScreen(item.name)} className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${activeScreen === item.name ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
          <Icon name={item.icon} className="w-7 h-7 mb-1" />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  </div>
);

interface SideMenuProps { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; activeScreen: string; setActiveScreen: (screen: string) => void; onLogout: () => void; }
const adminNavItems = [
    { name: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { name: 'bookings', label: 'Bookings', icon: 'bookings' },
    { name: 'tests', label: 'Test Master', icon: 'flask' },
    { name: 'reports', label: 'Report Mgmt', icon: 'file' },
    { name: 'users', label: 'Users', icon: 'users' },
    { name: 'notifications', label: 'Broadcast', icon: 'volume' },
];
export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, setIsOpen, activeScreen, setActiveScreen, onLogout }) => (
    <>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}/>
        <div className={`fixed top-0 left-0 h-full bg-white dark:bg-dark-secondary w-64 shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-primary flex items-center"><Icon name="logo" className="w-6 h-6 mr-2" />Admin Panel</h2>
                <button onClick={() => setIsOpen(false)}><Icon name="close" /></button>
            </div>
            <nav className="p-4">
                {adminNavItems.map(item => (
                    <button key={item.name} onClick={() => { setActiveScreen(item.name); setIsOpen(false); }} className={`w-full flex items-center p-3 my-1 rounded-lg text-left text-lg ${activeScreen === item.name ? 'bg-primary text-white' : 'hover:bg-light dark:hover:bg-gray-700'}`}>
                        <Icon name={item.icon} className="w-6 h-6 mr-4" />{item.label}
                    </button>
                ))}
            </nav>
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={onLogout} className="w-full flex items-center p-3 rounded-lg text-lg hover:bg-light dark:hover:bg-gray-700"><Icon name="logout" className="w-6 h-6 mr-4" />Logout</button>
            </div>
        </div>
    </>
);
