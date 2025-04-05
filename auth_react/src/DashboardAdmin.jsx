import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users,
  UserCheck,
  UserX,
  Shield,
  UserCog,
  User as RegularUser
} from "lucide-react";

function DashboardAdmin() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/statistics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Chargement des statistiques...</div>;
  }

  if (!statistics) {
    return <div className="text-center py-8">Impossible de charger les statistiques</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tableau de bord Administrateur</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Utilisateurs Totals</p>
              <p className="text-3xl font-bold mt-1">{statistics.total_users}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* Admins Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Administrateurs</p>
              <p className="text-3xl font-bold mt-1">{statistics.admin_count}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
              <Shield size={24} />
            </div>
          </div>
        </div>

        {/* Managers Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Managers</p>
              <p className="text-3xl font-bold mt-1">{statistics.manager_count}</p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <UserCog size={24} />
            </div>
          </div>
        </div>

        {/* Regular Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Utilisateurs </p>
              <p className="text-3xl font-bold mt-1">{statistics.user_count}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
              <RegularUser size={24} />
            </div>
          </div>
        </div>

       

        
      </div>
    </div>
  );
}

export default DashboardAdmin;