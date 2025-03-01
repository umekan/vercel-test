import { Tool } from '@/types/tools';

// Define all available tools
export const toolsList: Tool[] = [
  {
    id: 'transparent-trimmer',
    name: 'Transparent Area Trimmer',
    description: 'Automatically trim transparent areas from images',
    icon: 'CropFree',
  },
  {
    id: 'color-changer',
    name: 'Color Changer',
    description: 'Change specific colors in your images',
    icon: 'Palette',
  },
  {
    id: 'resize-tool',
    name: 'Resize Tool',
    description: 'Resize images to specific dimensions',
    icon: 'PhotoSizeSelectLarge',
  },
  {
    id: 'text-overlay',
    name: 'Text Overlay',
    description: 'Add text to your images',
    icon: 'TextFields',
  },
];

export const getToolById = (id: string): Tool | undefined => {
  return toolsList.find(tool => tool.id === id);
};