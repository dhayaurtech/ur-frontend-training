"use client";

import { useState } from "react";
import type {
  Product,
  ProductBrand,
  ProductCategory,
} from "@/types/product";
import Select from "@/components/ui/Select";
import Option from "@/components/ui/Option";
import { X } from "lucide-react";

type ProductFormProps = {
  products: Product[];
  mode: "add" | "edit";
  productId?: string;
};

type ProductFormData = {
  title: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  brand: string;
  images: File[];
};

const ProductForm = ({
  products,
  mode,
  productId,
}: ProductFormProps) => {
  const product =
    mode === "edit"
      ? products.find((prod) => prod.id === Number(productId))
      : undefined;

  const categories: ProductCategory[] = [
    ...new Set(products.map((prod) => prod.category)),
  ];

  const brands: ProductBrand[] = [
    ...new Set(products.map((prod) => prod.brand)),
  ];

  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images ?? []
  );

  const [formData, setFormData] = useState<ProductFormData>({
    title: product?.title ?? "",
    category: product?.category ?? "",
    description: product?.description ?? "",
    price: String(product?.price ?? ""),
    stock: String(product?.stock ?? ""),
    brand: product?.brand ?? "",
    images: [],
  });

      const [titleError , setTitleError] = useState<string>("");
      const [categoryError , setCategoryError] = useState<string>("");
      const [descriptionError , setDescriptionError] = useState<string>("");
      const [priceError , setPriceError] = useState<string>("");
      const [stockError, setStockError] = useState<string>("");
      const [brandError, setBrandError] = useState<string>("");
      const [imagesError, setImagesError] = useState<string>("");

      const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
          ...prev,[name]:value
        }))
      }

      const removeImage = (index:number) => {
        setFormData((prev) => ({
          ...prev,
          images:prev.images.filter((_,idx) => idx !== index)
        }))
      }

      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const titleErr = formData.title.trim() === "" ? "Name field is required" : "";
        const categoryErr = formData.category.trim() === "" ? "Category field is required" : "";
        const brandErr = formData.brand.trim() === "" ? "Brand field is required" : "";
        const descriptionErr = formData.description.trim() === "" ? "Description field is required" : "";
        const priceErr = formData.price.trim() === "" ? "Price field is required" : (Number(formData.price) < 0) ? "Price should be a positive value" : ""
        const stockErr = formData.stock.trim() === "" ? "Stock field is required" : (Number.isInteger(Number(formData.stock)) && Number(formData.stock) > 0) ? "" : "Stock should be natural number";
        const imgErr = existingImages.length + formData.images.length === 0 ? "Atleast one image should be added" : "";

        setTitleError(titleErr);
        setCategoryError(categoryErr);
        setBrandError(brandErr);
        setDescriptionError(descriptionErr);
        setPriceError(priceErr);
        setStockError(stockErr);
        setImagesError(imgErr);

        const hasError = [titleErr, categoryErr, brandErr, descriptionErr, priceErr, stockErr, imgErr].some((error) => error!=="")

        if(hasError) return;
    
        const submittedProduct = {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          existingImages
        };
    
        mode === "add" ? console.log("New Product : ",{...submittedProduct}) : console.log("Edit Product : ",{...submittedProduct,productId:productId})
        setFormData({
          title: submittedProduct.title,
          category: submittedProduct.category,
          description: submittedProduct.description,
          price: String(submittedProduct.price),
          stock: String(submittedProduct.stock),
          brand: submittedProduct.brand,
          images: submittedProduct.images,
        })

      };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-violet-600">Inventory</p>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {mode === "add" ? "Add product" : "Edit product"}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {mode === "add" ? "Add the product in your store inventory." : "Edit the product in your store inventory."}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
      >
        {/* Basic information */}
        <section className="space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-semibold text-gray-900">
              Basic Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {mode === "add" ? "Add the product name, category, and description" : "Edit the product name, category, and description."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Product name */}
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
              {titleError && <p className="text-red-500">{titleError}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <Select
                value={formData.category}
                onChange={handleChange}
                name="category"
              >
                {mode === "add" && <Option value="">Select Category</Option>}
                {categories.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
              {categoryError && <p className="text-red-500">{categoryError}</p>}
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700"
              >
                Brand
              </label>

              <Select
                value={formData.brand}
                onChange={handleChange}
                name="brand"
              >
                { mode === "add" && <Option value="">Select Brand</Option>}
                {brands.map((brnd, index) => (
                  <Option key={index} value={brnd}>
                    {brnd !== undefined ? brnd : "Others"}
                  </Option>
                ))}
              </Select>
              {brandError && <p className="text-red-500">{brandError}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the product..."
                className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
              {descriptionError && (
                <p className="text-red-500">{descriptionError}</p>
              )}
            </div>
          </div>
        </section>

        {/* Pricing and inventory */}
        <section className="space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-semibold text-gray-900">
              Pricing & Inventory
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Set the selling price and available stock.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Price */}
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price (₹)
              </label>

              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
              {priceError && <p className="text-red-500">{priceError}</p>}
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Quantity
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
              {stockError && <p className="text-red-500">{stockError}</p>}
            </div>
          </div>
        </section>

        {/* Product images */}
        <section className="space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-semibold text-gray-900">
              Product Images
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose one or more product images.
            </p>
          </div>

          <div>
            <label
              htmlFor="images"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-8 text-center transition hover:border-violet-400 hover:bg-violet-50/50"
            >
              <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 16V4" />
                  <path d="m7 9 5-5 5 5" />
                  <path d="M20 16.5v2A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-2" />
                </svg>
              </span>

              <span className="text-sm font-semibold text-gray-800">
                Click to upload images
              </span>
              <span className="mt-1 text-xs text-gray-500">
                Select image files from your device
              </span>
            </label>

            <input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>{
                const newFiles = Array.from(e.target.files ?? []);
                setFormData((prev) => ({
                  ...prev,
                  images: [...prev.images,...newFiles],
                }))
                e.target.value = ""
              }
              }
              className="sr-only"
            />
            <div className="mt-4 flex flex-wrap gap-4">
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="h-24 w-24">
                  <img src={url} alt={`Existing product image ${index+1}`} className="h-full w-full rounded-lg object-cover" />
                </div>
                
              ))}
                {formData.images.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="relative flex flex-col items-center h-24 w-24">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-full w-full rounded-lg object-cover border-4 p-2"
                    />
                    <button type="button" onClick={() => removeImage(index)} aria-label={`Remove ${file.name}`} className="text-red-500 rounded-full absolute  -top-2 -right-2 hover:bg-red-400 hover:text-white">
                      <X className="size-4"/>
                    </button>
                  </div>
                ))}
            </div>
          </div>
          {imagesError && <p className="text-red-500">{imagesError}</p>}
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              setFormData({
                title: "",
                category: "",
                description: "",
                price: "",
                stock: "",
                brand: "",
                images: [],
              })
            }
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Reset
          </button>

          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
          >
            {mode === "add" ? "Add Product" : "Edit Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
