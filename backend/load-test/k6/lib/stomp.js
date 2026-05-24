// STOMP frame 빌더 — k6/ws는 raw WebSocket만 지원하므로 STOMP 프로토콜은 수동으로 직조.
// 백엔드: spring-boot-starter-websocket (SockJS 엔드포인트) + @MessageMapping.
//
// SockJS 프레임 포맷:
//   송신: ["<stomp-frame>"]  ← JSON 배열로 감싸서 전송
//   수신: o                  ← open
//         h                  ← heartbeat
//         a["<stomp-frame>"] ← message (a 접두사 + JSON 배열)
//         c[code,"reason"]   ← close

import { LOADTEST_RUN_ID, LOADTEST_SCENARIO, LOADTEST_ROUND } from './context.js';

// STOMP frame 종료자: NULL byte (0x00). String.fromCharCode로 명시적으로 생성.
const NULL_BYTE = String.fromCharCode(0);

// STOMP 프레임을 SockJS 송신 포맷으로 감싸기
function sockJsWrap(frame) {
  return JSON.stringify([frame]);
}

function loadtestStompHeaders() {
  const lines = [];
  if (LOADTEST_RUN_ID) lines.push(`X-Loadtest-Run-Id:${LOADTEST_RUN_ID}`);
  if (LOADTEST_SCENARIO) lines.push(`X-Loadtest-Scenario:${LOADTEST_SCENARIO}`);
  if (LOADTEST_ROUND) lines.push(`X-Loadtest-Round:${LOADTEST_ROUND}`);
  return lines.length > 0 ? lines.join('\n') + '\n' : '';
}

export function connect(accessToken) {
  // Bearer 토큰은 JwtChannelInterceptor가 STOMP 헤더에서 읽음.
  const frame =
    'CONNECT\n' +
    'accept-version:1.2\n' +
    'host:localhost\n' +
    `Authorization:Bearer ${accessToken}\n` +
    loadtestStompHeaders() +
    '\n' +
    NULL_BYTE;
  return sockJsWrap(frame);
}

export function subscribe(id, destination) {
  const frame =
    'SUBSCRIBE\n' +
    `id:${id}\n` +
    `destination:${destination}\n` +
    '\n' +
    NULL_BYTE;
  return sockJsWrap(frame);
}

export function send(destination, body, contentType = 'application/json') {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  const frame =
    'SEND\n' +
    `destination:${destination}\n` +
    `content-type:${contentType}\n` +
    `content-length:${payload.length}\n` +
    '\n' +
    payload +
    NULL_BYTE;
  return sockJsWrap(frame);
}

export function disconnect() {
  return sockJsWrap('DISCONNECT\n\n' + NULL_BYTE);
}

// SockJS 수신 프레임에서 STOMP 명령 추출
// o → null(open, 무시), h → null(heartbeat, 무시)
// a["CONNECTED\n..."] → "CONNECTED"
export function frameCommand(raw) {
  if (typeof raw !== 'string') return null;
  if (raw === 'o' || raw === 'h') return null;
  if (raw.startsWith('a[')) {
    try {
      const frames = JSON.parse(raw.slice(1)); // ["<stomp-frame>", ...]
      if (!frames || frames.length === 0) return null;
      const stomp = frames[0];
      const newlineIdx = stomp.indexOf('\n');
      return newlineIdx > 0 ? stomp.substring(0, newlineIdx) : stomp;
    } catch (_) {
      return null;
    }
  }
  return null;
}
