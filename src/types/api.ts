type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  data: T;
  message?: string;
};

const res1: ApiResponse<object> = {
  statusCode: 200,
  success: true,
  data: { name: 'dhaya', id: 1 },
  message: 'User logged in successfully',
};

const res2: ApiResponse<object> = {
  statusCode: 404,
  success: false,
  data: {},
  message: 'Product not found',
};

type User1 = {
  name: string;
  isActive: boolean;
};
const res3: ApiResponse<User1> = {
  statusCode: 200,
  success: true,
  data: {
    name: 'Dhaya',
    isActive: true,
  },
};
type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

const items = [1, 2, 3];
const pagination: Paginated<number> = {
  items: items,
  total: items.length,
  page: 2,
  limit: 1,
};

type ApiError = {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
};

const res4: ApiResponse<ApiError> = {
  statusCode: 404,
  success: false,
  data: {
    statusCode: 404,
    message: 'User not found',
  },
};
