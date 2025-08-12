// Fallback Trubrics implementation without external dependency
const logToTrubrics = async (prompt: string, response: any, email: string, thread_id: string) => {
    try {
        console.log('Trubrics tracking (fallback):', {
            event: "Generation",
            user_id: email,
            thread_id: thread_id,
            prompt: prompt.substring(0, 100),
            response: typeof response === 'string' ? response.substring(0, 100) : response,
            source: "Workmate"
        });
    } catch (error) {
        console.error("Error logging to Trubrics:", error);
    }
}

export default logToTrubrics;


