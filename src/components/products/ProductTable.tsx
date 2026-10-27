"use client"
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import DataTable from '../ui/data-table/DataTable';
import Button from '../ui/Button';
import { Product } from '@/types/product';
import Link from 'next/link';
import { Column } from '../ui/data-table/data-table.types';
import { CircleCheck, ImageIcon, MoveDown } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { deleteProduct } from '@/lib/services/products';
import Card from '../ui/Card';
import Select from '../ui/Select';
import Option from '../ui/Option';

type productTableProps = {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    sort: string;
}

const ProductTable = ({products, total, page, limit, sort}:productTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentProducts, setCurrentProducts] = useState(products);
  const [showModal, setShowModal] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectId, setSelectId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const values = [5,10,20,50,100];
  const totalPages = Math.ceil(total/limit);


  const updateQuery = (updates:Record<string,string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key,value]) => {
      params.set(key,value);
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSort = (accessor:"title" | "price") => {
    const [currentField, currentDirection] = sort.split('-');

    const direction = currentField === accessor && currentDirection === "ascending" ? "descending" : "ascending";

    updateQuery({sort:`${accessor}-${direction}`,page:"1"});
  }


const handleSelectedDelete = async() => {
  if(selectedProduct.length === 0) return;
  setIsDeleting(true);
  try {
    const selectedIds = selectedProduct.map((prod) => prod.id);

    await Promise.all(selectedIds.map((id) => deleteProduct(id)));

    setCurrentProducts((prevProducts) => prevProducts.filter((prod) => !selectedIds.includes(prod.id)));
    
    setSelectedProduct([]);
    setShowSelectionModal(false);

    router.refresh();
    setShowToast(true);
  } catch (error) {
    console.error("Failed to delete selected products : ",error);
  }finally{
    setIsDeleting(false);
  }
}

  const handleDelete = async() => {
    if(selectId===null) return;
    setIsDeleting(true);
    try {
      await deleteProduct(selectId);
  
      setCurrentProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== selectId)
      );

      setSelectedProduct([]);
      setShowModal(false);
      setSelectId(null);

      router.refresh();
      setShowToast(true);
    
    } catch (error) {
      console.error("Failed to delete product : ",error);
    }finally{
      setIsDeleting(false);
    }
  }

  useEffect(() => {
  const [field, direction] = sort.split("-");

  const sortedProducts = [...products].sort((a, b) => {
    const comparison =
      field === "price"
        ? a.price - b.price
        : a.title.localeCompare(b.title);

    return direction === "ascending" ? comparison : -comparison;
  });

  setCurrentProducts(sortedProducts);
  setSelectedProduct([]);
}, [products,page,limit,sort]);


  const productColumns:Column<Product>[] = [
    {
    header:"Product",
    accessor:"title",
    sortable:true,
    sort:() => handleSort("title"),
    sortDirection:sort.startsWith("title-") ? (sort.endsWith("ascending") ? "asc" : "desc") : null,
    selectable:true,
    cell:(prod) => (
        <Link href={`/products/${prod.id}`}>
            <div className="flex items-center gap-3">
                      {prod.thumbnail ? (
                        <img
                          src={prod.thumbnail}
                          alt={prod.title}
                          className="h-11 w-11 shrink-0 rounded-lg border border-gray-100 bg-gray-50 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}

                      <span className="max-w-55 truncate font-medium text-gray-800">
                        {prod.title}
                      </span>
                    </div>
        </Link>
                    ),

  },
  {
    header:"Category",
    accessor:"category",
    sortable:false,
    sort:() => "",
    sortDirection:null,
    selectable:false,
    cell:(prod) => (<span className="inline-flex rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold font-mono text-violet-600">
                      {prod.category}
                    </span>)
  },
  {
    header:"Price",
    accessor:'price',
    sortable:true,
    sort:() => handleSort("price"),
    sortDirection:sort.startsWith("price-") ? (sort.endsWith("ascending") ? "asc" : "desc") : null,
    selectable:false,
    cell:(prod) => (<span className="text-right font-semibold tabular-nums text-gray-900">{formatPrice(prod.price)}</span>)
  },
  {
    header:"Actions",
    accessor:'id',
    sortable:false,
    sort:() => "",
    sortDirection:null,
    selectable:false,
    cell:(prod) => (
      <div className="flex gap-1 font-semibold tabular-nums text-gray-900">
      <Link href={`/products/edit/${prod.id}`}>
        <Button variant="primary" size="sm">Edit</Button>
      </Link>
      <Button variant="danger" size="sm" onClick={() => {setSelectId(prod.id);setShowModal(true);}}>Delete</Button>
      </div>
    )
  }
 ]
  
  return (
    <Card className="overflow-hidden border border-gray-200 bg-white p-0 shadow-sm">
        <Button variant='danger' onClick={() => {setShowSelectionModal(true)}} disabled={selectedProduct.length === 0 || isDeleting}>Delete {selectedProduct.length} products</Button>
        <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          {total} products
        </span>
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Products
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your inventory and product details.
                </p>
            </div>
    
        </div>
        <div className="overflow-x-auto ">
            <DataTable rows={currentProducts} columns={productColumns} selectedRows={selectedProduct} onSelectionChange={setSelectedProduct}/>
            <div className="flex flex-col gap-4 border-t items-center border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className='text-sm text-gray-500'>
                Showing {total === 0 ? 0 : (page-1)*limit+1}{"-"}{Math.min(page*limit,total)} of {total}
              </p>
              <div className='flex items-center gap-2'>
                <label htmlFor="page-range" className='whitespace-nowrap text-sm text-gray-600'>Rows per page</label>
                <Select id="page-range" value={limit} onChange={(e) => updateQuery({limit:e.target.value,page:"1"})}>
                  {values.map((val) => (
                    <Option key={val} value={val}>{val}</Option>
                  ))}
                </Select>
              </div>
              <div className='flex gap-3 items-center'>
                <Button variant="primary" onClick={() => updateQuery({page:String(page-1)})} disabled={page<=1 || totalPages === 0}>Prev</Button>
                <span className="whitespace-nowrap text-violet-500">Page {total === 0 ? 0 : page} of {totalPages}</span>
                <Button variant="primary" onClick={() => updateQuery({page:String(page+1)})} disabled={page>= totalPages || totalPages === 0}>Next</Button>
              </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-xl">
                        <p className="text-lg font-semibold text-gray-900">
                        Are you sure? 
                        </p>
                        <p className="text-center text-gray-600">
                        Do you want to delete this product?
                        </p>
                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={()=> setShowModal(false)}>Cancel</Button>
                            <Button variant="danger" onClick={handleDelete}>Confirm</Button>
                        </div>
                    </div>
                </div>
            )}
            {showSelectionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-xl">
                        <p className="text-lg font-semibold text-gray-900">
                        Are you sure? 
                        </p>
                        <p className="text-center text-gray-600">
                        Do you want to delete this product?
                        </p>
                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={()=> setShowSelectionModal(false)}>Cancel</Button>
                            <Button variant="danger" onClick={handleSelectedDelete}>Confirm</Button>
                        </div>
                    </div>
                </div>
            )}
            {showToast && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-xl">
                        <p className="text-green-500">
                            <CircleCheck className="w-15 h-15"/>
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                        Product Deleted Successfully
                        </p>
                        <div className="flex gap-3">
                            <Button variant="primary" onClick={()=> setShowToast(false)}>Ok</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </Card>
  )
}

export default ProductTable
