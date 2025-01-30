class ApiService {
    constructor() {
        this.baseUrl = 'https://your-api-endpoint.com'; // Change this to your API endpoint
        this.isTestMode = true; // Add this line
    }

    async sendExtensionData(data) {
        if (this.isTestMode) {
            console.log('API call skipped (test mode):', data);
            return { success: true };
        }
        try {
            const response = await fetch(`${this.baseUrl}/extensions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}

export const apiService = new ApiService(); 