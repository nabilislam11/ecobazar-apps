import { Bell, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function adminHeader() {
    const { admin, logout } = useAdminAuth();
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 lg:px-8">
            <button className="lg:hidden" aria-label="Menu"><Menu size={22} /></button>
            <div className="ml-auto flex items-center gap-5">
                <button aria-label="Notifications" className="relative text-gray-500" onClick={() => navigate('/admin/notifications')}>
                    <Bell size={20} />
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-error" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10 text-small font-semibold text-success-dark">
                        {admin?.name?.charAt(0) ?? 'A'}
                    </div>
                    <span className="hidden text-small text-gray-700 sm:inline">{admin?.email}</span>
                </div>
                <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="flex items-center gap-1 text-small text-gray-500 hover:text-error"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </header>
    );
}
