
const CACHE_PREFIX = 'home_cache_';
const DEFAULT_TTL = 5 * 60 * 1000;


const getCacheKey = (route, params = {}) => {
    const paramsStr = Object.keys(params)
        .sort()
        .map(key => `${key}:${params[key]}`)
        .join('|');
    return `${CACHE_PREFIX}${route}${paramsStr ? `_${paramsStr}` : ''}`;
};

export const getCachedData = (route, params = {}) => {
    try {
        const cacheKey = getCacheKey(route, params);
        const cached = localStorage.getItem(cacheKey);

        if (!cached) return null;

        const { data, timestamp, ttl } = JSON.parse(cached);
        const now = Date.now();
        const age = now - timestamp;

        if (age > ttl) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
};

export const setCachedData = (route, data, params = {}, ttl = DEFAULT_TTL) => {
    try {
        const cacheKey = getCacheKey(route, params);
        const cacheEntry = {
            data,
            timestamp: Date.now(),
            ttl
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    } catch (error) {
        console.error('Error writing cache:', error);
        try {
            clearExpiredCache();
            const cacheKey = getCacheKey(route, params);
            const cacheEntry = {
                data,
                timestamp: Date.now(),
                ttl
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
        } catch (retryError) {
            console.error('Error retrying cache write:', retryError);
        }
    }
};

export const clearCache = (route, params = {}) => {
    try {
        const cacheKey = getCacheKey(route, params);
        localStorage.removeItem(cacheKey);
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
};

export const clearAllHomeCache = () => {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.error('Error clearing all cache:', error);
    }
};


export const clearExpiredCache = () => {
    try {
        const keys = Object.keys(localStorage);
        const now = Date.now();

        keys.forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                try {
                    const cached = localStorage.getItem(key);
                    if (cached) {
                        const { timestamp, ttl } = JSON.parse(cached);
                        if (now - timestamp > ttl) {
                            localStorage.removeItem(key);
                        }
                    }
                } catch (error) {
                    localStorage.removeItem(key);
                }
            }
        });
    } catch (error) {
        console.error('Error clearing expired cache:', error);
    }
};

export const fetchWithCache = async (route, fetchFn, params = {}, ttl = DEFAULT_TTL) => {
    if (Math.random() < 0.1) {
        clearExpiredCache();
    }

    const cached = getCachedData(route, params);
    if (cached !== null) {
        return cached;
    }

    const data = await fetchFn();

    setCachedData(route, data, params, ttl);

    return data;
};


if (typeof window !== 'undefined') {
    clearExpiredCache();
}

