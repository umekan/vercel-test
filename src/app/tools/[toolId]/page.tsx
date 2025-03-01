import React from 'react';
import { notFound } from 'next/navigation';
import { getToolById } from '@/lib/toolsRegistry';
import AppLayout from '@/components/layout/AppLayout';
import TransparentTrimmer from '@/components/tools/TransparentTrimmer';
import ColorChanger from '@/components/tools/ColorChanger';

// Map of tool IDs to their components
const toolComponents: Record<string, React.ComponentType> = {
  'transparent-trimmer': TransparentTrimmer,
  'color-changer': ColorChanger,
  // Add more tool components as you create them
};

// 型注釈を削除して Next.js に推論させる
export default async function ToolPage({ params }) {
  const { toolId } = params;
  const tool = getToolById(toolId);
  
  // If tool doesn't exist, show 404
  if (!tool || !toolComponents[toolId]) {
    notFound();
  }
  
  // Render the corresponding tool component
  const ToolComponent = toolComponents[toolId];
  
  return (
    <AppLayout>
      <ToolComponent />
    </AppLayout>
  );
}

// Generate static paths for all tools
export function generateStaticParams() {
  return [
    { toolId: 'transparent-trimmer' },
    { toolId: 'color-changer' },
    // Add other tools as they become available
  ];
}