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
  AlertCircle,
  Truck
} from "lucide-react";

function Suppliers({ onBackClick, userRole }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
    action: ""
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/suppliers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuppliers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openCreateModal = () => {
    setIsModalOpen(true);
    setCurrentSupplier(null);
    setFormData({
      name: '',
      email: '',
      contact: '',
      address: ''
    });
  };

  const openEditModal = (supplier) => {
    setIsModalOpen(true);
    setCurrentSupplier(supplier);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      contact: supplier.contact || '',
      address: supplier.address || ''
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = (supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSupplierToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      let response;

      if (currentSupplier) {
        response = await axios.put(
          `http://localhost:8000/api/suppliers/${currentSupplier.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showAlertMessage("Fournisseur modifié avec succès", "success", "update");
      } else {
        response = await axios.post(
          "http://localhost:8000/api/suppliers",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showAlertMessage("Fournisseur ajouté avec succès", "success", "create");
      }
      
      fetchSuppliers();
      closeModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Une erreur s'est produite";
      showAlertMessage(errorMessage, "error", currentSupplier ? "update" : "create");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/suppliers/${supplierToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showAlertMessage("Fournisseur supprimé avec succès", "success", "delete");
      fetchSuppliers();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur lors de la suppression";
      showAlertMessage(errorMessage, "error", "delete");
    } finally {
      closeDeleteModal();
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
              {alert.action === "create" && "Ajout de fournisseur"}
              {alert.action === "update" && "Modification de fournisseur"}
              {alert.action === "delete" && "Suppression de fournisseur"}
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
          <h2 className="text-xl font-semibold">Gestion des Fournisseurs</h2>
        </div>
        
        {["admin", "manager"].includes(userRole) && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="mr-2" size={16} />
            Ajouter un fournisseur
          </button>
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {currentSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
                </h3>
                <button
                  onClick={closeModal}
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
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
                        {currentSupplier ? 'Mettre à jour' : 'Enregistrer'}
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
      {isDeleteModalOpen && supplierToDelete && (
        <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-red-600">
                  Confirmer la suppression
                </h3>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  Êtes-vous sûr de vouloir supprimer le fournisseur <span className="font-semibold">"{supplierToDelete.name}"</span> ?
                </p>
                <p className="text-sm text-gray-500">
                  Cette action est irréversible. Tous les produits associés à ce fournisseur seront également affectés.
                </p>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={closeDeleteModal}
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
        {suppliers.length === 0 ? (
          <div className="text-center py-8">
            <Truck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun fournisseur trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par ajouter un nouveau fournisseur.
            </p>
            {["admin", "manager"].includes(userRole) && (
              <div className="mt-6">
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="mr-2" size={16} />
                  Ajouter un fournisseur
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
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{supplier.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-500">{supplier.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-500">{supplier.contact || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(supplier)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      title="Modifier"
                    >
                      <Edit size={18} />
                    </button>
                    {["admin", "manager"].includes(userRole) && (
                      <button
                        onClick={() => openDeleteModal(supplier)}
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

export default Suppliers;