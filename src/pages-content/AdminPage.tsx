"use client";

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Settings,
  Bell,
  Search,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  ChevronRight,
  UserPlus,
  Mail,
  Phone,
  Edit,
  Trash2,
  Award,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

export function AdminPage() {
  const [activePage, setActivePage] = useState('Dashboard');
  const { user, loading, isAdmin, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth?redirect=/admin');
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-white/60">Loading…</div>;
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] px-4">
        <div className="max-w-md text-center bg-white/5 border border-white/10 rounded-2xl p-10">
          <ShieldAlert className="text-primary mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-white mb-2">Admin access required</h1>
          <p className="text-white/60 mb-6 text-sm">
            Your account ({user.email}) doesn't have admin privileges. Ask an existing admin to grant you the role.
          </p>
          <button
            onClick={() => router.push('/client')}
            className="bg-primary text-white px-6 py-2.5 rounded-lg hover:brightness-110"
          >
            Go to client space
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: FolderOpen, label: 'Projects' },
    { icon: Users, label: 'Users' },
    { icon: Users, label: 'Employees' },
    { icon: Settings, label: 'Categories' },
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20">
      <div className="flex">
        <aside className="w-64 bg-secondary min-h-screen fixed left-0 top-20 border-r border-gray-700">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                <span className="text-white">A</span>
              </div>
              <div className="text-white">
                <div className="font-semibold">Admin Panel</div>
                <div className="text-xs text-gray-400">MIS Metal</div>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActivePage(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activePage === item.label
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <button
              onClick={async () => { await signOut(); router.push('/'); }}
              className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition"
            >
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl text-white">{activePage}</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button className="relative p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all">
                  <Bell className="text-white" size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>

            {activePage === 'Dashboard' && <DashboardContent />}
            {activePage === 'Projects' && <ProjectsContent />}
            {activePage === 'Users' && <UsersContent />}
            {activePage === 'Employees' && <EmployeesContent />}
            {activePage === 'Categories' && <CategoriesContent />}
            {activePage === 'Notifications' && <NotificationsContent />}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <>
      <SupplierBar />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-8">
        {[
          { icon: FolderOpen, label: 'Total Projects', value: '127', change: '+12%', color: 'bg-blue-500' },
          { icon: Users, label: 'Active Clients', value: '1,234', change: '+8%', color: 'bg-green-500' },
          { icon: DollarSign, label: 'Revenue', value: '$2.4M', change: '+23%', color: 'bg-primary' },
          { icon: Activity, label: 'Completion Rate', value: '94%', change: '+3%', color: 'bg-purple-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className="text-green-400 text-sm flex items-center gap-1">
                <TrendingUp size={16} />
                {stat.change}
              </span>
            </div>
            <div className="text-3xl text-white mb-2">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl text-white mb-6">Recent Projects</h2>
          <div className="space-y-4">
            {[
              { name: 'Industrial Warehouse Complex', client: 'ABC Corp', status: 'In Progress', progress: 75 },
              { name: 'Steel Frame Office Building', client: 'Tech Inc', status: 'Planning', progress: 30 },
              { name: 'Manufacturing Facility', client: 'Logistics Ltd', status: 'Completed', progress: 100 },
            ].map((project, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-400">{project.client}</p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      project.status === 'Completed'
                        ? 'bg-green-500/20 text-green-400'
                        : project.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl text-white mb-6">System Alerts</h2>
          <div className="space-y-4">
            {[
              { type: 'warning', message: 'Pending approval: 3 project quotes', time: '10 minutes ago' },
              { type: 'info', message: 'New client registration', time: '1 hour ago' },
              { type: 'error', message: 'Payment overdue: Invoice #2026-04', time: '3 hours ago' },
              { type: 'success', message: 'Project completed: Warehouse A', time: '5 hours ago' },
            ].map((alert, index) => (
              <div key={index} className="flex items-start gap-3 bg-gray-700 p-4 rounded-lg">
                <AlertCircle
                  className={`flex-shrink-0 ${
                    alert.type === 'error'
                      ? 'text-red-400'
                      : alert.type === 'warning'
                      ? 'text-yellow-400'
                      : alert.type === 'success'
                      ? 'text-green-400'
                      : 'text-blue-400'
                  }`}
                  size={20}
                />
                <div className="flex-1">
                  <p className="text-white mb-1">{alert.message}</p>
                  <p className="text-xs text-gray-400">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'New Project', icon: FolderOpen },
            { label: 'Add Client', icon: Users },
            { label: 'Generate Report', icon: Activity },
            { label: 'Send Invoice', icon: DollarSign },
          ].map((action, index) => (
            <button
              key={index}
              className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-all flex items-center gap-3 text-white"
            >
              <action.icon size={20} />
              <span>{action.label}</span>
              <ChevronRight className="ml-auto" size={20} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function ProjectsContent() {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl text-white mb-6">All Projects</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-400 pb-4">Project Name</th>
              <th className="text-left text-gray-400 pb-4">Client</th>
              <th className="text-left text-gray-400 pb-4">Status</th>
              <th className="text-left text-gray-400 pb-4">Progress</th>
              <th className="text-left text-gray-400 pb-4">Budget</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: 'Warehouse Complex',
                client: 'ABC Corp',
                status: 'In Progress',
                progress: 75,
                budget: '$450K',
              },
              {
                name: 'Steel Office Building',
                client: 'Tech Inc',
                status: 'Planning',
                progress: 30,
                budget: '$780K',
              },
              {
                name: 'Manufacturing Facility',
                client: 'Logistics Ltd',
                status: 'Completed',
                progress: 100,
                budget: '$1.2M',
              },
            ].map((project, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-4 text-white">{project.name}</td>
                <td className="py-4 text-gray-300">{project.client}</td>
                <td className="py-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      project.status === 'Completed'
                        ? 'bg-green-500/20 text-green-400'
                        : project.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="py-4 text-gray-300">{project.progress}%</td>
                <td className="py-4 text-white">{project.budget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersContent() {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl text-white mb-6">User Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'John Anderson', email: 'john@abccorp.com', role: 'Client', status: 'Active' },
          { name: 'Sarah Mitchell', email: 'sarah@techinc.com', role: 'Client', status: 'Active' },
          { name: 'David Chen', email: 'david@logistics.com', role: 'Client', status: 'Inactive' },
        ].map((user, index) => (
          <div key={index} className="bg-gray-700 p-6 rounded-lg">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl mb-4">
              {user.name[0]}
            </div>
            <h3 className="text-white mb-1">{user.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{user.email}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{user.role}</span>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesContent() {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl text-white mb-6">Project Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          'Warehouses',
          'Steel Buildings',
          'Industrial Projects',
          'Roofing Structures',
          'Staircases',
          'Custom Metal Work',
        ].map((category, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
            <span className="text-white">{category}</span>
            <button className="text-primary hover:text-primary/80 transition-colors">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsContent() {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl text-white mb-6">All Notifications</h2>
      <div className="space-y-4">
        {[
          { title: 'New project quote requested', time: '5 minutes ago', read: false },
          { title: 'Payment received from ABC Corp', time: '2 hours ago', read: false },
          { title: 'Project milestone completed', time: '1 day ago', read: true },
          { title: 'New client registration', time: '2 days ago', read: true },
        ].map((notification, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${notification.read ? 'bg-gray-700' : 'bg-gray-700 border-l-4 border-primary'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white mb-1">{notification.title}</h3>
                <p className="text-sm text-gray-400">{notification.time}</p>
              </div>
              {!notification.read && <span className="w-2 h-2 bg-primary rounded-full"></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmployeesContent() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-white">Employee Management</h2>
        <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2">
          <UserPlus size={20} />
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Employees', value: '48', color: 'bg-blue-500' },
          { label: 'Active Projects', value: '23', color: 'bg-green-500' },
          { label: 'On Leave', value: '3', color: 'bg-yellow-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <Users className="text-white" size={24} />
            </div>
            <div className="text-3xl text-white mb-2">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-xl text-white mb-6">All Employees</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Robert Martinez',
              role: 'Senior Welding Engineer',
              email: 'robert.m@mismetal.com',
              phone: '+1 (555) 234-5678',
              status: 'Active',
              projects: 5,
            },
            {
              name: 'Lisa Johnson',
              role: 'Project Manager',
              email: 'lisa.j@mismetal.com',
              phone: '+1 (555) 345-6789',
              status: 'Active',
              projects: 8,
            },
            {
              name: 'Michael Brown',
              role: 'Structural Engineer',
              email: 'michael.b@mismetal.com',
              phone: '+1 (555) 456-7890',
              status: 'Active',
              projects: 6,
            },
            {
              name: 'Sarah Wilson',
              role: 'Quality Inspector',
              email: 'sarah.w@mismetal.com',
              phone: '+1 (555) 567-8901',
              status: 'Active',
              projects: 4,
            },
            {
              name: 'James Davis',
              role: 'Fabrication Specialist',
              email: 'james.d@mismetal.com',
              phone: '+1 (555) 678-9012',
              status: 'On Leave',
              projects: 3,
            },
            {
              name: 'Emily Taylor',
              role: 'Safety Coordinator',
              email: 'emily.t@mismetal.com',
              phone: '+1 (555) 789-0123',
              status: 'Active',
              projects: 7,
            },
          ].map((employee, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl">
                  {employee.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    employee.status === 'Active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {employee.status}
                </span>
              </div>

              <h3 className="text-lg text-white mb-1">{employee.name}</h3>
              <p className="text-sm text-primary mb-4">{employee.role}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail size={14} />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone size={14} />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Award size={14} />
                  <span>{employee.projects} Active Projects</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-primary/20 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition-all flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Edit
                </button>
                <button className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

function SupplierBar() {
  const suppliers = [
    'ARCELORMITTAL STEEL',
    'NUCOR CORPORATION',
    'POSCO INTERNATIONAL',
    'TATA STEEL',
    'THYSSENKRUPP AG',
    'BAOSTEEL GROUP',
    'NIPPON STEEL',
    'HYUNDAI STEEL',
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 overflow-hidden">
      <h3 className="text-white text-sm mb-3">Our Trusted Suppliers</h3>
      <div className="relative">
        <div className="flex animate-scroll-slow">
          {[...suppliers, ...suppliers].map((supplier, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-8 whitespace-nowrap"
            >
              <span className="text-gray-400 font-semibold text-sm">{supplier}</span>
            </div>
          ))}
        </div>
      </div>
      <style>
        {`
          @keyframes scroll-slow {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll-slow {
            animation: scroll-slow 40s linear infinite;
          }
        `}
      </style>
    </div>
  );
}
