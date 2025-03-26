import { Trubrics } from "@trubrics/trubrics";
import getSecrets from "./secrets";

type TrubricsConfig = {
    apiKey: string;
}

const logToTrubrics = async (prompt: string, response: any, email: string, thread_id: string) => {

    const secrets = await getSecrets()

    const config: TrubricsConfig = {
        apiKey: secrets.TRUBRICS_API_KEY
    }
    
    const trubrics = new Trubrics(config);
    
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


