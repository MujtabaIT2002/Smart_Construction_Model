// src/components/ManageElectricalCosts.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './authcontext';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import { AiOutlineEdit } from 'react-icons/ai';
import ElectricalCostForm from './Adminelectricalcostform';

const ManageElectricalCosts = () => {
  const { token, userRole } = useAuth();
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCost, setEditCost] = useState(null);

  useEffect(() => {
    if (userRole === 'ADMIN') {
      const fetchCosts = async () => {
        try {
          const response = await axios.get(
            'http://localhost:4000/api/admin/electrical-costs',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCosts(response.data.costs);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching electrical costs:', error);
          toast.error('Error fetching electrical costs');
          setLoading(false);
        }
      };

      fetchCosts();
    } else {
      setLoading(false);
    }
  }, [token, userRole]);

  const handleUpdateCost = async (costData) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/admin/electrical-costs/${costData.id}`,
        costData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCosts(
        costs.map((cost) =>
          cost.id === costData.id ? response.data.electricalCost : cost
        )
      );
      toast.success('Electrical cost updated successfully');
      setEditCost(null);
    } catch (error) {
      console.error('Error updating electrical cost:', error);
      toast.error('Error updating electrical cost');
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
          <p className="text-gray-600">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Manage Electrical Costs</h1>

      {costs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  ID
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Item
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Quality
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Rate
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost) => (
                <tr
                  key={cost.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{cost.id}</td>
                  <td className="py-3 px-6 text-left">{cost.item}</td>
                  <td className="py-3 px-6 text-left">{cost.quality}</td>
                  <td className="py-3 px-6 text-left">{cost.rate}</td>
                  <td className="py-3 px-6 text-left">
                    <Button
                      variant="primary"
                      onClick={() => setEditCost(cost)}
                      className="flex items-center space-x-1"
                    >
                      <AiOutlineEdit />
                      <span>Edit</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No electrical costs found.</p>
      )}

      {/* Edit Electrical Cost Modal */}
      {editCost && (
        <Modal onClose={() => setEditCost(null)}>
          <ElectricalCostForm
            initialValues={editCost}
            onSubmit={handleUpdateCost}
            onCancel={() => setEditCost(null)}
            title="Edit Electrical Cost"
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageElectricalCosts;
