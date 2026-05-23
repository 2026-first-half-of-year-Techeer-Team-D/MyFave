# 부하 테스트 결과 — 시나리오 A v1-baseline (2026-05-22)

> 사용법: 파일 복사 후 `{}` 부분을 채우세요.
> 파일명 규칙: `scenario-{d|a|e}_{vN-변경요약}_{YYYY-MM-DD}.md`

## 1. 메타데이터

| 항목 | 값 |
|---|---|
| 시나리오 | {D / A / E} |
| 버전 | {v1-baseline} |
| 측정일시 | {YYYY-MM-DD HH:MM KST} |
| 측정자 | {이름} |
| 백엔드 commit | `{git rev-parse HEAD 결과}` |
| EC2 사양 | {t3.medium 4GB} |
| 변경 사항 | {baseline / Hikari 50→100 / products.user_id 인덱스 추가 / ...} |
| 이전 버전 대비 차이 | {링크 또는 한 줄 요약} |

## 2. 환경 (변경 시에만 갱신)

| 항목 | 값 |
|---|---|
| Spring profile | loadtest |
| Hikari max pool | {50} |
| Tomcat threads max | {400} |
| JVM heap | {기본값 / -Xms2g -Xmx2g} |
| 모니터링 컨테이너 | {down / 일부 켜둠 — 어떤 거 켜뒀는지} |
| 시드 유저 | 1000 (loadtest1~1000@myfave.test) |
| 시드 상품 | {10개 × stock 1 / 변경 시 표시} |
| Mock 적용 | MockPortOnePaymentProvider |

## 3. k6 핵심 지표

| 지표 | 단위 | 값 |
|---|---|---|
| iterations | count | |
| 총 요청 (http_reqs) | count | |
| RPS | req/s | |
| http_req_failed | % | |
| status<500 비율 | % | |
| 5xx 건수 | count | |
| http_req_duration avg | ms | |
| http_req_duration p50 | ms | |
| http_req_duration p90 | ms | |
| http_req_duration p95 | ms | |
| http_req_duration p99 | ms | |
| http_req_duration max | ms | |
| iteration_duration avg | ms | |
| iteration_duration p95 | ms | |
| network data_received | MB | |
| network data_sent | MB | |
| 임계치 통과 | 통과 / 실패 | |

## 4. 시나리오별 커스텀 카운터

### 시나리오 D만

| 카운터 | 값 | 목표 |
|---|---|---|
| soldout_confirm_success | | ≤ 10 |
| soldout_oversell_detected | | == 0 |
| soldout_order_created | | |
| soldout_order_failed_soldout | | |
| soldout_order_failed_other | | |
| soldout_error_rate | % | |

### 시나리오 A만

| 카운터 | 값 |
|---|---|
| spike_first10s_latency avg | |
| spike_first10s_latency p95 | |
| spike_errors_by_endpoint | (각 endpoint 분포) |

### 시나리오 E만

| 카운터 | 값 | 목표 |
|---|---|---|
| chat_connect_failed | | < 10 |
| chat_messages_received | | > 0 |
| chat_messages_sent | | |
| chat_subscribe_ms avg | | |
| chat_subscribe_ms p95 | | |

## 5. DB 트랜잭션 통계

```sql
SELECT xact_commit, xact_rollback, deadlocks FROM pg_stat_database WHERE datname='myfave';
```

| 지표 | 시작 전 | 끝난 후 | 증가량 |
|---|---|---|---|
| xact_commit | | | +{} |
| xact_rollback | | | +{} |
| deadlocks | | | +{} |

**계산**:
- 트랜잭션/요청 비율: {(commit_diff + rollback_diff) / http_reqs}
- rollback 비율: {rollback_diff / (commit_diff + rollback_diff) * 100}%

## 6. DB 상태 (시나리오 끝난 후)

### 상품 stock (모든 시나리오)

```sql
SELECT product_id, stock_quantity, is_soldout FROM products WHERE product_id <= 10 ORDER BY product_id;
SELECT SUM(stock_quantity) AS remaining_stock, COUNT(CASE WHEN is_soldout THEN 1 END) AS sold_out_count FROM products WHERE product_id <= 10;
```

| product_id | stock_quantity | is_soldout |
|---|---|---|
| 1 | | |
| ... | | |

- remaining_stock 합계: {}
- sold_out_count: {}

### 시나리오 A 추가

```sql
SELECT order_status, COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '30 minutes' GROUP BY order_status;
SELECT payment_status, COUNT(*) FROM payments WHERE created_at > NOW() - INTERVAL '30 minutes' GROUP BY payment_status;
```

| order_status | count |
|---|---|
| | |

| payment_status | count |
|---|---|
| | |

### 시나리오 E 추가

```sql
SELECT COUNT(*) FROM chat_messages WHERE created_at > NOW() - INTERVAL '10 minutes';
SELECT chat_room_id, COUNT(*) FROM chat_messages WHERE created_at > NOW() - INTERVAL '10 minutes' GROUP BY chat_room_id;
```

- 메시지 수: {}
- chat_room 분포: {}

## 7. 오버셀 검증 (시나리오 D 필수)

```sql
SELECT p.product_id, COUNT(*) AS paid_count 
FROM order_items oi 
JOIN orders o ON oi.orders_id = o.orders_id 
JOIN products p ON oi.products_id = p.product_id 
WHERE o.order_status = 'PAID' 
  AND p.product_id <= 10 
  AND o.created_at > NOW() - INTERVAL '10 minutes' 
GROUP BY p.product_id 
ORDER BY p.product_id;
```

| product_id | paid_count | 정상? |
|---|---|---|
| 1 | | (1이어야 정상) |
| ... | | |

결과: {모든 product_id가 paid_count=1 → 오버셀 X / 오버셀 발견}

## 8. 운영 EC2 시스템 리소스

| 시점 | Mem total | used | available | swap used |
|---|---|---|---|---|
| 시작 전 | | | | |
| 부하 중 피크 | | | | |
| 끝난 후 | | | | |

### 컨테이너 메모리 (docker stats)

| 컨테이너 | idle 시 | 부하 중 피크 |
|---|---|---|
| myfave-app | | |
| myfave-postgres | | |
| myfave-redis | | |

## 9. Grafana 대시보드 스크린샷

> 모든 스크린샷은 같은 시간 윈도우(부하 시작 5초 전 ~ 부하 끝 30초 후)로 캡처.
> 파일명: `{scenario}_{version}_{graph-name}.png` (예: `d_v1_jvm-heap.png`)

| # | 그래프 | 파일명 | 캡처 완료 |
|---|---|---|---|
| 1 | HTTP 요청 RPS | {}_{}_rps.png | [ ] |
| 2 | HTTP latency (p50/p95/p99) | {}_{}_latency.png | [ ] |
| 3 | HTTP 응답 코드 분포 (2xx/4xx/5xx) | {}_{}_status.png | [ ] |
| 4 | JVM Heap 사용량 | {}_{}_jvm-heap.png | [ ] |
| 5 | JVM GC pause 시간 | {}_{}_gc.png | [ ] |
| 6 | Hikari 활성 커넥션 | {}_{}_hikari.png | [ ] |
| 7 | Tomcat 스레드 사용량 | {}_{}_tomcat.png | [ ] |
| 8 | DB connections | {}_{}_db-conn.png | [ ] |
| 9 | 백엔드 CPU 사용률 | {}_{}_cpu.png | [ ] |
| 10 | 백엔드 메모리 사용률 | {}_{}_memory.png | [ ] |
| 11 | (E만) 활성 WS 세션 수 | {}_{}_ws-sessions.png | [ ] |
| 12 | (E만) chat broadcast latency | {}_{}_broadcast.png | [ ] |

## 9-A. Monitor 폴링 시계열 통계 (수치 추출)

> `collect-results.sh ... monitor` + `analyze-monitor.sh` 결과.
> 자동 생성된 표는 보고서 맨 아래(`generate-report.sh` 출력)에 추가됨.

### HTTP & 백엔드 처리량 (Actuator metrics)

| 메트릭 | avg | peak | 비고 |
|---|---|---|---|
| http_server_requests RPS | | | |
| Tomcat busy threads | | | 한계 400 |
| Tomcat connections | | | |

### JVM (백엔드 메모리)

| 메트릭 | idle | peak | after GC | 비고 |
|---|---|---|---|---|
| Heap used | | | | |
| GC pause max (ms) | | | | |
| GC count (per min) | | | | |

### Connection Pool (Hikari)

| 메트릭 | peak | 한계 | 도달률 |
|---|---|---|---|
| hikari active | | 50 | % |
| hikari pending | | - | (>0이면 풀 부족) |

### DB 락 (peak)

| 락 종류 | peak | 정상? |
|---|---|---|
| AccessShareLock | | |
| RowExclusiveLock | | |
| ExclusiveLock | | |
| AccessExclusiveLock | | 0이어야 정상 |
| 그 외 | | |

### DB 활동

| 메트릭 | peak |
|---|---|
| pg_stat_activity active | |
| pg_stat_activity idle | |
| pg_stat_activity idle in transaction | |

### 시스템 (운영 EC2)

| 메트릭 | avg | peak |
|---|---|---|
| 백엔드 컨테이너 CPU | | |
| 백엔드 컨테이너 Memory | | |
| 시스템 load avg (1m) | | |
| 시스템 Mem available | | |

### Transaction rate (계산)

| 메트릭 | 값 |
|---|---|
| 모니터링 기간 (초) | |
| commit rate avg (per sec) | |
| rollback rate avg (per sec) | |
| commit/rollback 비율 | |

## 10. 백엔드 ERROR/WARN 로그 (선택)

```bash
sudo docker logs myfave-app --since "10 minutes ago" 2>&1 | grep -i -E "error|exception|warn" | tail -100
```

| 로그 종류 | 건수 | 비고 |
|---|---|---|
| ERROR | {} | {주요 종류} |
| WARN | {} | {주요 종류} |

## 11. 임계치 통과/실패 요약

| 임계치 | 목표 | 실제 | 결과 |
|---|---|---|---|
| | | | ✅/❌ |

## 12. 검증된 동작

- [ ] {} (예: PESSIMISTIC 락이 정확히 9~10건만 통과)
- [ ] {} (예: 오버셀 0건)
- [ ] {} (예: 데드락 0건)
- [ ] {} (예: 5xx 0.x%)

## 13. 발견 / 개선 포인트

### 이번 라운드에서 발견한 것
- {}

### 다음 라운드에 적용할 변경
- {} (예: Hikari pool 50→100)
- {} (예: products.user_id 인덱스 추가)

### 회고/추측 메모
- {}

## 14. 이전 버전 대비 차이 (v1 외 버전부터)

| 항목 | v{N-1} | v{N} | 변화 |
|---|---|---|---|
| RPS | | | |
| p95 latency | | | |
| 5xx 비율 | | | |
| rollback 비율 | | | |
| deadlocks | | | |

## 15. 첨부 — 자동 수집 결과

`scripts/collect-results.sh` 출력 폴더 경로:

```
~/loadtest-results/{scenario}_{version}_{date}/
  ├── before/
  │   ├── tx_stats.txt
  │   ├── stock.txt
  │   ├── memory.txt
  │   └── docker_stats.txt
  ├── after/
  │   ├── tx_stats.txt
  │   ├── stock.txt
  │   ├── order_status.txt
  │   ├── payment_status.txt
  │   ├── oversell_check.txt
  │   ├── memory.txt
  │   └── docker_stats.txt
  └── k6_output.txt
```

---

# 📊 자동 첨부 자료

이 아래는 `generate-report.sh` 가 자동 첨부한 raw 데이터입니다.
위 섹션의 표는 본 자료를 보고 직접 채우세요.

## A. 자동 추출 메타정보

| 항목 | 값 |
|---|---|
| 시나리오 | a |
| 버전 | v1-baseline |
| 측정일 | 2026-05-22 |
| 보고서 생성 시각 | 2026-05-22 15:55 UTC |
| 작성자 | ssm-user |
| 백엔드 commit | d798757 |
| 결과 폴더 | /home/ssm-user/loadtest-results/a_v1_2026-05-22 |

## B. Before (시작 전 측정)

### before/tx_stats.txt

```
 xact_commit | xact_rollback | deadlocks 
-------------+---------------+-----------
      268649 |         40323 |         0
(1 row)

```

### before/stock.txt

```
 product_id | stock_quantity | is_soldout 
------------+----------------+------------
          1 |              1 | f
          2 |              1 | f
          3 |              1 | f
          4 |              1 | f
          5 |              1 | f
          6 |              1 | f
          7 |              1 | f
          8 |              1 | f
          9 |              1 | f
         10 |              1 | f
(10 rows)

```

### before/stock_summary.txt

```
 remaining_stock | sold_out_count 
-----------------+----------------
              10 |              0
(1 row)

```

### before/memory.txt

```
               total        used        free      shared  buff/cache   available
Mem:           3.7Gi       1.8Gi       473Mi        39Mi       1.8Gi       1.9Gi
Swap:             0B          0B          0B

--- /proc/meminfo top ---
MemTotal:        3926160 kB
MemFree:          485272 kB
MemAvailable:    1990120 kB
Buffers:          109744 kB
Cached:          1498784 kB
```

### before/docker_stats.txt

```
NAME              CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O
myfave-app        0.23%     680.6MiB / 3.744GiB   17.75%    106MB / 236MB     11.6MB / 885kB
myfave-postgres   0.02%     180.1MiB / 3.744GiB   4.70%     243MB / 558MB     39.3MB / 616MB
myfave-redis      0.52%     5.035MiB / 3.744GiB   0.13%     76.3MB / 19.6MB   10.1MB / 2.07MB
```

### before/backend_commit.txt

```
d7987575cb69b18b40f4cdacc2e5cb5daafc5cbd
d798757 Merge pull request #175 from 2026-first-half-of-year-Techeer-Team-D/173-refactor-order-payment-로그와-매트릭-수정값에-counter-추가
2026-05-23 00:18:11 +0900```

### before/timestamp_local.txt

```
2026-05-22 15:50:05 UTC
```

## C. Monitor 폴링 분석

⚠️ `analyze-monitor.sh a v1 2026-05-22` 를 먼저 실행하세요.
monitor 폴더는 있지만 analyze.md 가 없습니다.

- 폴링 횟수: 26회 (raw 데이터)

## D. After (끝난 후 측정)

### after/tx_stats.txt

```
 xact_commit | xact_rollback | deadlocks 
-------------+---------------+-----------
      314808 |         50201 |         0
(1 row)

```

### after/stock.txt

```
 product_id | stock_quantity | is_soldout 
------------+----------------+------------
          1 |              1 | f
          2 |              1 | f
          3 |              1 | f
          4 |              1 | f
          5 |              1 | f
          6 |              1 | f
          7 |              1 | f
          8 |              1 | f
          9 |              1 | f
         10 |              1 | f
(10 rows)

```

### after/stock_summary.txt

```
 remaining_stock | sold_out_count 
-----------------+----------------
              10 |              0
(1 row)

```

### after/order_status.txt

```
 order_status | count 
--------------+-------
 PENDING      |  8075
(1 row)

```

### after/payment_status.txt

```
 payment_status | count 
----------------+-------
(0 rows)

```

### after/oversell_check.txt

```
ERROR:  column oi.products_id does not exist
LINE 1: ... ON oi.orders_id = o.orders_id JOIN products p ON oi.product...
                                                             ^
HINT:  Perhaps you meant to reference the column "oi.product_id".
```

### after/memory.txt

```
               total        used        free      shared  buff/cache   available
Mem:           3.7Gi       2.2Gi       144Mi        39Mi       1.7Gi       1.6Gi
Swap:             0B          0B          0B

--- /proc/meminfo top ---
MemTotal:        3926160 kB
MemFree:          147748 kB
MemAvailable:    1627764 kB
Buffers:          107752 kB
Cached:          1474028 kB
```

### after/docker_stats.txt

```
NAME              CPU %     MEM USAGE / LIMIT     MEM %     NET I/O         BLOCK I/O
myfave-app        0.36%     985.4MiB / 3.744GiB   25.70%    261MB / 407MB   11.6MB / 1.02MB
myfave-postgres   0.02%     195.7MiB / 3.744GiB   5.10%     289MB / 662MB   39.3MB / 753MB
myfave-redis      0.48%     5.035MiB / 3.744GiB   0.13%     89.1MB / 23MB   10.1MB / 2.07MB
```

### after/backend_errors.txt

```
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:50:34.012 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:50:49.207 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:51:04.146 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:51:16.846 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:51:31.007 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:51:44.789 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:51:57.673 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:52:13.936 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:52:26.148 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:52:38.394 [MessageBroker-1] traceId=no-trace loadtest=:: INFO  o.s.w.s.c.WebSocketMessageBrokerStats - WebSocketSession[1 current WS(1)-HttpStream(0)-HttpPoll(0), 4 total, 0 closed abnormally (0 connect failure, 0 send limit, 0 transport error)], stompSubProtocol[processed CONNECT(4)-CONNECTED(0)-DISCONNECT(0)], stompBrokerRelay[null], inboundChannel[pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 9], outboundChannel[pool size = 0, active threads = 0, queued tasks = 0, completed tasks = 3], sockJsScheduler[pool size = 2, active threads = 1, queued tasks = 2, completed tasks = 447]
2026-05-22 15:52:41.376 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:52:56.156 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:53:10.133 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:53:22.642 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:53:36.101 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:53:49.550 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:54:04.211 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:54:21.268 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:54:37.240 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
2026-05-22 15:54:58.848 [OkHttp http://localhost:4318/...] traceId=no-trace loadtest=:: ERROR i.o.e.internal.http.HttpExporter - Failed to export spans. The request could not be executed. Full error message: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
java.net.ConnectException: Failed to connect to localhost/[0:0:0:0:0:0:0:1]:4318
	Suppressed: java.net.ConnectException: Failed to connect to localhost/127.0.0.1:4318
	Caused by: java.net.ConnectException: Connection refused
Caused by: java.net.ConnectException: Connection refused
```

### after/timestamp_local.txt

```
2026-05-22 15:55:00 UTC
```

## E. k6 콘솔 로그

⚠️ k6 콘솔 로그 파일이 없습니다.
k6 EC2에서 실행 후 다음과 같이 운영 EC2로 복사하세요:

```bash
# k6 EC2
BASE_URL=https://api.myfave.shop/api/v1 k6 run scenarios/scenario-a-*.js 2>&1 | tee /tmp/k6_a_v1.log
scp /tmp/k6_a_v1.log <운영-ec2>:/home/ssm-user/loadtest-results/a_v1_2026-05-22/k6_output.log

# 그 후 운영 EC2에서 generate-report.sh 재실행
```

## F. 첨부 폴더 파일 인덱스

```
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/backend_commit.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/backend_errors.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/docker_stats.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/memory.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/order_status.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/oversell_check.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/payment_status.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/stock.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/stock_summary.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/timestamp_local.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/timestamp_utc.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/after/tx_stats.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/before/backend_commit.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/before/docker_stats.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/before/memory.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/before/stock.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/before/stock_summary.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/before/timestamp_local.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/before/timestamp_utc.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/before/tx_stats.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155009.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155016.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155024.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155031.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155039.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155046.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155054.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155104.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155118.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155130.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155143.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155154.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155208.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155221.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155232.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155245.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155300.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155310.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155321.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155331.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155343.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155354.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155406.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155420.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155430.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/db_activity_155438.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155009.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155016.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155024.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155031.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155039.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155046.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155054.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155104.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155118.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155130.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155143.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155154.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155208.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155221.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155232.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155245.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155300.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155310.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155321.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155331.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155343.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155354.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155406.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155420.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155430.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/docker_155438.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155009.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155016.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155024.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155031.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155039.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155046.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155054.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155104.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155118.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155130.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155143.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155154.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155208.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155221.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155232.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155245.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155300.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155310.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155321.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155331.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155343.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155354.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155406.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155420.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155430.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/loadavg_155438.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155009.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155016.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155024.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155031.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155039.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155046.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155054.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155104.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155118.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155130.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155143.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155154.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155208.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155221.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155232.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155245.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155300.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155310.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155321.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155331.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155343.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155354.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155406.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155420.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155430.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/locks_155438.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155009.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155016.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155024.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155031.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155039.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155046.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155054.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155104.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155118.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155130.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155143.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155154.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155208.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155221.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155232.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155245.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155300.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155310.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155321.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155331.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155343.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155354.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155406.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155420.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155430.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/mem_155438.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155009.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155016.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155024.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155031.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155039.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155046.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155054.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155104.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155118.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155130.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155143.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155154.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155208.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155221.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155232.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155245.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155300.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155310.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155321.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155331.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155343.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155354.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155406.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155420.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155430.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/metrics_155438.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155009.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155016.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155024.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155031.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155039.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155046.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155054.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155104.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155118.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155130.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155143.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155154.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155208.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155221.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155232.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155245.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155300.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155310.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155321.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155331.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155343.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155354.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155406.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155420.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155430.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/monitor/tx_155438.txt
/home/ssm-user/loadtest-results/a_v1_2026-05-22/report.md
```
