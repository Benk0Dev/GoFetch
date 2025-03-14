export async function get(endpoint: string): Promise<any> {
    try {
        const response = await fetch(`http://localhost:3001${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}