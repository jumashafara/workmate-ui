import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const CheckboxThree = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Checkbox
          id="checkboxLabelThree"
          checked={isChecked}
          onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          className="data-[state=checked]:bg-transparent data-[state=checked]:border-primary"
        />
        {isChecked && (
          <X className="absolute inset-0 h-3.5 w-3.5 m-auto text-primary stroke-2" />
        )}
      </div>
      <Label
        htmlFor="checkboxLabelThree"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Checkbox Text
      </Label>
    </div>
  );
};

export default CheckboxThree;