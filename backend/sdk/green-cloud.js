/**
 * Green Cloud SDK - Embeddable Data Center Recommendation
 * 
 * Usage:
 *   <script src="https://your-api-domain.com/sdk/green-cloud.js"></script>
 *   <script>
 *     GreenCloud.recommend("https://myapp.com").then(result => {
 *       console.log(result.recommendedDataCenter);
 *     });
 *   </script>
 */
(function () {
    "use strict";

    // Auto-detect API base URL from the <script> tag's src attribute
    var scriptTag = document.currentScript;
    var apiBase = "";

    if (scriptTag && scriptTag.src) {
        // e.g. "https://api.example.com/sdk/green-cloud.js" → "https://api.example.com"
        apiBase = scriptTag.src.replace(/\/sdk\/green-cloud\.js.*$/, "");
    }

    /**
     * Measures latency (RTT) to a target URL using a HEAD request.
     * Uses a warm-up ping followed by a timed ping.
     */
    async function measureLatency(url) {
        if (!url) return 9999;
        var cleanUrl = url.endsWith("/") ? url.slice(0, -1) : url;

        try {
            var controller = new AbortController();
            var timeout = setTimeout(function () { controller.abort(); }, 5000);

            // Warm-up request
            await fetch(cleanUrl, { method: "HEAD", mode: "no-cors", cache: "no-store", signal: controller.signal });

            // Timed request
            var start = performance.now();
            await fetch(cleanUrl, { method: "HEAD", mode: "no-cors", cache: "no-store", signal: controller.signal });
            var end = performance.now();

            clearTimeout(timeout);
            return Math.round(end - start);
        } catch (e) {
            return 9999;
        }
    }

    window.GreenCloud = {
        /**
         * Override the auto-detected API base URL.
         * @param {string} url - e.g. "https://api.example.com"
         */
        setApiBase: function (url) {
            apiBase = url.replace(/\/+$/, "");
        },

        /**
         * Get the optimal data center recommendation for an application URL.
         * Performs client-side latency measurement and returns the best region.
         *
         * @param {string} applicationUrl - The app URL saved in Green Cloud
         * @returns {Promise<Object>} Recommendation result with recommendedDataCenter, allRegions, carbonSavings
         */
        recommend: async function (applicationUrl) {
            if (!applicationUrl) {
                throw new Error("GreenCloud: applicationUrl is required");
            }

            // Step 1: Get regions to ping from the API
            var regionsUrl = apiBase + "/api/recommend/regions?url=" + encodeURIComponent(applicationUrl);
            var regionsRes = await fetch(regionsUrl);

            if (!regionsRes.ok) {
                var errData = await regionsRes.json().catch(function () { return {}; });
                throw new Error("GreenCloud: " + (errData.error || "Failed to fetch regions"));
            }

            var regionsData = await regionsRes.json();
            var regions = regionsData.regions;

            // Step 2: Measure latency to each region from the user's browser
            var latencies = await Promise.all(
                regions.map(async function (region) {
                    var latency = await measureLatency(region.pingUrl);
                    return { regionCode: region.regionCode, latency: latency };
                })
            );

            // Step 3: Send latencies to the API and get recommendation
            var decideUrl = apiBase + "/api/recommend/decide";
            var decideRes = await fetch(decideUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    applicationUrl: applicationUrl,
                    latencies: latencies,
                }),
            });

            if (!decideRes.ok) {
                var decideErr = await decideRes.json().catch(function () { return {}; });
                throw new Error("GreenCloud: " + (decideErr.error || "Failed to get recommendation"));
            }

            return decideRes.json();
        },

        /**
         * Get recommendation AND redirect the user to the best server.
         * Calls recommend() internally, then uses the API's targetServerUrl
         * or a local serverMap to redirect.
         *
         * @param {string} applicationUrl - The registered app URL
         * @param {Object} [options] - Config options
         * @param {Object} [options.serverMap] - Manual override: { "region-code": "http://server-url" }
         * @param {string} [options.fallbackUrl] - URL to redirect to if routing fails
         * @returns {Promise<Object>} The recommendation result (redirect happens automatically)
         */
        route: async function (applicationUrl, options) {
            var opts = options || {};
            var fallback = opts.fallbackUrl || null;
            var localServerMap = opts.serverMap || null;

            try {
                var result = await this.recommend(applicationUrl);
                var regionId = result.recommendedDataCenter.id;

                // Priority: API-provided targetServerUrl > local serverMap > fallback
                var targetUrl = result.targetServerUrl
                    || (localServerMap && localServerMap[regionId])
                    || fallback;

                if (targetUrl) {
                    window.location.href = targetUrl;
                } else {
                    console.warn("GreenCloud: No server URL found for region " + regionId);
                    if (fallback) window.location.href = fallback;
                }

                return result;
            } catch (err) {
                console.error("GreenCloud routing error:", err);
                if (fallback) window.location.href = fallback;
                throw err;
            }
        },
    };
})();
