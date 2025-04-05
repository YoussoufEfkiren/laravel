import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";

const Products = ({ userRole }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFormData, setLoadingFormData] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchProducts();
    fetchFormData();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
      showAlert("Failed to fetch products", "error");
    }
  };

  const fetchFormData = async () => {
    try {
      setLoadingFormData(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/products/form-data",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Ensure we're setting the data in the correct format
      setCategories(response.data.categories || []);
      setSuppliers(response.data.suppliers || []);
    } catch (error) {
      console.error("Error fetching form data:", error);
      showAlert("Failed to fetch form data", "error");
    } finally {
      setLoadingFormData(false);
    }
  };
  const handleAddClick = () => {
    setShowAddModal(true);
    reset();
  };

  const handleAddProduct = async (data) => {
    try {
      console.log("Form Data:", data); // Check the form data

      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        console.log("Adding to formData:", key, data[key]); // Log the data being appended
        if (key === "image" && data[key][0]) {
          formData.append("image", data[key][0]);
        } else if (key !== "image") {
          formData.append(key, data[key]);
        }
      });

      const response = await axios.post(
        "http://localhost:8000/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Product added successfully:", response); // Log the response
      setProducts([...products, response.data]);
      setShowAddModal(false);
      reset();
      showAlert("Product added successfully", "success");
    } catch (error) {
      console.error("Error adding product:", error.response?.data); // Log the response data for more details
      showAlert("Failed to add product", "error");
    }
  };

  const handleEditProduct = async (data) => {
    console.log('Form data submitted:', data); // Log form data
    try {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        // Append all form data to FormData
        Object.keys(data).forEach((key) => {
            if (key === "image" && data[key][0]) {
                formData.append("image", data[key][0]);
            } else if (key !== "image") {
                formData.append(key, data[key]);
            }
        });

        // Log formData to see what’s being sent
        console.log('FormData before sending:', formData);

        const response = await axios.put(
            `http://localhost:8000/api/products/${selectedProduct.id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        // Update the product list with the updated product data
        const updatedProducts = products.map((product) =>
            product.id === selectedProduct.id ? response.data : product
        );
        setProducts(updatedProducts);

        setShowEditModal(false);  // Close modal after saving
        showAlert("Product updated successfully", "success");
    } catch (error) {
        console.error("Error updating product:", error.response.data);
        showAlert("Failed to update product", "error");
    }
};


  
  

  const handleDeleteProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8000/api/products/${selectedProduct.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProducts = products.filter(
        (product) => product.id !== selectedProduct.id
      );
      setProducts(updatedProducts);
      setShowDeleteModal(false);
      showAlert("Product deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      showAlert("Failed to delete product", "error");
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setValue("name", product.name);
    setValue("quantity", product.quantity);
    setValue("buy_price", product.buy_price);
    setValue("sale_price", product.sale_price);
    setValue("categorie_id", product.categorie_id.toString());
    setValue("supplier_id", product.supplier_id.toString());
    setValue("date", new Date(product.date).toISOString().split("T")[0]);
    setShowEditModal(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Alert */}
      {alert.show && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            alert.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Liste des Produits</h2>
          <p className="text-gray-600">
            Gérer tous les produits de votre inventaire
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {userRole !== "user" && (
            <button
              onClick={handleAddClick}
              className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="mr-2" size={18} />
              Ajouter
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix d'achat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix de vente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                {userRole !== "user" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.buy_price} DH
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.sale_price} DH
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.category?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.supplier?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(product.date).toLocaleDateString()}
                      </div>
                    </td>
                    {userRole !== "user" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={userRole !== "user" ? 9 : 8}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Aucun produit trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Affichage de{" "}
            <span className="font-medium">
              {indexOfFirstItem + 1} à{" "}
              {Math.min(indexOfLastItem, filteredProducts.length)}
            </span>{" "}
            sur <span className="font-medium">{filteredProducts.length}</span>{" "}
            produits
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === number
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {number}
                </button>
              )
            )}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {loadingFormData ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Ajouter un nouveau produit
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        reset();
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit(handleAddProduct)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom du produit <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("name", {
                            required: "Ce champ est requis",
                          })}
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantité <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          {...register("quantity", {
                            required: "Ce champ est requis",
                            min: {
                              value: 0,
                              message: "La quantité ne peut pas être négative",
                            },
                          })}
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.quantity
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.quantity && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.quantity.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prix d'achat (DH){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register("buy_price", {
                            required: "Ce champ est requis",
                            min: {
                              value: 0,
                              message: "Le prix ne peut pas être négatif",
                            },
                          })}
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.buy_price
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.buy_price && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.buy_price.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prix de vente (DH){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register("sale_price", {
                            required: "Ce champ est requis",
                            min: {
                              value: 0,
                              message: "Le prix ne peut pas être négatif",
                            },
                          })}
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.sale_price
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.sale_price && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.sale_price.message}
                          </p>
                        )}
                      </div>
                      {/* In Add Product Modal */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catégorie <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("categorie_id", {
                            required: "Ce champ est requis",
                          })}
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.categorie_id
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.categorie_id && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.categorie_id.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fournisseur <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("supplier_id", {
                            required: "Ce champ est requis",
                          })}
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.supplier_id
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Sélectionner un fournisseur</option>
                          {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </option>
                          ))}
                        </select>
                        {errors.supplier_id && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.supplier_id.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          {...register("date", {
                            required: "Ce champ est requis",
                          })}
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.date ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.date && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.date.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          {...register("image")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddModal(false);
                          reset();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Modifier le produit</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit(handleEditProduct)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du produit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.name} // Default value for edit
                      {...register("name", { required: "Ce champ est requis" })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      defaultValue={selectedProduct?.quantity} // Default value for edit
                      {...register("quantity", {
                        required: "Ce champ est requis",
                        min: {
                          value: 0,
                          message: "La quantité ne peut pas être négative",
                        },
                      })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.quantity ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix d'achat (DH) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={selectedProduct?.buy_price} // Default value for edit
                      {...register("buy_price", {
                        required: "Ce champ est requis",
                        min: {
                          value: 0,
                          message: "Le prix ne peut pas être négatif",
                        },
                      })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.buy_price ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.buy_price && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.buy_price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix de vente (DH) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={selectedProduct?.sale_price} // Default value for edit
                      {...register("sale_price", {
                        required: "Ce champ est requis",
                        min: {
                          value: 0,
                          message: "Le prix ne peut pas être négatif",
                        },
                      })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.sale_price ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.sale_price && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.sale_price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie <span className="text-red-500">*</span>
                    </label>
                    <select
                      defaultValue={selectedProduct?.categorie_id} // Default value for edit
                      {...register("categorie_id", {
                        required: "Ce champ est requis",
                      })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.categorie_id
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categorie_id && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.categorie_id.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fournisseur <span className="text-red-500">*</span>
                    </label>
                    <select
                      defaultValue={selectedProduct?.supplier_id} // Default value for edit
                      {...register("supplier_id", {
                        required: "Ce champ est requis",
                      })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.supplier_id
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Sélectionner un fournisseur</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                    {errors.supplier_id && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.supplier_id.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      defaultValue={selectedProduct?.date} // Default value for edit
                      {...register("date", { required: "Ce champ est requis" })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.date ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("image")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    {selectedProduct?.image_url && (
                      <div className="mt-2">
                          <p className="text-sm text-gray-500">Current image:</p>
                          <img
                              src={selectedProduct?.image_url}
                              alt="Product"
                              className="h-20 w-20 object-cover mt-1"
                          />
                      </div>
                  )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
              
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Confirmer la suppression
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <AlertTriangle className="text-red-500 mr-2" size={24} />
                  <p className="text-gray-700">
                    Êtes-vous sûr de vouloir supprimer le produit{" "}
                    <span className="font-semibold">
                      {selectedProduct?.name}
                    </span>{" "}
                    ?
                  </p>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Cette action est irréversible et supprimera définitivement le
                  produit.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <Trash2 className="mr-2" size={16} />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
