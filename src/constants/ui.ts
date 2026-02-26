/** 우측 패널 너비 */
export const PANEL_WIDTH = '30%'

/** 지도 영역 너비 */
export const MAP_WIDTH = '70%'

/** 모션 애니메이션 기본 duration (초) */
export const ANIMATION_DURATION = 0.3

/** 모션 스프링 설정 */
export const SPRING_CONFIG = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
} as const

/** 반응형 브레이크포인트 (px) */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

/** 상단 바 높이 */
export const TOP_BAR_HEIGHT = 56

/** 패널 슬라이드 오프셋 */
export const PANEL_SLIDE_OFFSET = 400
