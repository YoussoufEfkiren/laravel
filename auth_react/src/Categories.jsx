import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  List,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

function Categories({ onBackClick, userRole }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
    action: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const showAlertMessage = (message, type, action) => {
    setAlert({
      show: true,
      message,
      type,
      action
    });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "", action: "" });
    }, 3000);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = () => {
    setIsFormModalOpen(true);
    setCurrentCategory(null);
    setFormData({
      name: '',
      description: ''
    });
  };

  const handleEdit = (category) => {
    setIsFormModalOpen(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleOpenDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      let response;

      if (currentCategory) {
        response = await axios.put(
          `http://localhost:8000/api/categories/${currentCategory.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showAlertMessage("Catégorie modifiée avec succès", "success", "update");
      } else {
        response = await axios.post(
          "http://localhost:8000/api/categories",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showAlertMessage("Catégorie ajoutée avec succès", "success", "create");
      }
      
      fetchCategories();
      setIsFormModalOpen(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Une erreur s'est produite";
      setError(errorMessage);
      showAlertMessage(errorMessage, "error", currentCategory ? "update" : "create");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/categories/${categoryToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showAlertMessage("Catégorie supprimée avec succès", "success", "delete");
      fetchCategories();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur lors de la suppression";
      showAlertMessage(errorMessage, "error", "delete");
    } finally {
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={onBackClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowLeft className="mr-2" size={16} />
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Alert Messages */}
      {alert.show && (
        <div className={`mb-4 p-4 rounded-md flex items-start ${
          alert.type === "success" 
            ? "bg-green-50 text-green-800" 
            : "bg-red-50 text-red-800"
        }`}>
          {alert.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          )}
          <div>
            <h3 className="font-medium">
              {alert.action === "create" && "Ajout de catégorie"}
              {alert.action === "update" && "Modification de catégorie"}
              {alert.action === "delete" && "Suppression de catégorie"}
            </h3>
            <p className="mt-1 text-sm">{alert.message}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={onBackClick}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold">Gestion des Catégories</h2>
        </div>
        
        {["admin", "manager"].includes(userRole) && (
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="mr-2" size={16} />
            Ajouter une catégorie
          </button>
        )}
      </div>

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {currentCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </h3>
                <button
                  onClick={handleCloseFormModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseFormModal}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        En cours...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={16} />
                        {currentCategory ? 'Mettre à jour' : 'Enregistrer'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-red-600">
                  Confirmer la suppression
                </h3>
                <button
                  onClick={handleCloseDeleteModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  Êtes-vous sûr de vouloir supprimer la catégorie <span className="font-semibold">"{categoryToDelete.name}"</span> ?
                </p>
                <p className="text-sm text-gray-500">
                  Cette action est irréversible. Tous les produits associés à cette catégorie seront également affectés.
                </p>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={handleCloseDeleteModal}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="mr-2" size={16} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <List className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune catégorie trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer une nouvelle catégorie.
            </p>
            {["admin", "manager"].includes(userRole) && (
              <div className="mt-6">
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="mr-2" size={16} />
                  Ajouter une catégorie
                </button>
              </div>
            )}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-500 max-w-xs truncate">
                      {category.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      title="Modifier"
                    >
                      <Edit size={18} />
                    </button>
                    {["admin", "manager"].includes(userRole) && (
                      <button
                        onClick={() => handleOpenDeleteModal(category)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Categories;