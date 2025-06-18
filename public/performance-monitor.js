// Modern Performance Monitor - 2024 Edition
(function() {
  'use strict';

  // Modern performance metrics tracking
  const metrics = {
    fcp: null,
    lcp: null,
    fid: null,
    inp: null,
    cls: null,
    ttfb: null,
    tbt: null
  };

  // Modern performance observer with latest metrics
  function observePerformance() {
    try {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime;
            console.log('FCP:', entry.startTime + 'ms');
          }
        }
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;
        console.log('LCP:', lastEntry.startTime + 'ms');
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Interaction to Next Paint (modern replacement for FID)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.interactionId) continue;
          metrics.inp = Math.max(metrics.inp || 0, entry.duration);
          console.log('INP:', entry.duration + 'ms');
        }
      }).observe({ type: 'event', buffered: true });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        metrics.cls = clsValue;
        console.log('CLS:', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.responseStart > 0) {
            metrics.ttfb = entry.responseStart;
            console.log('TTFB:', entry.responseStart + 'ms');
          }
        }
      }).observe({ entryTypes: ['navigation'] });

      // Modern Total Blocking Time calculation
      let totalBlockingTime = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            totalBlockingTime += entry.duration - 50;
          }
        }
        metrics.tbt = totalBlockingTime;
        console.log('TBT:', totalBlockingTime + 'ms');
      }).observe({ entryTypes: ['longtask'] });

    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }

  // Modern performance reporting
  function reportMetrics() {
    const report = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: { ...metrics },
      grade: calculateGrade()
    };

    console.group('🚀 Performance Report');
    console.log('📊 Core Web Vitals:', {
      'FCP': metrics.fcp ? `${metrics.fcp.toFixed(1)}ms` : 'N/A',
      'LCP': metrics.lcp ? `${metrics.lcp.toFixed(1)}ms` : 'N/A',
      'INP': metrics.inp ? `${metrics.inp.toFixed(1)}ms` : 'N/A',
      'CLS': metrics.cls ? metrics.cls.toFixed(3) : 'N/A',
      'TTFB': metrics.ttfb ? `${metrics.ttfb.toFixed(1)}ms` : 'N/A',
      'TBT': metrics.tbt ? `${metrics.tbt.toFixed(1)}ms` : 'N/A'
    });
    console.log('⭐ Performance Grade:', report.grade);
    console.groupEnd();

    return report;
  }

  // Modern performance grading
  function calculateGrade() {
    let score = 100;
    
    // FCP grading (good: <1.8s, needs improvement: <3s)
    if (metrics.fcp > 3000) score -= 20;
    else if (metrics.fcp > 1800) score -= 10;
    
    // LCP grading (good: <2.5s, needs improvement: <4s)
    if (metrics.lcp > 4000) score -= 25;
    else if (metrics.lcp > 2500) score -= 15;
    
    // INP grading (good: <200ms, needs improvement: <500ms)
    if (metrics.inp > 500) score -= 20;
    else if (metrics.inp > 200) score -= 10;
    
    // TBT grading (good: <200ms, needs improvement: <600ms)
    if (metrics.tbt > 600) score -= 25;
    else if (metrics.tbt > 200) score -= 15;
    
    // CLS grading (good: <0.1, needs improvement: <0.25)
    if (metrics.cls > 0.25) score -= 15;
    else if (metrics.cls > 0.1) score -= 5;

    if (score >= 90) return 'A+ (Excellent)';
    if (score >= 80) return 'A (Good)';
    if (score >= 70) return 'B (Needs Improvement)';
    return 'C (Poor)';
  }

  // Modern initialization
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observePerformance);
    } else {
      observePerformance();
    }

    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(reportMetrics, 2000);
    });

    // Expose global function for manual reporting
    window.reportPerformanceMetrics = reportMetrics;
  }

  // Start monitoring
  init();

  console.log('✅ Modern Performance Monitor initialized');
})(); 