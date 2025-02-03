import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import ReactSlider from "react-slider";
import PieChart from "../../components/Charts/PieChart";
import SelectGroupOne from "../../components/Forms/SelectGroup/SelectGroupOne";
import CheckboxTwo from "../../components/Checkboxes/CheckboxTwo";
import { BounceLoader, PuffLoader } from "react-spinners";
import getPrediction from "../../api/Predictions";
import { Features } from "../../types/features";
import { fetchModelMetrics } from "../../api/ModelMetrics";
import { MetricsProps } from "../../types/modelmetrics";

const IndividualPredictionPage: React.FC = () => {
  const [selectedHousehold, setSelectedHousehold] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleHouseholdChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedHousehold(event.target.value);
    console.log("passenger selected");
  };

  const [evaluationMonth, setEvaluationMonth] = useState(1)
  const [cutoffSliderValue, setCutoffSliderValue] = useState<number>(0.5);
  const [landSliderValue, setLandSliderValue] = useState<number>(1);
  const [memberSliderValue, setMemberSliderValue] = useState<number>(5);
  const [waterSliderValue, setWaterSliderValue] = useState<number>(1);
  const [farmImplementsValue, setFarmImplementsValue] = useState<number>(1);
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
    setLoading(true);
    const response = await getPrediction(data);
    const prediction = response.prediction;
    const probabiliy = response.probability;
    setPrediction(prediction);
    setProbabilities([probabiliy, 1 - probabiliy]);
    setLoading(false);
  };

  const [model_id, setModelId] = useState<number>(1);

  return (
    <div className="">
      <div className="">
        <select
          value={model_id}
          name=""
          id=""
          className="p-2 bg-transparent outline-none"
          onChange={(e) => {
            console.log("hello");
            const selectedId = Number(e.target.value);
            setModelId(selectedId);
            localStorage.setItem("model_id", selectedId.toString());
          }}
        >
          <option className="disabled" value="">
            Select Model
          </option>
          <option value="1">Year 1 Classification</option>
        </select>
      </div>
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
            <div className="slider-container flex flex-row px-6 pb-6 justify-between">
              <h2 className="text-center px-3">Select cutoff probability</h2>
              <input
                type="number"
                min={0.1}
                max={0.9}
                step={0.1}
                value={cutoffSliderValue}
                onChange={(e) => setCutoffSliderValue(Number(e.target.value))}
                className="p-2 border border-gray-400 outline-none rounded-sm"
              />
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
                  <p className="min-w-fit">Evaluation Month </p>
                  <input
                    min={0}
                    max={3}
                    step={1}
                    value={landSliderValue}
                    onChange={(e) => setLandSliderValue(Number(e.target.value))}
                    className="p-2 border border-gray-400 outline-none rounded-sm"
                  />
                </div>
                <div className="slider-container flex flex-col md:flex-row md:space-x-6 px-6 pb-6">
                  <p className="min-w-fit">Agriculture Land </p>
                  <input
                    min={0}
                    max={10}
                    value={landSliderValue}
                    onChange={(e) => setLandSliderValue(Number(e.target.value))}
                    className="p-2 border border-gray-400 outline-none rounded-sm"
                  />
                </div>
                <div className="slider-container flex flex-col md:flex-row md:space-x-6 px-6 pb-6">
                  <p className="min-w-fit">Household Members </p>
                  <input
                    min={1}
                    max={30}
                    step={1}
                    value={memberSliderValue}
                    onChange={(e) =>
                      setMemberSliderValue(Number(e.target.value))
                    }
                    className="p-2 border border-gray-400 outline-none rounded-sm"
                  />
                </div>
                <div className="slider-container flex flex-col md:flex-row md:space-x-6 px-6 pb-6">
                  <p className="min-w-fit">Farm Implements </p>
                  <input
                    min={0}
                    max={20}
                    step={1}
                    value={farmImplementsValue}
                    onChange={(e) =>
                      setFarmImplementsValue(Number(e.target.value))
                    }
                    className="p-2 border border-gray-400 outline-none rounded-sm"
                  />
                </div>
                <div className="slider-container flex flex-col md:flex-row md:space-x-6 px-6 pb-6">
                  <p className="min-w-fit">Daily Consumed Water</p>
                  <input
                    min={0.1}
                    max={20}
                    step={0.1}
                    value={waterSliderValue}
                    onChange={(e) =>
                      setWaterSliderValue(Number(e.target.value))
                    }
                    className="p-2 border border-gray-400 outline-none rounded-sm"
                  />
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
          <div className="p-6 flex flex-col m-auto space-y-3 h-3/4">
            <div className="m-auto p-3 flex flex-col">
              <div className="">
                <PuffLoader loading={loading} color="#EA580C" />
              </div>
              <div>
                <BounceLoader loading={!loading} color="#EA580C" />
              </div>
            </div>

            <button
              onClick={() => handleGetPrediction(formData)}
              className="mt-auto inline-flex items-center justify-center bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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
