import React from 'react';
import { Button } from '@/components/ui/button';  

export default function ToolButton({ label, active, onClick,  }) {
  return (
    <Button
      variant={active ? undefined : 'outline'}
      className="w-full"
      onClick={() => onClick(label)}
        >
      {label}    
    </Button>
  );
}
