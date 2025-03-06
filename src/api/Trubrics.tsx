import { Trubrics } from "@trubrics/trubrics";

type TrubricsConfig = {
    apiKey: string;
}

const config: TrubricsConfig = {
    apiKey: "TCBrEXtYK2V08gxMYPNqemwI7sNVWLWdSHXBykz61zWnL6iU5j-tFviJdf-Cw7Yx",
}

const trubrics = new Trubrics(config);

const logToTrubrics = async (prompt: string, response: any, email: string) => {
    console.log(prompt, response, email);
    trubrics.track(
        {
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


