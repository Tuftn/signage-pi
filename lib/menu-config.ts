// Menu configuration for each screen
export interface MenuConfig {
  id: string
  name: string
  imagePath: string | null
  lastUpdated: Date
  isActive: boolean
  bgColor: string
}

// Default menu configurations
export const defaultMenus: MenuConfig[] = [
  {
    id: '1',
    name: 'Screen 1',
    imagePath: null,
    lastUpdated: new Date(),
    isActive: true,
    bgColor: 'from-orange-600 to-red-700'
  },
  {
    id: '2', 
    name: 'Screen 2',
    imagePath: null,
    lastUpdated: new Date(),
    isActive: true,
    bgColor: 'from-green-600 to-blue-700'
  },
  {
    id: '3',
    name: 'Screen 3', 
    imagePath: null,
    lastUpdated: new Date(),
    isActive: true,
    bgColor: 'from-purple-600 to-pink-700'
  },
  {
    id: '4',
    name: 'Screen 4',
    imagePath: null,
    lastUpdated: new Date(),
    isActive: true,
    bgColor: 'from-yellow-600 to-orange-700'
  },
  {
    id: '5',
    name: 'Screen 5',
    imagePath: null,
    lastUpdated: new Date(),
    isActive: true,
    bgColor: 'from-blue-600 to-indigo-700'
  },
  {
    id: '6',
    name: 'Screen 6',
    imagePath: null,
    lastUpdated: new Date(),
    isActive: true,
    bgColor: 'from-pink-600 to-red-700'
  },
  {
    id: '7',
    name: 'Screen 7',
    imagePath: null,
    lastUpdated: new Date(),
    isActive: true,
    bgColor: 'from-amber-600 to-brown-700'
  },
  {
    id: '8',
    name: 'Screen 8',
    imagePath: null,
    lastUpdated: new Date(),
    isActive: true,
    bgColor: 'from-teal-600 to-cyan-700'
  }
]

// Color options for new screens
export const colorOptions = [
  'from-red-600 to-pink-700',
  'from-orange-600 to-red-700', 
  'from-yellow-600 to-orange-700',
  'from-green-600 to-blue-700',
  'from-blue-600 to-indigo-700',
  'from-purple-600 to-pink-700',
  'from-pink-600 to-red-700',
  'from-teal-600 to-cyan-700',
  'from-amber-600 to-brown-700',
  'from-slate-600 to-slate-800',
  'from-gray-600 to-gray-800',
  'from-zinc-600 to-zinc-800'
]

// Get menu config for a specific screen
export function getMenuConfig(screenId: string): MenuConfig {
  const existingMenu = defaultMenus.find(menu => menu.id === screenId)
  
  if (existingMenu) {
    return existingMenu
  }
  
  // Generate config for screens beyond the default list
  const colorIndex = (parseInt(screenId) - 1) % colorOptions.length
  
  return {
    id: screenId,
    name: `Screen ${screenId}`,
    imagePath: null,
    lastUpdated: new Date(),
    isActive: true,
    bgColor: colorOptions[colorIndex]
  }
}

// Get all menu configs up to a specific number
export function getAllMenuConfigs(maxScreens: number): MenuConfig[] {
  const configs: MenuConfig[] = []
  
  for (let i = 1; i <= maxScreens; i++) {
    configs.push(getMenuConfig(i.toString()))
  }
  
  return configs
}

// Simulate menu image upload (in a real app, this would save to a database/file system)
export function updateMenuImage(screenId: string, imagePath: string): MenuConfig {
  const config = getMenuConfig(screenId)
  return {
    ...config,
    imagePath,
    lastUpdated: new Date()
  }
}

// Check if a screen has a menu image uploaded
export function hasMenuImage(screenId: string): boolean {
  const config = getMenuConfig(screenId)
  return config.imagePath !== null
}