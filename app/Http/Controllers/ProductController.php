<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $products = Product::with(['category', 'supplier'])->get();

        // Transform data to include full image URLs
        $products->transform(function ($product) {
            if ($product->file_name) {
                $product->image_url = asset('storage/' . $product->file_name);
            }
            return $product;
        });

        return response()->json($products);
    }

    /**
     * Store a newly created product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'buy_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'categorie_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5000'
        ]);

        $productData = $request->except('image');

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $productData['file_name'] = $imagePath;
        }

        $product = Product::create($productData);
        return response()->json($product, 201);
    }

    /**
     * Display the specified product.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        // Fetch the product with related category and supplier
        $product = Product::with(['category', 'supplier'])->find($id);
    
        // Check if the product exists
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
    
        // Check if the product has an image and generate the image URL
        if ($product->file_name) {
            $product->image_url = asset('storage/' . $product->file_name);
        }
    
        // Return the product with all related information
        return response()->json($product);
    }
    

    /**
     * Update the specified product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Validate the input
        $validated = $request->validate([
            'name' => 'required|string',
            'quantity' => 'required|integer|min:0',
            'buy_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'categorie_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'image' => 'nullable|image|max:5000', // Optional image validation
        ]);
    
        // Find the product by ID
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
    
        // Update the product fields
        $product->name = $validated['name'];
        $product->quantity = $validated['quantity'];
        $product->buy_price = $validated['buy_price'];
        $product->sale_price = $validated['sale_price'];
        $product->categorie_id = $validated['categorie_id'];
        $product->supplier_id = $validated['supplier_id'];
        $product->date = $validated['date'];
    
        // Handle image upload (if there's a new image)
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->file_name = basename($path);
        }
    
        // Save the product
        $product->save();
    
        // Reload the product data with relationships
        $product->load(['category', 'supplier']);
        if ($product->file_name) {
            $product->image_url = asset('storage/' . $product->file_name);
        }
    
        return response()->json($product);
    }
    

    /**
     * Remove the specified product from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Product $product)
    {
        if ($product->file_name) {
            Storage::disk('public')->delete($product->file_name);
        }

        $product->delete();
        return response()->json(null, 204);
    }

/**
 * Get form data for product creation/editing (categories and suppliers)
 *
 * @return \Illuminate\Http\JsonResponse
 */
public function getFormData()
{
    // Retrieve categories and suppliers
    $categories = Category::all();
    $suppliers = Supplier::all();

    // Check if the data is being returned
    if($categories->isEmpty() || $suppliers->isEmpty()) {
        return response()->json(['message' => 'No categories or suppliers found'], 404);
    }

    // Log the categories and suppliers
    Log::info('Categories:', $categories->toArray());
    Log::info('Suppliers:', $suppliers->toArray());

    return response()->json([
        'categories' => $categories,
        'suppliers' => $suppliers,
    ]);
}




}
