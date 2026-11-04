"use client"
import { OrderResponse, OrderSortBy, OrderStatus } from '@/types/order';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Column } from '../ui/data-table/data-table.types';
import { Delete, ImageIcon, SearchIcon } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Option from '../ui/Option';
import DataTable from '../ui/data-table/DataTable';
import Card from '../ui/Card';
import { useState } from 'react';
import { nextOrderStatus } from '@/lib/orderStatus';
import { updateOrderStatus } from '@/lib/order-client';
import Link from 'next/link';
import PaymentStatusBadge from '../ui/PaymentStatusBadge';
import OrderStatusBadge from '../ui/OrderStatusBadge';
import { SortDirection } from '@/types/product';
import Input from '../ui/Input';

type orderTableProps = {
    orders: OrderResponse[];
    search:string;
    status:string;
    dateRange:string;
    sort:string;
    total: number;
    page: number;
    limit: number;
}

const OrderTable = ({orders,search,status,dateRange,sort,total,page,limit}:orderTableProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [query,setQuery] = useState(search);
    const [orderStatus, setOrderStatus] = useState(status);
    const [startDate, setStartDate] = useState(dateRange ? dateRange.split(",")[0] : "");
    const [endDate, setEndDate] = useState(dateRange ? dateRange.split(",")[1] : "");

    const [field, setField] = useState<OrderSortBy>(() => {
        const [sortField] = sort.split('-');
        if(sortField === "finalAmount") return "finalAmount";
        if(sortField === "orderDate") return "orderDate";
        return "customerName";
    })
    const [direction, setDirection] = useState<SortDirection>(() => {
        const [,sortDirection] = sort.split('-');
        return sortDirection === "descending" ? "descending" : "ascending";
    });

    const values = [5,10,20,50,100];
    const totalPages = Math.ceil(total/limit);

    const updateQuery = (updates:Record<string,string>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key,value]) => {
            if(value){
                params.set(key,value);
            }else{
                params.delete(key);
            }
        });

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleStatusUpdate = async(orderId:string,status:OrderStatus) => {
        try {
            await updateOrderStatus(orderId,status);
            router.refresh();
        } catch (error) {
            console.error('Failed to update order status : ',error);
        }
    }

    const handleDateChange = (start: string, end: string) => {
        if (!start || !end) return;

        if (start > end) return;

        updateQuery({dateRange: `${start},${end}`,page: "1"});
    };

    const orderColumns:Column<OrderResponse>[] = [
        {
            header:"OrderId",
            accessor:"_id",
            sortable:false,
            sort:() => "",
            sortDirection:null,
            selectable:false,
            cell:(order) => (
                <p className="text-black">
                      {order._id}
                </p>
            ),

        },
        {
        header:"Customer Name",
        accessor:'customerName',
        sortable:true,
        sort:() => {
            const nextDirection = field === 'customerName' && direction === 'ascending' ? 'descending' : "ascending";
            setField('customerName');
            setDirection(nextDirection);
            updateQuery({sort:`customerName-${nextDirection}`,page:'1'});
        },
        sortDirection:sort.startsWith("customerName-") ? (sort.endsWith("ascending") ? "asc" : "desc") : null,
        selectable:false,
        cell:(order) => (
            <p className='text-black'>{order.customerName}</p>
        )
        },
        {
        header:"Order Date",
        accessor:'orderDate',
        sortable:true,
        sort:() => {
            const nextDirection = field === 'orderDate' && direction === 'ascending' ? 'descending' : "ascending";
            setField('orderDate');
            setDirection(nextDirection);
            updateQuery({sort:`orderDate-${nextDirection}`,page:'1'});
        },
        sortDirection:sort.startsWith("orderDate-") ? (sort.endsWith("ascending") ? "asc" : "desc") : null,
        selectable:false,
        cell:(order) => (
            <p className='text-black'>{new Date(order.orderDate).toLocaleDateString()}</p>
        )
        },
        {
        header:"Items Total count",
        accessor:'items',
        sortable:false,
        sort:() => "",
        sortDirection:null,
        selectable:false,
        cell:(order) => {
            const total = order.items.reduce((total,item) => total+item.quantity,0);
            return(
                <p className='text-black'>{total}</p>
            )
        }
        },
        {
            header:"Order Items",
            accessor:"items",
            sortable:false,
            sort:() => "",
            sortDirection:null,
            selectable:false,
            cell:(order) => (
                <div className='flex flex-col gap-2'>
                    {order.items.map((item) => item.thumbnail ? (
                        <div key={item.productId} className='flex gap-2 items-center'>
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-11 w-11 shrink-0 rounded-lg border border-gray-100 bg-gray-50 object-cover"
                        />
                        <span className="max-w-55 truncate font-medium text-gray-800">
                            {item.title} x {item.quantity}
                        </span>
                      </div>
                    ) : (
                        <div className="flex gap-2 text-gray-900 items-center justify-start">
                          <ImageIcon size={20} />
                          <span className="max-w-55 truncate font-medium text-gray-800">
                            {item.title}
                          </span>
                        </div>
                    ))}
                </div>
            ),

        },
        {
        header:"Items Price",
        accessor:'items',
        sortable:false,
        sort:() => "",
        sortDirection:null,
        selectable:false,
        cell:(order) => (
            <div className='flex flex-col gap-10 items-center'>
            {order.items.map((item) => (
                <span key={item.productId} className="text-right font-semibold tabular-nums text-gray-900">{formatPrice(item.price)}</span>
            ))}
            </div>
        )
        },
        {
        header:"Total Amount",
        accessor:'finalAmount',
        sortable:true,
        sort:() => {
            const nextDirection = field === 'finalAmount' && direction === 'ascending' ? 'descending' : "ascending";
            setField('finalAmount');
            setDirection(nextDirection);
            updateQuery({sort:`finalAmount-${nextDirection}`,page:'1'});
        },
        sortDirection:sort.startsWith("finalAmount-") ? (sort.endsWith("ascending") ? "asc" : "desc") : null,
        selectable:false,
        cell:(order) => (
            <div>
                <span className="text-right font-semibold tabular-nums text-gray-900">{formatPrice(order.finalAmount)}</span>
            </div>
        )
        },
        {
        header:"Payment Method",
        accessor:'paymentMethod',
        sortable:false,
        sort:() => "",
        sortDirection:null,
        selectable:false,
        cell:(order) => {
            const orderStatus = order.paymentMethod==="cash_on_delivery" && order.orderStatus!=="delivered" ? "unpaid" : "paid";
            return(
                <PaymentStatusBadge status={orderStatus}/>
            )
        }
        },
        {
        header:"Order Status",
        accessor:'orderStatus',
        sortable:false,
        sort:() => "",
        sortDirection:null,
        selectable:false,
        cell:(order) => (
            <OrderStatusBadge status={order.orderStatus}/>
        )
        },
        {
            header:"Update Order Status",
            accessor:'orderStatus',
            sortable:false,
            sort:() => "",
            sortDirection:null,
            selectable:false,
            cell:(order) => {
                const nextStatus = nextOrderStatus[order.orderStatus];
                return(
                <select id={`orderStatus-${order._id}`} value={order.orderStatus} onChange={(e) => handleStatusUpdate(order._id,e.target.value as OrderStatus)} className='w-25 p-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none transition hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:bg-red-500 disabled:cursor-not-allowed disabled:text-white disabled:appearance-none'  disabled={!nextStatus}>
                    <option value={order.orderStatus}>{order.orderStatus.replaceAll('_',' ')}</option>
                    {nextStatus && (
                    <option value={nextStatus}>{nextStatus.replaceAll('_',' ')}</option>
                    )}
                </select>
                )
            }
        },
        {
            header:"Action",
            accessor:'_id',
            sortable:false,
            sort:() => "",
            sortDirection:null,
            selectable:false,
            cell:(order) => {
                return(
                <Link href={`/orders/${order._id}`}><Button>view order</Button></Link>
                )
            }
        }
    ]
  return (
    <Card className="overflow-hidden border border-gray-200 bg-white p-0 shadow-sm">
        <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          {total} orders
        </span>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div className='flex flex-col'>
                <h2 className="text-lg font-semibold text-gray-900">
                  Orders
                </h2>
                <p className="text- mt-1 text-sm text-gray-500">
                  Manage your order status.
                </p>
            </div>
            <div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    updateQuery({search: query.trim(),page: "1"});
                    }}
                    className="flex items-center gap-2"
                >
                    <Input type="text" placeholder="Search order ID or customer..." value={query} onChange={(e) => setQuery(e.target.value)} />

                    <Button type="submit"><SearchIcon size={15}/></Button>

                    {query && (<Button type="button" variant="danger" onClick={() => {
                                setQuery("");
                                updateQuery({search: "",page: "1"})}}
                                ><Delete size={15}/></Button>
                    )}
                </form>
            </div>
            <div>
                <Select value={orderStatus} onChange={(e) => {
                    setOrderStatus(e.target.value);
                    updateQuery({status:e.target.value,page:"1"})
                }}>
                    <Option value="">All</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="processing">Processing</Option>
                    <Option value="shipped">Shipped</Option>
                    <Option value="delivered">Delivered</Option>
                    <Option value="cancelled">Cancelled</Option>
                </Select>
            </div>
            <div className='flex items-center gap-3 text-black'>
                <div>
                    <label htmlFor="startDate">From</label>
                    <Input id="startDate" type="date" value={startDate} max={endDate || undefined} onChange={(e) => {
                        const value = e.target.value;
                        setStartDate(value);
                        handleDateChange(value,endDate);
                    }} className='border rounded-md px-3 py-2'/>
                </div>
                <div>
                    <label htmlFor="endDate">To</label>
                    <Input id="endDate" type="date" value={endDate} min={startDate || undefined} onChange={(e) => {
                        const value = e.target.value;
                        setEndDate(value);
                        handleDateChange(startDate,value);
                    }} className='border rounded-md px-3 py-2'/>
                </div>
                {startDate && endDate && <Button variant='primary' onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    updateQuery({dateRange:"",page:"1"})
                }} className='text-sm'><Delete size={15}/></Button>}
            </div>
        </div>
        <div className="overflow-x-auto ">
            <DataTable rows={orders} columns={orderColumns}/>
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
        </div>
    </Card>
  )
}

export default OrderTable
