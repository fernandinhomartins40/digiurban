
import { MealMenu, PaginatedResponse } from "@/types/education";

// Temporary mock data
const mockMenus: MealMenu[] = [
  {
    id: "menu1",
    schoolId: "school1",
    name: "Cardápio Semanal 1",
    shift: "morning",
    dayOfWeek: 1,
    menuItems: ["Arroz", "Feijão", "Frango", "Salada"],
    year: 2024,
    activeFrom: "2024-05-01T00:00:00Z",
    isSpecialDiet: false,
    isActive: true,
    createdAt: "2024-04-20T10:00:00Z",
    updatedAt: "2024-04-20T10:00:00Z"
  },
  {
    id: "menu2",
    schoolId: "school2",
    name: "Cardápio Especial",
    shift: "afternoon",
    dayOfWeek: 2,
    menuItems: ["Macarrão", "Molho", "Carne moída", "Salada"],
    year: 2024,
    activeFrom: "2024-05-02T00:00:00Z",
    isSpecialDiet: true,
    forDietaryRestrictions: ["gluten"],
    isActive: true,
    createdAt: "2024-04-21T10:00:00Z",
    updatedAt: "2024-04-21T10:00:00Z"
  }
];

interface MenusParams {
  page?: number;
  pageSize?: number;
  search?: string;
  schoolId?: string;
}

export const getMenus = async (params: MenusParams = {}): Promise<PaginatedResponse<MealMenu>> => {
  const { page = 1, pageSize = 10, search = '', schoolId } = params;
  
  // Filter by search term and school ID
  let filteredMenus = [...mockMenus];
  
  if (search) {
    filteredMenus = filteredMenus.filter(
      menu => menu.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (schoolId) {
    filteredMenus = filteredMenus.filter(menu => menu.schoolId === schoolId);
  }
  
  // Calculate pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedMenus = filteredMenus.slice(start, end);
  
  return {
    data: paginatedMenus,
    count: filteredMenus.length,
    page,
    pageSize
  };
};

export const createMenu = async (menuData: Partial<MealMenu>): Promise<MealMenu> => {
  // In a real app, this would make an API call
  // For now, just simulate creating a new menu
  const newMenu: MealMenu = {
    id: `menu${Date.now()}`,
    schoolId: menuData.schoolId || '',
    name: menuData.name || `Novo Cardápio ${Date.now()}`,
    shift: menuData.shift || 'morning',
    dayOfWeek: menuData.dayOfWeek || 1,
    menuItems: menuData.menuItems || [],
    year: menuData.year || new Date().getFullYear(),
    activeFrom: menuData.activeFrom || new Date().toISOString(),
    isSpecialDiet: menuData.isSpecialDiet || false,
    forDietaryRestrictions: menuData.forDietaryRestrictions,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockMenus.push(newMenu);
  return newMenu;
};

export const updateMenu = async (id: string, menuData: Partial<MealMenu>): Promise<MealMenu> => {
  // Find the menu to update
  const menuIndex = mockMenus.findIndex(menu => menu.id === id);
  
  if (menuIndex === -1) {
    throw new Error("Menu not found");
  }
  
  // Update the menu
  const updatedMenu = {
    ...mockMenus[menuIndex],
    ...menuData,
    updatedAt: new Date().toISOString()
  };
  
  mockMenus[menuIndex] = updatedMenu;
  return updatedMenu;
};

export const deleteMenu = async (id: string): Promise<void> => {
  const menuIndex = mockMenus.findIndex(menu => menu.id === id);
  
  if (menuIndex === -1) {
    throw new Error("Menu not found");
  }
  
  mockMenus.splice(menuIndex, 1);
};
