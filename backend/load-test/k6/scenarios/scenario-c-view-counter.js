// 시나리오 C — 상품 조회수 카운터 집중 (조회수 고도화 측정용)
// 인기 상품 1개에 조회(POST view)를 몰아넣어 카운터 쓰기 경합을 유발.
// 목적: counter-mode=db(조회마다 DB 직접 +1, 행 락 경합) vs redis(INCR, 락 없음) 대비.
// 운영법: 백엔드 product.view.counter-mode 를 db / redis 로 바꿔가며 2회 측정 후 비교.
// 지표: TPS(iterations), p99 latency. (DB write 횟수·락 대기는 서버 Prometheus/Hibernate 통계로 관측)

import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import http from 'k6/http';

import { post, BASE_URL } from '../lib/http.js';
import { tokens } from '../lib/pool.js';

http.setResponseCallback(http.expectedStatuses({ min: 200, max: 299 }));

// 경합을 보려고 단일 인기 상품에 집중 (모든 VU가 같은 row/key를 때림)
const HOT_PRODUCT_ID = __ENV.HOT_PRODUCT_ID || '1';

export const options = {
  scenarios: {
    view_counter: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 100 },
        { duration: '10s', target: 1000 },
        { duration: '3m', target: 1000 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(99)<1000'],
  },
};

const viewErrors = new Counter('view_counter_errors');

export function setup() {
  console.log(`[scenario-C] BASE_URL=${BASE_URL}, 핫상품=product/${HOT_PRODUCT_ID}, 토큰 풀=${tokens.length}`);
}

export default function () {
  // view 엔드포인트는 공개(permitAll)지만 헤더 일관성 위해 토큰 부착
  const accessToken = tokens[(__VU - 1) % tokens.length].accessToken;

  // 단일 인기 상품에 조회수 몰빵 — 카운터 쓰기 경합 집중
  const res = post(`/products/${HOT_PRODUCT_ID}/view`, accessToken, {});

  const ok = check(res, { 'status < 500': (r) => r.status < 500 });
  if (!ok) viewErrors.add(1);

  sleep(Math.random() * 0.3);
}
