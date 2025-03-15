// src/components/ManageUsers.js

import  { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './authcontext';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { AiOutlineEye, AiOutlineSearch } from 'react-icons/ai';

const ManageUsers = () => {
  const { token, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    // Only fetch users if the user is an admin
    if (userRole === 'ADMIN') {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:4000/api/admin/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(response.data.users);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching users:', error);
          toast.error('Error fetching users');
          setLoading(false);
        }
      };

      fetchUsers();
    } else {
      setLoading(false); // Stop loading if not admin
    }
  }, [token, userRole]);

  // Determine the users to display (all or search result)
  const usersToDisplay = searchResult ? [searchResult] : users;

  const handleSearch = async () => {
    if (!searchId) {
      toast.error('Please enter a User ID to search.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/api/admin/users/${searchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResult(response.data.user);
    } catch (error) {
      console.error('Error searching user:', error);
      if (error.response && error.response.status === 404) {
        toast.error('User not found.');
      } else {
        toast.error('Error searching user');
      }
      setSearchResult(null);
    }
  };

  const resetSearch = () => {
    setSearchId('');
    setSearchResult(null);
  };

  const handleView = (userId) => {
    // Implement the view functionality
    // For now, we'll display an alert with user information
    const user = users.find((u) => u.id === userId);
    if (user) {
      alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`);
    } else {
      toast.error('User not found.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (userRole !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter User ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mr-2 w-48"
        />
        <Button onClick={handleSearch} className="flex items-center space-x-1">
          <AiOutlineSearch />
          <span>Search</span>
        </Button>
        {searchResult && (
          <Button onClick={resetSearch} variant="secondary" className="ml-2">
            Reset
          </Button>
        )}
      </div>

      {usersToDisplay.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  ID
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Name
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Email
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Role
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {usersToDisplay.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{user.id}</td>
                  <td className="py-3 px-6 text-left">{user.name}</td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-left">{user.role}</td>
                  <td className="py-3 px-6 text-left">
                    <Button
                      variant="primary"
                      onClick={() => handleView(user.id)}
                      className="flex items-center space-x-1"
                    >
                      <AiOutlineEye />
                      <span>View</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default ManageUsers;
