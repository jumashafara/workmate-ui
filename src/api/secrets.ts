import { API_ENDPOINT } from "./endpoints";

const getSecrets = async () => {
    const response = await fetch(`${API_ENDPOINT}/secrets/`);
    const data = await response.json();
    return data;
}

export default getSecrets;