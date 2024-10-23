import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const FormLayout = () => {
  // Define state for the form fields
  const [formData, setFormData] = useState({
    HouseHoldID: '',
    HouseholdSize: '',
    TimeToOPD: '',
    TimeToWater: '',
    AgricultureLand: '',
    PerennialCropsGrown: '',
    hhh_read_write: '',
    Material_walls: '',
    business_number: '',
    work_casual: '',
    work_salaried: '',
    save_mode_7: '',
    perennial_cropping: '',
    latrine_constructed: '',
    tippy_tap_available: '',
    standard_hangline: '',
    kitchen_house: '',
    bathroom_constructed: '',
    swept_compound: '',
    dish_rack_present: '',
    composts: '',
    non_bio_waste_mgt_present: '',
    apply_liquid_manure: '',
    water_control_practise: '',
    soil_management: '',
    postharvest_food_storage: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;

      if (selectedFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('file', selectedFile);

        response = await fetch('api/predictor/predict', {
          method: 'POST',
          body: formDataToSend,
        });
      } else {
        const formattedData = {
          HouseHoldID: [formData.HouseHoldID],
          HouseholdSize: [parseInt(formData.HouseholdSize)],
          TimeToOPD: [parseInt(formData.TimeToOPD)],
          TimeToWater: [parseInt(formData.TimeToWater)],
          AgricultureLand: [parseInt(formData.AgricultureLand)],
          PerennialCropsGrown: [parseInt(formData.PerennialCropsGrown)],
          hhh_read_write: [parseInt(formData.hhh_read_write)],
          Material_walls: [parseInt(formData.Material_walls)],
          business_number: [parseInt(formData.business_number)],
          work_casual: [parseInt(formData.work_casual)],
          work_salaried: [parseInt(formData.work_salaried)],
          save_mode_7: [parseInt(formData.save_mode_7)],
          perennial_cropping: [parseInt(formData.perennial_cropping)],
          latrine_constructed: [parseInt(formData.latrine_constructed)],
          tippy_tap_available: [parseInt(formData.tippy_tap_available)],
          standard_hangline: [parseInt(formData.standard_hangline)],
          kitchen_house: [parseInt(formData.kitchen_house)],
          bathroom_constructed: [parseInt(formData.bathroom_constructed)],
          swept_compound: [parseInt(formData.swept_compound)],
          dish_rack_present: [parseInt(formData.dish_rack_present)],
          composts: [parseInt(formData.composts)],
          non_bio_waste_mgt_present: [
            parseInt(formData.non_bio_waste_mgt_present),
          ],
          apply_liquid_manure: [parseInt(formData.apply_liquid_manure)],
          water_control_practise: [parseInt(formData.water_control_practise)],
          soil_management: [parseInt(formData.soil_management)],
          postharvest_food_storage: [
            parseInt(formData.postharvest_food_storage),
          ],
        };

        response = await fetch('api/predictor/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }

      // const data = await response.json();
      alert('Data submitted successfully');

      setFormData({
        HouseHoldID: '',
        HouseholdSize: '',
        TimeToOPD: '',
        TimeToWater: '',
        AgricultureLand: '',
        PerennialCropsGrown: '',
        hhh_read_write: '',
        Material_walls: '',
        business_number: '',
        work_casual: '',
        work_salaried: '',
        save_mode_7: '',
        perennial_cropping: '',
        latrine_constructed: '',
        tippy_tap_available: '',
        standard_hangline: '',
        kitchen_house: '',
        bathroom_constructed: '',
        swept_compound: '',
        dish_rack_present: '',
        composts: '',
        non_bio_waste_mgt_present: '',
        apply_liquid_manure: '',
        water_control_practise: '',
        soil_management: '',
        postharvest_food_storage: '',
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Submit Data To Infer" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* File upload */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Upload file eg .xlsx, .csv
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Attach file
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-center text-2xl font-bold text-black-2">Or</h3>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Enter data
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                {/* Dynamically render form fields */}
                {Object.keys(formData).map((key) => (
                  <div className="mb-4.5" key={key}>
                    <label className="mb-2.5 block text-black dark:text-white">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={formData[key as keyof typeof formData]}
                      onChange={handleChange}
                      placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                    />
                  </div>
                ))}
                {/* Submit Button */}
                <div className="text-right">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded bg-primary px-5 py-2 text-white transition hover:bg-opacity-90"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormLayout;
