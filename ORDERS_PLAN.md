### Orders Module Implementation Plan

## Routes

- /orders : Display the orders list with search, filters, sorting, and pagination
- /orders/[id] : Display order details and allow valid status updates
- /orders/new : Create an order with customer and product selection
- /orders/edit : Update an order status
- Dashboard : Add orders count, revenue and recent orders

## Components

- OrdersTable : Display orders using DataTable
- OrderStatusBadge : Display order status like pending, processing, shipped, delivered
- PaymentStatusBage : Disply payment status like pending, paid, unpaid
- OrderDetailsPage : Display details of order like items, items count, customer details and address, shipping details and order total
- OrderStatusTimeline : show order progress
- UpdateOrderStatus : Handle status updates, cancellation and return
- CreateOrderForm : Handle customers to make a order with details like products and count, customer address, payments options : COD (Cash on Delivery)

## Types 

- Order : Order Information, customer, items, totals and statuses
- OrderItem : Product, quantity, unit price and total
- OrderStatus : Order statuses
- PaymentStatus : Payment statuses
- Customer : Customer address and details


## API Functions

- getOrders() - Fetch orders with supported filters, sorting and pagination
- getOrderById - Fetch a specific order
- createOrder(data) - Create a new order
- updateOrderStatus(id, data) - Update order status