import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const SwitcherFour = () => {
  const [enabled, setEnabled] = useState<boolean>(false);

  return (
    <div>
      <Switch
        id="toggle4"
        checked={enabled}
        onCheckedChange={setEnabled}
        className="data-[state=checked]:bg-black data-[state=unchecked]:bg-black"
      />
    </div>
  );
};

export default SwitcherFour;