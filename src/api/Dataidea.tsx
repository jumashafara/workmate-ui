import getSecrets from "./secrets";

const secrets = await getSecrets();

console.log(secrets.DATAIDEA_API_KEY);

const logToDATAIDEA = async (prompt: string, response: any, email: string, thread_id: string) => {
    const dataidea_api_key = secrets.DATAIDEA_API_KEY;

    const data = {
        'api_key': dataidea_api_key,
        'project_name': 'Workmate',
        'user_id': email,
        'source': 'workmate',
        'query': prompt,
        'response': response,
        'metadata': {'thread_id': thread_id}
    }

    fetch('https://loggerapi.dataidea.org/api/llm-log/', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    )

}

export default logToDATAIDEA;


