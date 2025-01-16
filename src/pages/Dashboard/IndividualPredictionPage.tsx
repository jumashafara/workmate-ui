import React, { useState, ChangeEvent, FormEvent } from "react";
import ReactSlider from "react-slider";
import PieChart from "../../components/Charts/PieChart";
import SelectGroupOne from "../../components/Forms/SelectGroup/SelectGroupOne";
import CheckboxTwo from "../../components/Checkboxes/CheckboxTwo";
import { BounceLoader, PuffLoader } from "react-spinners";
import getPrediction from "../../api/Predictions";
import { Features } from "../../types/features";

const IndividualPredictionPage: React.FC = () => {
  const [selectedHousehold, setSelectedHousehold] = useState<string>("");

  const handleHouseholdChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedHousehold(event.target.value);
    console.log("passenger selected");
  };

  const [cutoffSliderValue, setCutoffSliderValue] = useState<number>(0.5);
  const [landSliderValue, setLandSliderValue] = useState<number>(1);
  const [memberSliderValue, setMemberSliderValue] = useState<number>(5);
  const [waterSliderValue, setWaterSliderValue] = useState<number>(1);
  const [farmImplementsValue, setFarmImplementsValue] = useState<number>(1);

  const handleWaterSliderChange = async (new_value: number) => {
    setWaterSliderValue(new_value);
    setFormData({
      ...formData,
      Average_Water_Consumed_Per_Day: [waterSliderValue],
    });
  };

  const handleFarmImplementsChange = async (new_value: number) => {
    setFarmImplementsValue(new_value);
    setFormData({
      ...formData,
      farm_implements_owned: [farmImplementsValue],
    });
  };

  const handleCutoffSliderChange = async (new_value: number) => {
    setCutoffSliderValue(new_value);
    console.log(new_value);
  };

  const handleLandSliderChange = async (new_value: number) => {
    setLandSliderValue(new_value);
    setFormData({
      ...formData,
      Land_size_for_Crop_Agriculture_Acres: [landSliderValue],
    });
  };

  const handleMemberSliderChange = async (new_value: number) => {
    setMemberSliderValue(new_value);
    setFormData({
      ...formData,
      tot_hhmembers: [memberSliderValue],
    });
  };

  const [prediction, setPrediction] = useState<number>(0.5);
  const [probabilities, setProbabilities] = useState<Array<number>>([0.5, 0.5]);

  const [formData, setFormData] = useState<Features>({
    household_id: "",
    cassava: [true], //done
    maize: [true], //
    ground_nuts: [true], //done
    irish_potatoes: [true], //
    sweet_potatoes: [true], //done
    perennial_crops_grown_food_banana: [true], //done
    tot_hhmembers: [0], // done
    business_participation: [true],
    Land_size_for_Crop_Agriculture_Acres: [0], //done
    farm_implements_owned: [0],
    vsla_participation: [true],
    Average_Water_Consumed_Per_Day: [0],
  });

  const handleGetPrediction = async (data: Features) => {
    const response = await getPrediction(data);
    const prediction = response.prediction
    const probabiliy = response.probability
    setPrediction(prediction);
    setProbabilities([probabiliy, (1 - probabiliy)]);
  };

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
                value={cutoffSliderValue}
                onChange={handleCutoffSliderChange}
                className="slider m-auto"
                thumbClassName="thumb"
                trackClassName="track"
              />
              <div className="slider-value">{cutoffSliderValue}</div>
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
                    <td className="px-4 py-2 border-b text-left">
                      {probabilities[0].toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-left">
                      Not Achieving
                    </td>
                    <td className="px-4 py-2 border-b text-left">
                      {probabilities[1].toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-left">Predicted</td>
                    <td className="px-4 py-2 border-b text-left">
                      {prediction == 1 ? "Achieved" : "Not Achieved"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="md:w-1/2 p-6">
              <PieChart data={probabilities} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row mt-6 md:space-x-6">
        <div className="border border-gray-300 md:w-3/4 bg-white">
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
                    initialChecked={
                      formData.perennial_crops_grown_food_banana[0]
                    }
                    onChange={(checked) =>
                      setFormData({
                        ...formData,
                        perennial_crops_grown_food_banana: [checked],
                      })
                    }
                  />
                </div>
                <div>
                  <CheckboxTwo
                    label="Ground Nuts"
                    initialChecked={formData.ground_nuts[0]}
                    onChange={(checked) =>
                      setFormData({ ...formData, ground_nuts: [checked] })
                    }
                  />
                </div>
                <div>
                  <CheckboxTwo
                    label="Sweet Potatoes"
                    initialChecked={formData.sweet_potatoes[0]}
                    onChange={(checked) =>
                      setFormData({ ...formData, sweet_potatoes: [checked] })
                    }
                  />
                </div>
                <div>
                  <CheckboxTwo
                    label="Cassava"
                    initialChecked={formData.cassava[0]}
                    onChange={(checked) =>
                      setFormData({ ...formData, cassava: [checked] })
                    }
                  />
                </div>
                <div>
                  <CheckboxTwo
                    label="Business Participation"
                    initialChecked={formData.business_participation[0]}
                    onChange={(checked) =>
                      setFormData({
                        ...formData,
                        business_participation: [checked],
                      })
                    }
                  />
                </div>
              </div>
              <div className="">
                {/* <h2 className="text-lg mb-4 w-full text-gray-900 dark:text-white">
                Numerical
              </h2> */}
                <div className="slider-container flex flex-col md:flex-row md:space-x-6 px-6 pb-6">
                  <p className="min-w-fit">Agriculture Land </p>
                  <ReactSlider
                    min={0}
                    max={10}
                    step={0.1}
                    value={landSliderValue}
                    onChange={handleLandSliderChange}
                    className="slider m-auto"
                    thumbClassName="thumb"
                    trackClassName="track"
                  />
                  <div className="slider-value">{landSliderValue}</div>
                </div>
                <div className="slider-container flex flex-col md:flex-row md:space-x-6 px-6 pb-6">
                  <p className="min-w-fit">Household Members </p>
                  <ReactSlider
                    min={0}
                    max={30}
                    step={1}
                    value={memberSliderValue}
                    onChange={handleMemberSliderChange}
                    className="slider m-auto"
                    thumbClassName="thumb"
                    trackClassName="track"
                  />
                  <div className="slider-value">{memberSliderValue}</div>
                </div>
                <div className="slider-container flex flex-col md:flex-row md:space-x-6 px-6 pb-6">
                  <p className="min-w-fit">Farm Implements </p>
                  <ReactSlider
                    min={0}
                    max={20}
                    step={1}
                    value={farmImplementsValue}
                    onChange={handleFarmImplementsChange}
                    className="slider m-auto"
                    thumbClassName="thumb"
                    trackClassName="track"
                  />
                  <div className="slider-value">
                    {formData.farm_implements_owned}
                  </div>
                </div>
                <div className="slider-container flex flex-col md:flex-row md:space-x-6 px-6 pb-6">
                  <p className="min-w-fit">Daily Consumed Water</p>
                  <ReactSlider
                    min={0}
                    max={20}
                    step={0.1}
                    value={waterSliderValue}
                    onChange={handleWaterSliderChange}
                    className="slider m-auto"
                    thumbClassName="thumb"
                    trackClassName="track"
                  />
                  <div className="slider-value">
                    {formData.Average_Water_Consumed_Per_Day}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="border border-gray-300 md:w-1/4 bg-white">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 text-center">
            <h2 className="text-lg font-semibold mb-4 w-full text-gray-900 dark:text-white">
              Run prediction
            </h2>
            <p>All set? Get prediction</p>
          </div>
          <div className="p-6 flex flex-col m-auto space-y-3">
            <div className="m-auto p-3">
              <PuffLoader loading={true} />
              <BounceLoader loading={false} />
            </div>
            <button
              onClick={() => {
                handleGetPrediction(formData);
              }}
              className="inline-flex items-center justify-center bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Get prediction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualPredictionPage;
