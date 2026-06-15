import api from "../api/api";

export interface PermissionItem {
  id: string;
  name: string;
  description: string;
}
const ENDPOINT = '/permissions'; 


export const permissionsService = {
   getAll: async (): Promise<PermissionItem[]> => {
    const { data } = await api.get<PermissionItem[]>(ENDPOINT);
    return data;
  },

  create: async (newPermission: Omit<PermissionItem, 'id'>): Promise<PermissionItem> => {
    const { data } = await api.post<PermissionItem>(ENDPOINT, newPermission);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${ENDPOINT}/${id}`);
  }
};
