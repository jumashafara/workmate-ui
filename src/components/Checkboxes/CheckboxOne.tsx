import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const CheckboxOne = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="checkboxLabelOne"
        checked={isChecked}
        onCheckedChange={(checked) => setIsChecked(checked as boolean)}
      />
      <Label
        htmlFor="checkboxLabelOne"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Checkbox Text
      </Label>
    </div>
  );
};

export default CheckboxOne;