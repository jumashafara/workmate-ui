import { Trubrics } from "@trubrics/trubrics";
import getSecrets from "./secrets";

type TrubricsConfig = {
    apiKey: string;
}

// get trubrics key from backend
const secrets = await getSecrets();

console.log(secrets);

const config: TrubricsConfig = {
    apiKey: secrets.TRUBRICS_API_KEY
}

const trubrics = new Trubrics(config);

const logToTrubrics = async (prompt: string, response: any, email: string, thread_id: string) => {
    console.log(prompt, response, email);
    try {
        trubrics.track(
            {
                event: "Generation",
                user_id: email,
                properties: {
                    $thread_id: thread_id,
                    prompt: prompt,
                    response: response,
                    source: "Workmate"
                }
            }
        );
    } catch (error) {
        console.error("Error logging to Trubrics:", error);
    }
}

export default logToTrubrics;


