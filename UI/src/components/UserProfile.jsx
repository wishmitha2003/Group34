import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  UserIcon,
  PackageIcon,
  SettingsIcon,
  LogOutIcon,
  HeartIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function UserProfile() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (!user) return null

  // Safely get user initials for fallback avatar
  const getUserInitials = () => {
    if (user.name) return user.name.charAt(0).toUpperCase()
    if (user.username) return user.username.charAt(0).toUpperCase()
    if (user.email) return user.email.charAt(0).toUpperCase()
    return '?'
  }

  // Safely get user display name
  const getDisplayName = () => {
    return user.name || user.username || user.email || 'User'
  }

  // Safely get user email
  const getDisplayEmail = () => {
    return user.email || 'No email provided'
  }

  // Check if current path matches the menu item
  const isActivePath = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { path: '/profile', icon: UserIcon, label: 'My Profile' },
    { path: '/orders', icon: PackageIcon, label: 'Order History' },
    { path: '/wishlist', icon: HeartIcon, label: 'Wishlist' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ]

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {/* User Info Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          {user.profilePicture || user.avatar ? (
            <img
              src={user.profilePicture || user.avatar}
              alt={getDisplayName()}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          <div 
            className={`w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-medium ${
              (user.profilePicture || user.avatar) ? 'hidden' : 'flex'
            }`}
          >
            {getUserInitials()}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{getDisplayName()}</h4>
            <p className="text-sm text-gray-600">{getDisplayEmail()}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>Member since: {user.memberSince || 'Jan 2023'}</div>
          <div>Orders: {user.orders || 0}</div>
        </div>
      </div>

      {/* Menu Items - No Checkboxes */}
      <div className="py-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors duration-150 ${
              isActivePath(item.path) ? 'bg-blue-50 border-r-2 border-blue-600' : ''
            }`}
          >
            <item.icon className="h-4 w-4 mr-3 text-gray-500" />
            <span className="flex-1">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors duration-150"
        >
          <LogOutIcon className="h-4 w-4 mr-3 text-gray-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}