import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GererUtilisateur from "./GererUtilisateur";
import Profile from "./Profile";
import DashboardAdmin from "./DashboardAdmin";
import Categories from "./Categories";
import Suppliers from "./Suppliers";
import Products from "./Products";
import { 
  Home, 
  Users, 
  UserCircle,
  ChevronDown, 
  ChevronUp,
  Settings,
  LogOut,
  User,
  BarChart2,
  List,
  Truck,
  Box
} from "lucide-react";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDashboardData(response.data);

      if (response.data.user && response.data.user.role) {
        setUserRole(response.data.user.role);
      } else {
        const message = response.data.message || "";
        if (message.includes("Admin")) {
          setUserRole("admin");
        } else if (message.includes("Manager")) {
          setUserRole("manager");
        } else {
          setUserRole("user");
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleBackClick = () => {
    setActiveSection("home");
  };

  const handleProfileClick = () => {
    setActiveSection("profile");
    setShowProfileDropdown(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-indigo-700 text-white p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold flex items-center">
            <Settings className="mr-2" size={24} />
            Dashboard
          </h2>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveSection("home")}
                className={`flex items-center p-3 w-full rounded-lg transition-colors ${
                  activeSection === "home" 
                    ? "bg-indigo-800 text-white" 
                    : "text-indigo-100 hover:bg-indigo-600"
                }`}
              >
                {["admin", "manager"].includes(userRole) ? (
                  <>
                    <BarChart2 className="mr-3" size={18} />
                    <span>Statistiques</span>
                  </>
                ) : (
                  <>
                    <Home className="mr-3" size={18} />
                    <span>Accueil</span>
                  </>
                )}
              </button>
            </li>
            {userRole === "admin" && (
              <li>
                <button
                  onClick={() => setActiveSection("users")}
                  className={`flex items-center p-3 w-full rounded-lg transition-colors ${
                    activeSection === "users" 
                      ? "bg-indigo-800 text-white" 
                      : "text-indigo-100 hover:bg-indigo-600"
                  }`}
                >
                  <Users className="mr-3" size={18} />
                  <span>Gérer les utilisateurs</span>
                </button>
              </li>
            )}
            {["admin", "manager"].includes(userRole) && (
              <>
                <li>
                  <button
                    onClick={() => setActiveSection("categories")}
                    className={`flex items-center p-3 w-full rounded-lg transition-colors ${
                      activeSection === "categories" 
                        ? "bg-indigo-800 text-white" 
                        : "text-indigo-100 hover:bg-indigo-600"
                    }`}
                  >
                    <List className="mr-3" size={18} />
                    <span>Catégories</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("suppliers")}
                    className={`flex items-center p-3 w-full rounded-lg transition-colors ${
                      activeSection === "suppliers" 
                        ? "bg-indigo-800 text-white" 
                        : "text-indigo-100 hover:bg-indigo-600"
                    }`}
                  >
                    <Truck className="mr-3" size={18} />
                    <span>Fournisseurs</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("products")}
                    className={`flex items-center p-3 w-full rounded-lg transition-colors ${
                      activeSection === "products" 
                        ? "bg-indigo-800 text-white" 
                        : "text-indigo-100 hover:bg-indigo-600"
                    }`}
                  >
                    <Box className="mr-3" size={18} />
                    <span>Produits</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-indigo-600">
          <div className="text-indigo-200 text-sm">
            {dashboardData?.user && (
              <div className="flex items-center">
                <div className="bg-indigo-600 rounded-full p-2 mr-3">
                  <UserCircle size={16} />
                </div>
                <div>
                  <p className="font-medium">{dashboardData.user.name}</p>
                  <p className="text-xs capitalize">{userRole}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Bienvenue, <span className="text-indigo-600 capitalize">{userRole}</span> !
            </h1>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 bg-white border border-gray-200 p-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                <User size={18} />
              </div>
              {showProfileDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 divide-y divide-gray-100">
                <div className="px-4 py-3 text-sm">
                  <p className="font-medium text-gray-900">{dashboardData?.user?.name}</p>
                  <p className="text-gray-500 capitalize">{userRole}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="mr-3" size={16} />
                    <span>Mon Profil</span>
                  </button>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-3" size={16} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Alert System */}
        {alert.show && (
          <div className={`mx-6 mt-4 p-4 rounded-lg ${
            alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {alert.message}
          </div>
        )}

        {/* Main Content Router */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {activeSection === "home" && ["admin", "manager"].includes(userRole) && <DashboardAdmin />}
            {activeSection === "home" && !["admin", "manager"].includes(userRole) && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Tableau de bord</h2>
                <p>Bienvenue sur votre espace personnel.</p>
              </div>
            )}
            {activeSection === "users" && userRole === "admin" && <GererUtilisateur />}
            {activeSection === "categories" && ["admin", "manager"].includes(userRole) && (
              <Categories 
                onBackClick={handleBackClick} 
                userRole={userRole}
              />
            )}
            {activeSection === "suppliers" && ["admin", "manager"].includes(userRole) && (
              <Suppliers 
                onBackClick={handleBackClick} 
                userRole={userRole}
              />
            )}
            {activeSection === "products" && ["admin", "manager"].includes(userRole) && (
              <Products 
                onBackClick={handleBackClick} 
                userRole={userRole}
              />
            )}
            {activeSection === "profile" && (
              <Profile 
                userRole={userRole} 
                onBackClick={handleBackClick}
                showAlert={showAlert}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;