import { useState, useEffect } from "react";
import axios from "axios";
import { 
  User, 
  Edit,
  X,
  Check,
  Lock,
  Mail,
  ArrowLeft,
  LogOut
} from "lucide-react";

function Profile({ userRole, onBackClick, showAlert }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        name: userProfile.name,
        email: userProfile.email,
        password: ""
      });
    }
  }, [userProfile]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      showAlert("Erreur lors du chargement du profil", "error");
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8000/api/user/profile",
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setUserProfile(response.data);
      setIsEditing(false);
      showAlert("Profil mis à jour avec succès", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showAlert("Erreur lors de la mise à jour du profil", "error");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-indigo-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <User className="mr-2" size={20} />
          <h2 className="text-xl font-bold text-white">Mon Profil</h2>
        </div>
        <button
          onClick={onBackClick}
          className="text-white hover:text-indigo-200 flex items-center"
        >
          <ArrowLeft className="mr-1" size={18} />
          Retour
        </button>
      </div>
      
      <div className="p-6">
        {!userProfile ? (
          <p className="text-gray-700">Chargement du profil...</p>
        ) : isEditing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nom"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe (laisser vide pour ne pas changer)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={16} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Nouveau mot de passe"
                  value={editForm.password}
                  onChange={handleEditChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <div className="p-2 bg-gray-100 rounded-md capitalize">
                {userRole}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="mr-2" size={16} />
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Check className="mr-2" size={16} />
                Enregistrer
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500">Nom</label>
              <p className="mt-1 text-gray-900 p-2 bg-gray-50 rounded">{userProfile.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-gray-900 p-2 bg-gray-50 rounded">{userProfile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Rôle</label>
              <p className="mt-1 text-gray-900 p-2 bg-gray-50 rounded capitalize">{userRole}</p>
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Edit className="mr-2" size={16} />
                Modifier
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="mr-2" size={16} />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;