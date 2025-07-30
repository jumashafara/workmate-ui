import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";

const SwitcherThree = () => {
  const [enabled, setEnabled] = useState<boolean>(false);

  return (
    <div>
      <div className="relative">
        <Switch
          id="toggle3"
          checked={enabled}
          onCheckedChange={setEnabled}
          className="data-[state=checked]:bg-primary"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {enabled ? (
            <Check className="h-3 w-3 text-white dark:text-black ml-3" />
          ) : (
            <X className="h-3 w-3 text-gray-600 -ml-3" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SwitcherThree;