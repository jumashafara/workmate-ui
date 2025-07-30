import { useState } from "react";
import { Label } from "@/components/ui/label";

const CheckboxFour = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <input
          type="checkbox"
          id="checkboxLabelFour"
          className="sr-only"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
            isChecked ? "border-primary" : "border-muted-foreground"
          }`}
          onClick={() => setIsChecked(!isChecked)}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              isChecked ? "bg-primary" : "bg-transparent"
            }`}
          />
        </div>
      </div>
      <Label
        htmlFor="checkboxLabelFour"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        onClick={() => setIsChecked(!isChecked)}
      >
        Checkbox Text
      </Label>
    </div>
  );
};

export default CheckboxFour;