import { Trubrics } from "@trubrics/trubrics";

type TrubricsConfig = {
    apiKey: string;
}

const config: TrubricsConfig = {
    apiKey: import.meta.env.VITE_TRUBRICS_API_KEY,
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


