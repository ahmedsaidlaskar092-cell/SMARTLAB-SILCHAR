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
  whatsapp: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12C2 13.84 2.5 15.55 3.36 17L2 22L7.21 20.69C8.62 21.53 10.26 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.56 15.95C17.32 16.63 16.16 17.21 15.64 17.27C15.26 17.32 14.76 17.37 12.91 16.61C10.55 15.63 9 13.16 8.88 13.01C8.77 12.86 7.93 11.74 7.93 10.59C7.93 9.44 8.51 8.88 8.74 8.64C8.93 8.43 9.16 8.4 9.36 8.4C9.55 8.4 9.74 8.41 9.9 8.41C10.07 8.41 10.28 8.34 10.52 8.92C10.79 9.58 11.45 11.2 11.53 11.37C11.62 11.53 11.7 11.75 11.58 11.97C11.47 12.19 11.36 12.29 11.18 12.5C11 12.71 10.8 12.85 10.62 13.07C10.45 13.28 10.26 13.5 10.47 13.87C10.68 14.23 11.41 15.42 12.48 16.38C13.87 17.61 14.99 18.01 15.38 18.18C15.66 18.3 15.95 18.26 16.19 18C16.49 17.67 16.86 17.15 17.12 16.78C17.35 16.46 17.63 16.5 17.9 16.61C18.18 16.71 19.64 17.43 19.94 17.58C20.24 17.73 20.46 17.81 20.53 17.93C20.61 18.06 20.61 18.69 17.56 15.95Z" />,
};

interface IconProps extends React.SVGProps<SVGSVGElement> { name: string; }
export const Icon: React.FC<IconProps> = ({ name, className = "w-6 h-6", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>{icons[name] || <path />}</svg>
);

// ========== LAYOUT ==========
export const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => (<main className="w-full h-full max-w-md mx-auto bg-light dark:bg-dark text-text-main dark:text-gray-200 overflow-y-auto overflow-x-hidden animate-fadeIn relative">{children}</main>);

// ========== UI ELEMENTS ==========
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'danger' | 'outline'; fullWidth?: boolean; }
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth = false, className = '', ...props }) => {
  const base = 'px-6 py-3.5 font-bold rounded-2xl text-base transform transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark flex items-center justify-center tracking-wide';
  const variants = { 
      primary: 'bg-gradient-to-r from-primary to-primary-light text-white shadow-xl shadow-primary/40 hover:shadow-2xl hover:shadow-primary/50 border-none', 
      secondary: 'bg-white text-primary hover:bg-gray-50 shadow-md border border-gray-100 dark:bg-dark-secondary dark:border-gray-700 dark:text-white', 
      danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-red-500/30 border-none',
      outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10'
    };
  return <button className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>{children}</button>;
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; }
export const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => (
    <div className="w-full">
        {label && <label htmlFor={id} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">{label}</label>}
        <input id={id} className={`w-full p-4 bg-white dark:bg-dark-secondary border border-gray-200 dark:border-gray-700 rounded-2xl text-base transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm text-gray-900 dark:text-white font-medium placeholder:text-gray-400 ${className}`} {...props}/>
    </div>
);

export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void, style?: React.CSSProperties }> = ({ children, className = '', onClick, style }) => (
  <div onClick={onClick} style={style} className={`bg-white dark:bg-dark-secondary rounded-3xl shadow-card p-6 ${className} ${onClick ? 'cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 active:scale-95' : ''}`}>{children}</div>
);

export const Spinner: React.FC = () => (<div className="flex justify-center items-center p-2"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div></div>);

export const Modal: React.FC<{children: React.ReactNode, title: string, onClose: () => void}> = ({children, title, onClose}) => (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white dark:bg-dark-secondary rounded-3xl shadow-2xl w-full max-w-md animate-scaleIn overflow-hidden ring-1 ring-black/5">
            <div className="p-5 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-secondary">
                <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{title}</h2>
                <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 transition-colors"><Icon name="close" className="text-gray-600 dark:text-white" /></button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
    </div>
);


// ========== NAVIGATION ==========
interface BottomNavProps { activeScreen: string; setActiveScreen: (screen: string) => void; }
const navItems = [
  { name: 'home', label: 'Home', icon: 'home' },
  { name: 'track', label: 'Track', icon: 'location' },
  { name: 'reports', label: 'Reports', icon: 'file' },
  { name: 'ai', label: 'Health AI', icon: 'spark' },
  { name: 'profile', label: 'Profile', icon: 'user' },
];
export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => (
  <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-2xl dark:bg-dark-secondary/95 border-t border-gray-100 dark:border-gray-800 shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.1)] z-40 rounded-t-[32px]">
    <div className="flex justify-around items-center h-20 px-2">
      {navItems.map(item => {
          const isActive = activeScreen === item.name;
          return (
            <button key={item.name} onClick={() => setActiveScreen(item.name)} className={`flex flex-col items-center justify-center w-full transition-all duration-300 relative ${isActive ? '-translate-y-3' : 'text-gray-400 hover:text-gray-600'}`}>
              <div className={`p-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/40 text-white scale-110 ring-4 ring-white dark:ring-dark' : 'bg-transparent'}`}>
                <Icon name={item.icon} className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              </div>
              <span className={`text-[11px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 text-primary translate-y-1' : 'opacity-0 translate-y-2 h-0 overflow-hidden'}`}>{item.label}</span>
            </button>
          )
      })}
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
        <div className={`fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}/>
        <div className={`fixed top-0 left-0 h-full bg-white dark:bg-dark-secondary w-80 shadow-2xl z-50 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-8 flex justify-between items-center bg-gradient-to-br from-primary to-secondary text-white rounded-br-[40px]">
                <div>
                    <h2 className="text-3xl font-extrabold flex items-center tracking-tight"><Icon name="logo" className="w-8 h-8 mr-2" />SmartLab</h2>
                    <p className="text-white/70 text-sm ml-10 font-medium">Admin Panel</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white bg-white/20 rounded-full p-1"><Icon name="close" /></button>
            </div>
            <nav className="p-6 space-y-3 mt-2">
                {adminNavItems.map(item => (
                    <button key={item.name} onClick={() => { setActiveScreen(item.name); setIsOpen(false); }} className={`w-full flex items-center p-4 rounded-2xl text-left font-bold transition-all duration-200 ${activeScreen === item.name ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/30 translate-x-2' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <div className={`mr-4 p-2 rounded-xl ${activeScreen === item.name ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                           <Icon name={item.icon} className="w-5 h-5" />
                        </div>
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="absolute bottom-0 w-full p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-secondary">
                <button onClick={onLogout} className="w-full flex items-center justify-center p-4 rounded-2xl text-white bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg hover:shadow-red-500/30 font-bold transition-all"><Icon name="logout" className="w-5 h-5 mr-2" />Logout System</button>
            </div>
        </div>
    </>
);