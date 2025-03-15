// src/components/ManageSocieties.js

import  { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './authcontext';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import Modal from '@/components/ui/Modal';
import SocietyForm from './SocietyForms';

const ManageSocieties = () => {
  const { token, userRole } = useAuth();
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSociety, setEditSociety] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    if (userRole === 'ADMIN') {
      const fetchSocieties = async () => {
        try {
          console.log('Token:', token);
          const response = await axios.get('http://localhost:4000/api/admin/societies', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSocieties(response.data.societies);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching societies:', error);
          if (error.response) {
            console.error('Response Data:', error.response.data);
          }
          toast.error('Error fetching societies');
          setLoading(false);
        }
      };

      fetchSocieties();
    } else {
      setLoading(false);
    }
  }, [token, userRole]);

  const handleSearch = async () => {
    if (!searchId) {
      toast.error('Please enter a Society ID to search.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/api/admin/societies/${searchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResult(response.data.society);
    } catch (error) {
      console.error('Error searching society:', error);
      if (error.response && error.response.status === 404) {
        toast.error('Society not found.');
      } else {
        toast.error('Error searching society');
      }
      setSearchResult(null);
    }
  };

  const resetSearch = () => {
    setSearchId('');
    setSearchResult(null);
  };

  const handleDelete = async (societyId) => {
    if (!window.confirm('Are you sure you want to delete this society?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/api/admin/societies/${societyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSocieties(societies.filter((society) => society.id !== societyId));
      if (searchResult && searchResult.id === societyId) {
        setSearchResult(null);
      }
      toast.success('Society deleted successfully');
    } catch (error) {
      console.error('Error deleting society:', error);
      toast.error('Error deleting society');
    }
  };

  const handleAddSociety = async (societyData) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/admin/societies',
        societyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSocieties([...societies, response.data.society]);
      toast.success('Society added successfully');
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding society:', error);
      toast.error('Error adding society');
    }
  };

  const handleUpdateSociety = async (societyData) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/admin/societies/${societyData.id}`,
        societyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSocieties(
        societies.map((society) =>
          society.id === societyData.id ? response.data.society : society
        )
      );
      if (searchResult && searchResult.id === societyData.id) {
        setSearchResult(response.data.society);
      }
      toast.success('Society updated successfully');
      setEditSociety(null);
    } catch (error) {
      console.error('Error updating society:', error);
      toast.error('Error updating society');
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

  // Determine the societies to display (all or search result)
  const societiesToDisplay = searchResult ? [searchResult] : societies;

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Societies</h1>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2">
          <AiOutlinePlus />
          <span>Add Society</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter Society ID"
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

      {societiesToDisplay.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  ID
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Society Name
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  City
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Latitude
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Longitude
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {societiesToDisplay.map((society) => (
                <tr key={society.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{society.id}</td>
                  <td className="py-3 px-6 text-left">{society.society}</td>
                  <td className="py-3 px-6 text-left">{society.city}</td>
                  <td className="py-3 px-6 text-left">{society.latitude}</td>
                  <td className="py-3 px-6 text-left">{society.longitude}</td>
                  <td className="py-3 px-6 text-left">
                    <div className="flex space-x-2">
                      <Button
                        variant="primary"
                        onClick={() => setEditSociety(society)}
                        className="flex items-center space-x-1"
                      >
                        <AiOutlineEdit />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(society.id)}
                        className="flex items-center space-x-1"
                      >
                        <AiOutlineDelete />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No societies found.</p>
      )}

      {/* Add Society Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <SocietyForm
            onSubmit={handleAddSociety}
            onCancel={() => setShowAddModal(false)}
            title="Add New Society"
          />
        </Modal>
      )}

      {/* Edit Society Modal */}
      {editSociety && (
        <Modal onClose={() => setEditSociety(null)}>
          <SocietyForm
            initialValues={editSociety}
            onSubmit={handleUpdateSociety}
            onCancel={() => setEditSociety(null)}
            title="Edit Society"
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageSocieties;
