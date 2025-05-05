
// Simple performance monitoring utilities

// Basic metrics storage
type Metrics = {
  apiCalls: {
    [endpoint: string]: {
      count: number;
      totalTime: number;
      successes: number;
      failures: number;
      lastCallTime?: number;
    };
  };
  renders: {
    [component: string]: {
      count: number;
      totalTime: number;
      lastRenderTime?: number;
    };
  };
  navigation: {
    [route: string]: {
      visits: number;
      loadTime: number;
    };
  };
};

// Initialize metrics storage
const metrics: Metrics = {
  apiCalls: {},
  renders: {},
  navigation: {},
};

// Track API call performance
export function trackApiCall(endpoint: string, startTime: number, success: boolean) {
  const duration = performance.now() - startTime;
  
  if (!metrics.apiCalls[endpoint]) {
    metrics.apiCalls[endpoint] = {
      count: 0,
      totalTime: 0,
      successes: 0,
      failures: 0,
    };
  }
  
  const endpointMetrics = metrics.apiCalls[endpoint];
  endpointMetrics.count++;
  endpointMetrics.totalTime += duration;
  endpointMetrics.lastCallTime = Date.now();
  
  if (success) {
    endpointMetrics.successes++;
  } else {
    endpointMetrics.failures++;
  }
  
  // Log for development
  if (process.env.NODE_ENV === 'development') {
    console.debug(`API Call to ${endpoint}: ${duration.toFixed(2)}ms, success: ${success}`);
  }
}

// Track component render performance
export function trackRender(component: string, startTime: number) {
  const duration = performance.now() - startTime;
  
  if (!metrics.renders[component]) {
    metrics.renders[component] = {
      count: 0,
      totalTime: 0,
    };
  }
  
  const renderMetrics = metrics.renders[component];
  renderMetrics.count++;
  renderMetrics.totalTime += duration;
  renderMetrics.lastRenderTime = Date.now();
  
  // Log slow renders in development
  if (process.env.NODE_ENV === 'development' && duration > 16) { // 16ms = 60fps threshold
    console.warn(`Slow render for ${component}: ${duration.toFixed(2)}ms`);
  }
}

// Track page navigation
export function trackNavigation(route: string, loadTime: number) {
  if (!metrics.navigation[route]) {
    metrics.navigation[route] = {
      visits: 0,
      loadTime: 0,
    };
  }
  
  const navMetrics = metrics.navigation[route];
  navMetrics.visits++;
  navMetrics.loadTime += loadTime;
}

// Get performance report
export function getPerformanceReport() {
  return {
    apiCalls: Object.entries(metrics.apiCalls).map(([endpoint, data]) => ({
      endpoint,
      calls: data.count,
      avgTime: data.count > 0 ? data.totalTime / data.count : 0,
      successRate: data.count > 0 ? (data.successes / data.count) * 100 : 0,
      lastCallTime: data.lastCallTime,
    })),
    slowestComponents: Object.entries(metrics.renders)
      .map(([component, data]) => ({
        component,
        renders: data.count,
        avgTime: data.count > 0 ? data.totalTime / data.count : 0,
        lastRenderTime: data.lastRenderTime,
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 5),
    mostVisitedRoutes: Object.entries(metrics.navigation)
      .map(([route, data]) => ({
        route,
        visits: data.visits,
        avgLoadTime: data.visits > 0 ? data.loadTime / data.visits : 0,
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5),
  };
}

// Reset metrics (e.g., for testing)
export function resetMetrics() {
  metrics.apiCalls = {};
  metrics.renders = {};
  metrics.navigation = {};
}
