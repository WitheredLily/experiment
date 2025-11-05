var reportWebVitals = function (onPerfEntry) {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import("web-vitals").then(function (_a) {
            var onCLS = _a.onCLS, onINP = _a.onINP, onFCP = _a.onFCP, onLCP = _a.onLCP, onTTFB = _a.onTTFB;
            onCLS(onPerfEntry);
            onINP(onPerfEntry);
            onFCP(onPerfEntry);
            onLCP(onPerfEntry);
            onTTFB(onPerfEntry);
        });
    }
};
export default reportWebVitals;
