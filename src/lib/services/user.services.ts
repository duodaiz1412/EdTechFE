import {api} from "@/lib/api";
import type {User, ApiResponse} from "../../pages/Cms/UserManagement";

// User API Endpoints
const USER_ENDPOINTS = {
  GET_USERS: "/admin/users",
  CREATE_USER: "/admin/users",
  UPDATE_USER: (userId: string) => `/admin/users/${userId}`,
  DELETE_USER: (userId: string) => `/admin/users/${userId}`,
} as const;

// Request Types
export interface GetUsersRequest {
  page?: number;
  size?: number;
}

export interface CreateUserRequest extends Omit<User, "id" | "roles"> {
  roles?: string[];
}

export interface UpdateUserRequest extends Omit<User, "id" | "roles"> {
  id: string;
  roles?: string[];
}
// User Services
export const userServices = {
  // Get users with pagination
  getUsers: async (params: GetUsersRequest = {}): Promise<ApiResponse> => {
    const {page = 0, size = 10} = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await api.get(
      `${USER_ENDPOINTS.GET_USERS}?${queryParams}`,
    );
    return response as any;
  },

  // Create a new user
  createUser: async (userData: Omit<User, "id">): Promise<User> => {
    const requestData = {
      ...userData,
      roles: userData.roles?.map((role) => role.role) || [],
    };

    const response = await api.post(USER_ENDPOINTS.CREATE_USER, requestData);
    return response as any;
  },

  // Update an existing user
  updateUser: async (
    userId: string,
    userData: Omit<User, "id">,
  ): Promise<User> => {
    const requestData = {
      id: userId,
      ...userData,
      roles: userData.roles?.map((role) => role.role) || [],
    };

    const response = await api.put(
      USER_ENDPOINTS.UPDATE_USER(userId),
      requestData,
    );
    return response as any;
  },

  // Delete a user
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(USER_ENDPOINTS.DELETE_USER(userId));
  },

  // Search users by term (client-side filtering for now)
  filterUsers: (users: User[], searchTerm: string): User[] => {
    if (!searchTerm.trim()) return users;

    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term),
    );
  },
};

export class UserService {
  static async getUsers(
    page: number = 0,
    size: number = 10,
  ): Promise<ApiResponse> {
    return userServices.getUsers({page, size});
  }

  static async createUser(userData: Omit<User, "id">): Promise<User> {
    return userServices.createUser(userData);
  }

  static async updateUser(
    userId: string,
    userData: Omit<User, "id">,
  ): Promise<User> {
    return userServices.updateUser(userId, userData);
  }

  static async deleteUser(userId: string): Promise<void> {
    return userServices.deleteUser(userId);
  }

  static filterUsers(users: User[], searchTerm: string): User[] {
    return userServices.filterUsers(users, searchTerm);
  }
}
