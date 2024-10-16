import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const Chat = () => {
  // Define state for the form fields
  const [formData, setFormData] = useState({
    message: '',
    email: '',
  });

  // Define state for the response, submitted message, and loading
  const [responseData, setResponseData] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(''); // State for submitted message
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { message } = formData;

    setLoading(true); // Set loading state to true while waiting for the response
    setResponseData(''); // Clear any previous response
    setSubmittedMessage(message); // Store the submitted message

    try {
      const url = `https://iankagera--askfsdl-backend-web.modal.run/?query=${encodeURIComponent(
        message,
      )}&request_id=${encodeURIComponent('test@raisingthevillage.org')}`;

      const response = await fetch(url);
      const data = await response.json();

      setResponseData(data.answer || 'No response');
      setLoading(false); // Set loading state to false after receiving the response
      setFormData({ message: '', email: '' }); // Clear the input fields after submission
    } catch (error) {
      console.error('Error fetching the response:', error);
      setResponseData('Error fetching the response');
      setLoading(false); // Set loading state to false in case of an error
    }
  };

  return (
    <>
      <Breadcrumb pageName="Chat" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* Message and Response Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Enter message
              </h3>
            </div>

            {/* Display the submitted message and response */}
            <div className="p-6.5">
              {loading ? (
                <div className="rounded bg-yellow-100 p-4 text-black dark:bg-boxdark dark:text-white">
                  <p>Waiting for response...</p>
                </div>
              ) : (
                <>
                  {submittedMessage && (
                    <div className="rounded bg-blue-100 p-4 text-black dark:bg-blue-900 dark:text-white mb-4">
                      <h4 className="font-medium">Message Sent:</h4>
                      <p>{submittedMessage}</p>
                    </div>
                  )}
                  {responseData && (
                    <div className="rounded bg-green-100 p-4 text-black dark:bg-green-900 dark:text-white">
                      <h4 className="font-medium">Response:</h4>
                      <p>{responseData}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-row justify-between space-x-3 p-6.5">
                {/* Message input */}
                <div className="flex-grow">
                  <input
                    type="text"
                    name="message"
                    placeholder="Enter your message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>
                {/* Submit Button */}
                <div className="text-right">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded bg-primary px-5 py-3 text-white transition hover:bg-opacity-90"
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

export default Chat;
