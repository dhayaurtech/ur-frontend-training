
"use client";

import { useEffect, useState } from "react";
import type {
  Product,
  ProductBrand,
  ProductCategory,
} from "@/types/product";
import Select from "@/components/ui/Select";
import Option from "@/components/ui/Option";
import { X } from "lucide-react";
import { createProduct, updateProduct, uploadProductImage } from "@/lib/services/products";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/Input";

const formSchema = z.object({
  title: z.string().trim().min(1, "Name field is required"),
  category: z.string().trim().min(1, "Category field is required"),
  brand: z.string().trim().min(1, "Brand field is required"),
  description: z
    .string()
    .trim()
    .min(1, "Description field is required"),
  price: z
    .string()
    .trim()
    .min(1, "Price field is required")
    .refine(
      (value) =>
        Number.isFinite(Number(value)) && Number(value) > 0,
      "Price should be a positive number"
    )
    .transform(Number),
  stock: z
    .string()
    .trim()
    .min(1, "Stock field is required")
    .refine(
      (value) =>
        Number.isInteger(Number(value)) && Number(value) >= 0,
      "Stock must be a non-negative integer"
    )
    .transform(Number),
  images: z
  .unknown()
  .transform((value) => {
    if (value instanceof FileList) {
      return Array.from(value);
    }

    return Array.isArray(value) ? value : [];
  })
  .pipe(
    z.array(
      z
        .file()
        .max(5 * 1024 * 1024, "Each image must be 5 MB or smaller")
        .mime(
          ["image/jpeg", "image/png", "image/webp"],
          "Only JPG, PNG, and WebP images are allowed"
        )
    )
  ),
});


type ProductFormProps = {
  products: Product[];
  mode: "add" | "edit";
  productId?: string;
};

type ProductFormInput = z.input<typeof formSchema>;
type ProductFormOutput = z.output<typeof formSchema>;

const ProductForm = ({
  products,
  mode,
  productId,
}: ProductFormProps) => {
  const router = useRouter();
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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [error,setError] = useState("");

  const {register, handleSubmit, setValue, formState:{errors, isSubmitting}} = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver:zodResolver(formSchema),
    mode:'onTouched',
    defaultValues:{
      title:product?.title ?? "",
      category:product?.category ?? "",
      brand:product?.brand ?? "",
      description:product?.description ?? "",
      price:String(product?.price ?? ""),
      stock:String(product?.stock ?? ""),
      images:[]
    }
  })
  const imagesRegistration = register("images");
     const removeImage = (idx:number) => {
      const updatedImages = selectedImages.filter((_,imageIndex) => imageIndex!==idx);
      setSelectedImages(updatedImages);
      setValue("images",updatedImages,{shouldValidate:true,shouldTouch:true})
     }
      const onSubmit = async (data:ProductFormOutput) => {
        console.log("Form images:", data.images);
console.log("Selected images:", selectedImages);
        const uploadedImages = await Promise.all(
          data.images.map((file) => uploadProductImage(file))
        )

console.log("Uploaded image URLs:", uploadedImages);
        console.log("Uploaded image URLs:", uploadedImages);
        const submittedProduct = {
          title:data.title,
          category:data.category,
          brand:data.brand,
          description:data.description,
          price:data.price,
          stock:data.stock,
          images:[...existingImages,...uploadedImages]
        };

        const newImages = data.images;
        console.log("Product data:", submittedProduct);
        console.log("New image files:", newImages); 

        try {
          if(mode === "add"){
            await createProduct(submittedProduct);
          }else if(productId){
            await updateProduct(Number(productId),submittedProduct);
          }
          router.push("/products");
          router.refresh();
        } catch (error) {

  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError("Something went wrong while saving the product.");
  }
}

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
      {error && <div className="bg-red-500 border-4 border-red-600 text-white p-2 my-5 rounded-2xl flex justify-between shadow-2xl shadow-zinc-500">{error} <X className="cursor-pointer hover:zoom-90" onClick={() => setError("")}/></div>}
      <form
        onSubmit={handleSubmit(onSubmit)}
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
              <Input id="title" {...register('title')} placeholder="Enter product name"/>
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
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
               {...register('category')}
               name='category'
              >
                {mode === "add" && <Option value="">Select Category</Option>}
                {categories.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
              {errors.category && <p className="text-red-500 font-mono">{errors.category.message}</p>}
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
                {...register('brand')}
                name="brand"
              >
                { mode === "add" && <Option value="">Select Brand</Option>}
                {brands.map((brnd, index) => (
                  <Option key={index} value={brnd}>
                    {brnd !== undefined ? brnd : "Others"}
                  </Option>
                ))}
              </Select>
              {errors.brand && <p className="text-red-500 font-mono">{errors.brand.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea id='description' {...register('description')} placeholder="Describe the product" rows={4} className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"/>
              {errors.description && <p className="text-red-500 font-mono">{errors.description.message}</p>}
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
              <Input id='price' {...register('price')} placeholder="0.00"/>
              {errors.price && <p className="text-red-500 font-mono">{errors.price.message}</p>}
             
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Quantity
              </label>
              
              <Input id='stock' {...register('stock')} placeholder="0.00"/>
              {errors.stock && <p className="text-red-500 font-mono">{errors.stock.message}</p>}
              
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
  type="file"
  name={imagesRegistration.name}
  ref={imagesRegistration.ref}
  onBlur={imagesRegistration.onBlur}
  accept="image/jpeg,image/png,image/webp"
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files ?? []);

    setSelectedImages(files);

    imagesRegistration.onChange(e);
  }}
/>
            
            <div className="mt-4 flex flex-wrap gap-4">
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="h-24 w-24">
                  <img src={url} alt={`Existing product image ${index+1}`} className="h-full w-full rounded-lg object-cover" />
                </div>
                
              ))}
                {selectedImages.map((file, index) => (
                  <div className="relative flex flex-col items-center h-24 w-24" key={`${file.name}-${index}`}>
                    <img
                     src={URL.createObjectURL(file)}
                     alt={file.name}
                      className="h-full w-full rounded-lg object-cover border-4 p-2"
                    />
                    <button type="button" onClick={() => removeImage(index)} className="text-red-500 rounded-full absolute  -top-2 -right-2 hover:bg-red-400 hover:text-white">
                      <X className="size-4"/>
                    </button>
                  </div>
                 ))} 
            </div>
          </div>
          {errors.images && <p className="text-red-500">{errors.images.message}</p>}
          {/* {imagesError && <p className="text-red-500">{imagesError}</p>} */}
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

          <button
            type="submit" disabled={isSubmitting}
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
