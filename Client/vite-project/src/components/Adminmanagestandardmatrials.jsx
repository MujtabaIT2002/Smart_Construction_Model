// src/components/ManageStandardMaterials.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './authcontext';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import { AiOutlineEdit } from 'react-icons/ai';
import StandardMaterialForm from './Adminstandardmaterialforms';

const ManageStandardMaterials = () => {
  const { token, userRole } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMaterial, setEditMaterial] = useState(null);

  useEffect(() => {
    if (userRole === 'ADMIN') {
      const fetchMaterials = async () => {
        try {
          const response = await axios.get('http://localhost:4000/api/admin/standard-materials', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMaterials(response.data.materials);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching materials:', error);
          toast.error('Error fetching materials');
          setLoading(false);
        }
      };

      fetchMaterials();
    } else {
      setLoading(false);
    }
  }, [token, userRole]);

  const handleUpdateMaterial = async (materialData) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/admin/standard-materials/${materialData.id}`,
        materialData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMaterials(
        materials.map((material) =>
          material.id === materialData.id ? response.data.material : material
        )
      );
      toast.success('Material updated successfully');
      setEditMaterial(null);
    } catch (error) {
      console.error('Error updating material:', error);
      toast.error('Error updating material');
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
      <h1 className="text-3xl font-bold mb-6">Manage Standard Materials</h1>

      {materials.length > 0 ? (
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
                  Rate (PKR/sqft)
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
              {materials.map((material) => (
                <tr key={material.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{material.id}</td>
                  <td className="py-3 px-6 text-left">{material.material}</td>
                  <td className="py-3 px-6 text-left">{material.rate}</td>
                  <td className="py-3 px-6 text-left">{material.quantity}</td>
                  <td className="py-3 px-6 text-left">
                    <Button
                      variant="primary"
                      onClick={() => setEditMaterial(material)}
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
        <p>No materials found.</p>
      )}

      {/* Edit Material Modal */}
      {editMaterial && (
        <Modal onClose={() => setEditMaterial(null)}>
          <StandardMaterialForm
            initialValues={editMaterial}
            onSubmit={handleUpdateMaterial}
            onCancel={() => setEditMaterial(null)}
            title="Edit Standard Material"
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageStandardMaterials;
