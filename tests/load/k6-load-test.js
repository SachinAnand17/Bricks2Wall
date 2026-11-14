import http from 'k6/http';
import { check, sleep, group } from 'k6';

// Performance Acceptance Thresholds:
// p95 latency under 500ms for cached/read endpoints, under 1000ms for search, error rate < 1%
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to normal peak load (20 concurrent users)
    { duration: '1m', target: 20 },   // Sustain normal peak
    { duration: '30s', target: 50 },  // 2x burst stress load (50 concurrent users)
    { duration: '1m', target: 50 },   // Sustain 2x burst
    { duration: '30s', target: 0 },   // Ramp down gracefully
  ],
  thresholds: {
    'http_req_duration{type:read}': ['p(95)<500'],  // 95% of reads must be under 500ms
    'http_req_duration{type:search}': ['p(95)<1000'], // 95% of search queries under 1000ms
    'http_req_failed': ['rate<0.01'],               // Error rate < 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  group('1. Homepage & Discovery', function () {
    const res = http.get(`${BASE_URL}/`, {
      tags: { type: 'read' },
    });
    check(res, {
      'homepage status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
  });

  sleep(1);

  group('2. Property Search & Filtering', function () {
    const res = http.get(`${BASE_URL}/api/properties?type=buy&bedrooms=2&locality=North%20Greens`, {
      tags: { type: 'search' },
    });
    check(res, {
      'search status is 200': (r) => r.status === 200,
      'returns properties count': (r) => JSON.parse(r.body).count >= 0,
    });
  });

  sleep(1);

  group('3. Property Detail Page', function () {
    const res = http.get(`${BASE_URL}/properties/demo-contemporary-2-bed-residence`, {
      tags: { type: 'read' },
    });
    check(res, {
      'detail page status is 200': (r) => r.status === 200,
      'content contains title': (r) => r.body.includes('DEMO — Contemporary 2-Bed Residence'),
    });
  });

  sleep(2);

  group('4. Lead Submission Transaction', function () {
    const payload = JSON.stringify({
      name: `K6 Load Tester ${__VU}`,
      email: `tester-${__VU}@loadtest.local`,
      phone: '9876543210',
      enquiryType: 'general',
      message: 'Automated k6 resilience test inquiry',
      source: 'k6_load_test',
      consent: true,
    });

    const params = {
      headers: { 'Content-Type': 'application/json' },
      tags: { type: 'write' },
    };

    const res = http.post(`${BASE_URL}/api/leads`, payload, params);
    check(res, {
      'lead created status is 200': (r) => r.status === 200,
      'lead id returned': (r) => JSON.parse(r.body).success === true,
    });
  });

  sleep(2);
}
