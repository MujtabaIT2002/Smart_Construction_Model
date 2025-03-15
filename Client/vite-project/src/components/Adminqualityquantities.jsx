// src/components/ManageQualityMaterialQuantities.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './authcontext';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import { AiOutlineEdit } from 'react-icons/ai';
import QualityMaterialQuantityForm from './Adminqualityquantitiesforms';

const ManageQualityMaterialQuantities = () => {
  const { token, userRole } = useAuth();
  const [quantities, setQuantities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editQuantity, setEditQuantity] = useState(null);

  useEffect(() => {
    if (userRole === 'ADMIN') {
      const fetchQuantities = async () => {
        try {
          const response = await axios.get(
            'http://localhost:4000/api/admin/quality-material-quantities',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setQuantities(response.data.quantities);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching quantities:', error);
          toast.error('Error fetching quantities');
          setLoading(false);
        }
      };

      fetchQuantities();
    } else {
      setLoading(false);
    }
  }, [token, userRole]);

  const handleUpdateQuantity = async (quantityData) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/admin/quality-material-quantities/${quantityData.id}`,
        quantityData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuantities(
        quantities.map((quantity) =>
          quantity.id === quantityData.id ? response.data.quantity : quantity
        )
      );
      toast.success('Quantity updated successfully');
      setEditQuantity(null);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Error updating quantity');
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
      <h1 className="text-3xl font-bold mb-6">Manage Material Quantities</h1>

      {quantities.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  ID
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Material
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Quantity (units/sqft)
                </th>
                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-600 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {quantities.map((quantity) => (
                <tr
                  key={quantity.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{quantity.id}</td>
                  <td className="py-3 px-6 text-left">{quantity.material}</td>
                  <td className="py-3 px-6 text-left">{quantity.quantity}</td>
                  <td className="py-3 px-6 text-left">
                    <Button
                      variant="primary"
                      onClick={() => setEditQuantity(quantity)}
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
        <p>No material quantities found.</p>
      )}

      {/* Edit Quantity Modal */}
      {editQuantity && (
        <Modal onClose={() => setEditQuantity(null)}>
          <QualityMaterialQuantityForm
            initialValues={editQuantity}
            onSubmit={handleUpdateQuantity}
            onCancel={() => setEditQuantity(null)}
            title="Edit Material Quantity"
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageQualityMaterialQuantities;
