// src/components/AdminDashboard.js

import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card'; // Assuming you have a Card component
import { Button } from '@/components/ui/button';
import { useAuth } from './authcontext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  // Ensure only admins can access this component
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
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Card */}
        <Card className="p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">Manage Users</h2>
          <p className="text-gray-600 mb-4 text-center">
            View user accounts.
          </p>
          <Button onClick={() => navigate('/admin/users')}>Go to Users</Button>
        </Card>

        {/* Societies Card */}
        <Card className="p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">Manage Societies</h2>
          <p className="text-gray-600 mb-4 text-center">
            Add, update, or delete societies.
          </p>
          <Button onClick={() => navigate('/admin/societies')}>Go to Societies</Button>
        </Card>

        {/* Standard Materials Card */}
        <Card className="p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">Manage Standard Materials</h2>
          <p className="text-gray-600 mb-4 text-center">
            Update rates and quantities of standard materials.
          </p>
          <Button onClick={() => navigate('/admin/standard-materials')}>Go to Standard Materials</Button>
        </Card>

        {/* Quality Materials Card */}
        <Card className="p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">Manage Quality Materials</h2>
          <p className="text-gray-600 mb-4 text-center">
            Update rates of quality materials based on quality levels.
          </p>
          <Button onClick={() => navigate('/admin/quality-materials')}>Go to Quality Materials</Button>
        </Card>

        {/* Quality Material Quantities Card */}
        <Card className="p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">Manage Material Quantities</h2>
          <p className="text-gray-600 mb-4 text-center">
            Update quantities required per square foot for materials.
          </p>
          <Button onClick={() => navigate('/admin/quality-material-quantities')}>Go to Material Quantities</Button>
        </Card>

        {/* Electrical Costs Card */}
        <Card className="p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">Manage Electrical Costs</h2>
          <p className="text-gray-600 mb-4 text-center">
            Update rates of electrical items based on quality levels.
          </p>
          <Button onClick={() => navigate('/admin/electrical-costs')}>Go to Electrical Costs</Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
