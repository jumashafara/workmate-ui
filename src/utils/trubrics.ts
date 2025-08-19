import { Trubrics } from "@trubrics/trubrics";

type TrubricsConfig = {
    apiKey: string;
}

const config: TrubricsConfig = {
    apiKey: process.env.NEXT_PUBLIC_TRUBRICS_API_KEY || "",
}

const trubrics = new Trubrics(config);

const logToTrubrics = async (prompt: string, response: any, email: string) => {
    trubrics.track({
        event: "Generation",
        user_id: email,
        properties: {
            prompt: prompt,
            response: response,
            source: "Workmate"
        }
    });
}

export default logToTrubrics;