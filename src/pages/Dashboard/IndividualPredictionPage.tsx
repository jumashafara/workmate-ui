import React, { useState, ChangeEvent, FormEvent } from "react";
import ReactSlider from "react-slider";
import PieChart from "../../components/Charts/PieChart";
import SelectGroupOne from "../../components/Forms/SelectGroup/SelectGroupOne";
import CheckboxTwo from "../../components/Checkboxes/CheckboxTwo";

const IndividualPredictionPage: React.FC = () => {
  const [selectedHousehold, setSelectedHousehold] = useState<string>("");

  const handleHouseholdChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedHousehold(event.target.value);
    console.log("passenger selected");
  };

  const [sliderValue, setSliderValue] = useState<number>(0.5);

  const handleSliderChange = async (new_value: number) => {
    setSliderValue(new_value);
    console.log(new_value);
  };

  const [prediction, setPrediction] = useState<number>(0.5);

  type FormDataType = {
    agricultureLand: number;
    foodBanana: boolean;
    farmImplements: number;
    householdMembers: number;
    sweetPotatoes: boolean;
    groundNuts: boolean;
    coffee: boolean;
    businessParticipation: string;
  };

  const [formData, setFormData] = useState<FormDataType>({
    agricultureLand: 0,
    foodBanana: false,
    farmImplements: 0,
    householdMembers: 0,
    sweetPotatoes: false,
    groundNuts: false,
    coffee: false,
    businessParticipation: "",
  });

  return (
    <div className="">
      <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6">
        <div className="w-full md:w-1/2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 text-center">
            <h2 className="text-lg font-semibold mb-4 w-full text-gray-900 dark:text-white">
              Select Household
            </h2>
            <p>Select from list or pick at random</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between md:space-x-3 p-6">
            <div className="md:w-1/2">
              <SelectGroupOne />
            </div>
            <button className="inline-flex items-center justify-center bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
              Random Household
            </button>
          </div>
          <div className="flex flex-col">
            <h2 className="text-center">Select cutoff probability</h2>
            <div className="slider-container flex flex-row px-6 pb-6">
              <ReactSlider
                min={0.1}
                max={0.9}
                step={0.1}
                value={sliderValue}
                onChange={handleSliderChange}
                className="slider m-auto"
                thumbClassName="thumb"
                trackClassName="track"
              />
              <div className="slider-value">{sliderValue}</div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 text-center">
            <h2 className="text-lg font-semibold mb-4 w-full text-gray-900 dark:text-white">
              Prediction
            </h2>
            <p>What are the chances of achieving the target?</p>
          </div>
          <div className="p-6 flex flex-col md:flex-row">
            <div className="md:w-1/2">
              {/* Results table */}
              <table className="w-full bg-white">
                <thead>
                  <tr className="">
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">
                      Probability
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="">
                    <td className="px-4 py-2 border-b text-left">Achieving</td>
                    <td className="px-4 py-2 border-b text-left">{0.5}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-left">
                      Not Achieving
                    </td>
                    <td className="px-4 py-2 border-b text-left">{0.5}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-left">Predicted</td>
                    <td className="px-4 py-2 border-b text-left">Achieved</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="md:w-1/2 p-6">
              <PieChart />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="border border-gray-300 mt-6 md:w-3/4 bg-white">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 text-center">
            <h2 className="text-lg font-semibold mb-4 w-full text-gray-900 dark:text-white">
              Feature Input
            </h2>
            <p>Adjust features to change the prediction</p>
          </div>
          <form action="" method="post" className="p-6">
            <div className="flex flex-col">
              {/* <h2 className="text-lg mb-4 text-gray-900 dark:text-white">
                Categorical
              </h2> */}
              <div className="flex flex-col md:flex-row py-3 md:justify-evenly">
                <div>
                  <CheckboxTwo
                    label="Food Banana"
                    initialChecked={formData.foodBanana}
                    onChange={(checked) =>
                      setFormData({ ...formData, foodBanana: checked })
                    }
                  />
                </div>
                <div>
                  <CheckboxTwo
                    label="Ground Nuts"
                    initialChecked={formData.groundNuts}
                    onChange={(checked) =>
                      setFormData({ ...formData, groundNuts: checked })
                    }
                  />
                </div>
                <div>
                  <CheckboxTwo
                    label="Sweet Potatoes"
                    initialChecked={formData.sweetPotatoes}
                    onChange={(checked) =>
                      setFormData({ ...formData, sweetPotatoes: checked })
                    }
                  />
                </div>
                <div>
                  <CheckboxTwo
                    label="Coffee"
                    initialChecked={formData.coffee}
                    onChange={(checked) =>
                      setFormData({ ...formData, coffee: checked })
                    }
                  />
                </div>
              </div>
              <div className="">
                {/* <h2 className="text-lg mb-4 w-full text-gray-900 dark:text-white">
                Numerical
              </h2> */}
                <div className="slider-container flex flex-col md:flex-row md:space-x-6 px-6 pb-6">
                  <p className="min-w-fit">Agriculture Land: </p>
                  <ReactSlider
                    min={0}
                    max={10}
                    step={0.1}
                    value={sliderValue}
                    onChange={handleSliderChange}
                    className="slider m-auto"
                    thumbClassName="thumb"
                    trackClassName="track"
                  />
                  <div className="slider-value">{sliderValue}</div>
                </div>
                <div className="slider-container flex flex-col md:flex-row md:space-x-6 px-6 pb-6">
                  <p className="min-w-fit">Household Members: </p>
                  <ReactSlider
                    min={0}
                    max={10}
                    step={0.1}
                    value={sliderValue}
                    onChange={handleSliderChange}
                    className="slider m-auto"
                    thumbClassName="thumb"
                    trackClassName="track"
                  />
                  <div className="slider-value">{sliderValue}</div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div>
            
        </div>
      </div>
    </div>
  );
};

export default IndividualPredictionPage;
