// 시나리오 B — 콘텐츠 조회 폭증 (A-1 피드 최적화 측정용)
// 기존 시나리오(A/D/E)는 Content를 전혀 때리지 않아 별도 추가.
// 목적: N+1 제거·커서 페이징·첫 페이지 캐시의 before/after 효과 측정.
// 지표: p95/p99 latency, 첫 페이지(캐시 후보) vs 깊은 페이지(DB) 대비.

import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';
import http from 'k6/http';

import { get, BASE_URL } from '../lib/http.js';
import { tokens } from '../lib/pool.js';

http.setResponseCallback(http.expectedStatuses({ min: 200, max: 299 }));

export const options = {
  scenarios: {
    content_read: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 50 },
        { duration: '10s', target: 800 },
        { duration: '3m', target: 800 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

// 첫 페이지(캐시 후보)와 깊은 페이지(DB)의 latency를 분리 측정
const firstPageLatency = new Trend('content_first_page_latency', true);
const deepPageLatency = new Trend('content_deep_page_latency', true);
const errorBuckets = new Counter('content_errors_by_endpoint');

const STYLE_SIZE = 12;
const SHORT_SIZE = 10;

// 가중치 — 첫 페이지에 트래픽 집중(캐시 효과 측정), 일부만 커서 따라 깊은 페이지
const ENDPOINTS = [
  { name: 'style-feeds:first', weight: 35 },
  { name: 'style-feeds:deep', weight: 15 },
  { name: 'short-forms:first', weight: 30 },
  { name: 'short-forms:type', weight: 20 },
];

function pickEndpoint() {
  const total = ENDPOINTS.reduce((s, e) => s + e.weight, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const e of ENDPOINTS) {
    acc += e.weight;
    if (r < acc) return e.name;
  }
  return ENDPOINTS[0].name;
}

// 응답에서 nextCursor 추출 (다음 페이지 요청용)
function nextCursorOf(res) {
  try {
    return JSON.parse(res.body)?.data?.nextCursor ?? null;
  } catch (e) {
    return null;
  }
}

export function setup() {
  console.log(`[scenario-B] BASE_URL=${BASE_URL}, 토큰 풀=${tokens.length}`);
}

export default function () {
  const token = tokens[(__VU - 1) % tokens.length];
  const accessToken = token.accessToken;
  const endpoint = pickEndpoint();

  let res;
  let isFirstPage = true;

  switch (endpoint) {
    case 'style-feeds:first':
      res = get(`/content/style-feeds?size=${STYLE_SIZE}`, accessToken);
      break;
    case 'style-feeds:deep': {
      // 첫 페이지로 커서 확보 후 다음 페이지 조회 (DB 경로)
      const head = get(`/content/style-feeds?size=${STYLE_SIZE}`, accessToken);
      const cursor = nextCursorOf(head);
      if (cursor == null) { res = head; break; }
      isFirstPage = false;
      res = get(`/content/style-feeds?size=${STYLE_SIZE}&cursor=${cursor}`, accessToken);
      break;
    }
    case 'short-forms:first':
      res = get(`/content/short-forms?size=${SHORT_SIZE}`, accessToken);
      break;
    case 'short-forms:type':
      res = get(`/content/short-forms?size=${SHORT_SIZE}&type=PRODUCT_LIST`, accessToken);
      break;
  }

  // 13번 줄 expectedStatuses(2xx)와 기준 일치 — 성공 응답만 latency에 집계
  const ok = check(res, { 'status 2xx': (r) => r.status >= 200 && r.status < 300 });
  if (ok) {
    if (isFirstPage) firstPageLatency.add(res.timings.duration);
    else deepPageLatency.add(res.timings.duration);
  } else {
    // 실패는 status 태그로 분리 — latency 분포 오염 방지
    errorBuckets.add(1, { endpoint, status: res.status });
  }

  sleep(Math.random() * 0.5);
}
