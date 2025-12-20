const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Determine the caching strategy to avoid Next.js warnings
    const fetchOptions: any = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // If cache is explicitly set to 'no-store', don't add revalidate
    if (options.cache !== 'no-store') {
        fetchOptions.next = { revalidate: 60, ...options.next };
    }

    const res = await fetch(`${API_URL}${endpoint}`, fetchOptions);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.pickup_datetime || 'API Error');
    }

    if (res.status === 204) return null;
    return await res.json();
  } catch (error: any) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

export const getSiteContent = async () => {
    try {
        return await fetchAPI('/site-content/', { cache: 'no-store' } as any);
    } catch (err) {
        console.error("Failed to fetch site content", err);
        return null;
    }
};
