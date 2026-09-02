/** 앱 전체에서 쓰는 고정값 */

/** 운영 시작 시각 (시) */
export const OPEN_HOUR = 9;
/** 운영 종료 시각 (시) */
export const CLOSE_HOUR = 19;
/** 한 슬롯 길이 (분) */
export const SLOT_MINUTES = 30;
/** 한 슬롯의 화면 높이 (px) */
export const SLOT_HEIGHT = 32;
/** 시간 열 폭 (px) */
export const TIME_COL_WIDTH = 64;
/** 회의실 한 열의 최소 폭 (px) — 모바일 가로 스크롤 기준 */
export const ROOM_COL_MIN_WIDTH = 88;

/** 하루 슬롯 개수 (09:00~19:00, 30분 → 20개) */
export const SLOT_COUNT = ((CLOSE_HOUR - OPEN_HOUR) * 60) / SLOT_MINUTES;
