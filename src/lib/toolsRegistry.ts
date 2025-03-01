import { Tool } from '@/types/tools';
import { getTranslations } from './i18n';

// Get translations
const t = getTranslations();

// Define all available tools
export const toolsList: Tool[] = [
  {
    id: 'transparent-trimmer',
    name: t.tools.transparentTrimmer.name,
    description: t.tools.transparentTrimmer.description,
    icon: 'CropFree',
  },
  {
    id: 'color-changer',
    name: t.tools.colorChanger.name,
    description: t.tools.colorChanger.description,
    icon: 'Palette',
  },
  {
    id: 'resize-tool',
    name: 'リサイズツール',
    description: '画像を特定のサイズに変更します',
    icon: 'PhotoSizeSelectLarge',
  },
  {
    id: 'text-overlay',
    name: 'テキストオーバーレイ',
    description: '画像にテキストを追加します',
    icon: 'TextFields',
  },
];

export const getToolById = (id: string): Tool | undefined => {
  return toolsList.find(tool => tool.id === id);
};