/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',   // App Router
    // './pages/**/*.{js,ts,jsx,tsx}', // Page Router
    // './components/**/*.{js,ts,jsx,tsx}', // 공통 컴포넌트 등: 프로젝트에 맞게 설정
  ],
  theme: {
    extend: {
      // fontFamily: font-
      fontFamily: {
        sans: ['Pretendard', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'ui-serif', 'serif'],
        mono: ['Menlo', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      // fontSize
      fontSize: {
        'xs': '0.65rem', // 기본보다 좀 작게
        'sm': '0.85rem',
        'base': '1rem',
        'lg': '1.15rem',
        'xl': '1.3rem',
        '2xl': '1.8rem',
        '3xl': '2.2rem',
        '4xl': '2.8rem',
        '5xl': '3.5rem',
        '6xl': '4.5rem',
        'custom-xl': '1.35rem', // 내가 추가한 커스텀 사이즈
      },

      // fontWeight: font-
      fontWeight: {
        'extra-light': 100,
        'light': 300,
        'normal': 400,
        'medium': 500,
        'semi-bold': 600,
        'bold': 700,
        'extra-bold': 800,
        'black': 900,
      },

      // lineHeight: leading-
      lineHeight: {
        normal: '1.5',          // 기본 줄 높이
        relaxed: '1.625',       // 넉넉한 줄 높이
        loose: '2',             // 넓은 줄 높이
        'extra-loose': '2.5',   // 아주 넓은 줄 높이
        '12': '3rem',           // 48px
        '14': '3.5rem',         // 56px
      },

      // letterSpacing: tracking-
      letterSpacing: {
        tighter: '-0.05em',     // 좀 더 조여진 자간
        tight: '-0.025em',      // 살짝 조여진 자간
        normal: '0',            // 기본 자간
        wide: '0.025em',        // 살짝 넓어진 자간
        wider: '0.05em',        // 좀 더 넓어진 자간
        widest: '0.1em',        // 매우 넓어진 자간
      },

      // colors: bg-, text-, border-, placeholder-, ring-, divide-, outline-
      colors: {
        primary: {
          DEFAULT: '#6366F1',  // ex) bg-primary, text-primary
          light: '#A5B4FC',     // ex) bg-primary-light
          dark: '#4F46E5',      // ex) bg-primary-dark
        },
        secondary: {
          DEFAULT: '#E9DCC3',
          light: '#F4EBD6',
          dark: '#D4C79E',
        },
        background: {
          DEFAULT: '#F9FAFB',
          light: '#FFFFFF',
          dark: '#E5E7EB',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F3F4F6',
          dark: '#D1D5DB',
        },
        neutral: {
          100: '#FFFFFF',
          200: '#E0E0E0',
          300: '#C2C2C2',
          400: '#9E9E9E',
          500: '#7E7E7E',
          600: '#626262',
          700: '#4B4B4B',
          800: '#333333',
          900: '#1A1A1A',
        },
        info: {
          DEFAULT: '#2D9CDB',
          bg: '#E3F2FA',
          text: '#1F6F99',
        },
        danger: {
          DEFAULT: '#EB5757',
          bg: '#F9E3E3',
          text: '#9B3D3D',
        },
        warn: {
          DEFAULT: '#F2994A',
          bg: '#FDE9D6',
          text: '#9B5E13',
        },
        success: {
          DEFAULT: '#27AE60',
          bg: '#E3F7E8',
          text: '#1B6F3F',
        },
      },

      // spacing - p-, pt-, pr-, pb-, pl-, px-, py-, m-, mt-, mr-, mb-, ml-, mx-, my-, gap-, row-gap-, col-gap-
      spacing: {
        '1': '0.25rem',      // 4px
        '2': '0.5rem',       // 8px
        '3': '0.75rem',      // 12px
        '4': '1rem',         // 16px
        '5': '1.25rem',      // 20px
        '6': '1.5rem',       // 24px
        '7': '1.75rem',      // 28px
        '8': '2rem',         // 32px
        '9': '2.25rem',      // 36px
        '10': '2.5rem',      // 40px
        '14': '3.5rem',      // 56px
        '18': '4.5rem',      // 72px
        '22': '5.5rem',      // 88px
        '26': '6.5rem',      // 104px
        '30': '7.5rem',      // 120px
        '72': '18rem',       // 288px (커스텀 큰 값)
      },

      // maxWidth: max-w-
      maxWidth: {
        'xs': '20rem',     // 320px - 아주 작은 화면용
        'sm': '24rem',     // 384px
        'md': '28rem',     // 448px
        'lg': '32rem',     // 512px
        'xl': '36rem',     // 576px
        '2xl': '42rem',    // 672px
        '3xl': '48rem',    // 768px
        '4xl': '56rem',    // 896px
        '5xl': '64rem',    // 1024px
        '6xl': '72rem',    // 1152px
        '7xl': '80rem',    // 1280px
        '8xl': '90rem',    // 1440px - 넓은 데스크탑용
        '9xl': '100rem',   // 1600px 이상 더 넓은 화면용
      },

      // minWidth: min-w-
      minWidth: {
        '0': '0',
        '1/6': '16.6667%',   // 1/6 너비
        '1/4': '25%',        // 1/4 너비
        '1/3': '33.3333%',   // 1/3 너비
        '1/2': '50%',        // 1/2 너비
        '2/3': '66.6667%',   // 2/3 너비
        '3/4': '75%',        // 3/4 너비
        '5/6': '83.3333%',   // 5/6 너비
        'full': '100%',      // 전체 너비
        'screen-sm': '640px',  // 최소 너비를 특정 화면 크기로 지정 가능
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
      },

      // minHeight: max-h-
      minHeight: {
        '0': '0',
        '4': '1rem',          // 16px
        '8': '2rem',          // 32px
        '12': '3rem',         // 48px
        '16': '4rem',         // 64px
        '20': '5rem',         // 80px
        '24': '6rem',         // 96px
        '32': '8rem',         // 128px
        '40': '10rem',        // 160px
        '48': '12rem',        // 192px
        '56': '14rem',        // 224px
        '64': '16rem',        // 256px
        'screen-25': '25vh',  // 화면 높이의 1/4
        'screen-50': '50vh',  // 화면 높이의 절반
        'screen-75': '75vh',  // 화면 높이의 3/4
        'screen': '100vh',    // 화면 전체 높이
      },

      // maxHeight: min-h-
      maxHeight: {
        '0': '0',
        '4': '1rem',          // 16px
        '8': '2rem',          // 32px
        '12': '3rem',         // 48px
        '16': '4rem',         // 64px
        '20': '5rem',         // 80px
        '24': '6rem',         // 96px
        '32': '8rem',         // 128px
        '40': '10rem',        // 160px
        '48': '12rem',        // 192px
        '56': '14rem',        // 224px
        '64': '16rem',        // 256px
        'screen-25': '25vh',  // 화면 높이의 1/4
        'screen-50': '50vh',  // 화면 높이의 절반
        'screen-75': '75vh',  // 화면 높이의 3/4
        'screen': '100vh',    // 화면 전체 높이
      },

      // borderRadius: rounded-
      borderRadius: {
        none: '0',
        sm: '0.125rem',     // 2px
        DEFAULT: '0.25rem', // 4px
        md: '0.375rem',     // 6px
        lg: '0.5rem',       // 8px
        xl: '0.75rem',      // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
        full: '9999px',
      },

      // borderWidth: border-
      borderWidth: {
        DEFAULT: '1px',  // 기본값
        0: '0',
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
        5: '5px',
        6: '6px',
        8: '8px',
        10: '10px',
      },

      // outline: outline-
      outline: {
        blue: ['1px solid #2563EB', '3px'],     // 파란색 아웃라인, 오프셋 3px
        red: ['2px solid #EF4444', '4px'],      // 빨간 아웃라인, 오프셋 4px
        green: ['1.5px solid #22C55E', '2px'],  // 초록 아웃라인, 오프셋 2px
        yellow: ['3px dashed #FACC15', '5px'],  // 노란색 점선 아웃라인, 오프셋 5px
        none: ['none', '0'],
      },

      // ringWidth: ring-
      ringWidth: {
        '1': '1px',
        '3': '3px',
        '5': '5px',
      },

      // ringOpacity: ring-opacity-
      ringOpacity: {
        '10': '0.1',
        '30': '0.3',
        '50': '0.5',
        '90': '0.9',
      },

      // opacity: opacity-
      opacity: {
        '10': '0.1',
        '15': '0.15',
        '35': '0.35',
        '85': '0.85',
      },

      // backgroundOpacity: bg-opacity-
      backgroundOpacity: {
        '10': '0.1',
        '20': '0.2',
        '90': '0.9',
      },

      // backgroundImage - bg-
      backgroundImage: {
        // 기본 그라데이션
        'gradient-linear': 'linear-gradient(to right, var(--tw-gradient-stops))',   // 좌->우 선형 그라데이션
        'gradient-linear-t': 'linear-gradient(to top, var(--tw-gradient-stops))',   // 아래->위 선형 그라데이션
        'gradient-linear-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))', // 위->아래 선형 그라데이션
        'gradient-linear-l': 'linear-gradient(to left, var(--tw-gradient-stops))',  // 우->좌 선형 그라데이션
        'gradient-linear-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))', // 대각선 위쪽 오른쪽

        // 방사형 그라데이션 (중심에서 바깥)
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',

        // 원뿔형(콘) 그라데이션 (시계 방향으로 색 변화)
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',

        // 변형 예시
        'gradient-radial-at-t': 'radial-gradient(circle at top, var(--tw-gradient-stops))',       // 위쪽 중심
        'gradient-radial-at-b': 'radial-gradient(circle at bottom, var(--tw-gradient-stops))',    // 아래쪽 중심
        'gradient-conic-from-0': 'conic-gradient(from 0deg at 50% 50%, var(--tw-gradient-stops))', // 원뿔형 시작 각도 0도
      },

      // boxShadow: shadow-
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
        md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
        none: 'none',
        'custom-light': '0 0 8px 2px rgba(37, 99, 235, 0.3)',  // 파란빛 그림자
      },

      // z-index: z-
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        '110': '110',
        '120': '120',
        '130': '130',
        '140': '140',
        '150': '150',
        'max': '9999',    // 최상위 레이어용
      },

      // transitionProperty: transition-
      transitionProperty: {
        none: 'none',                         // 전환 없음
        all: 'all',                           // 모든 속성 전환
        DEFAULT: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform', // 기본적으로 자주 쓰이는 속성들
        colors: 'background-color, border-color, color, fill, stroke',  // 색상 관련 속성 전환
        bg: 'background-color',               // 배경색 전환
        border: 'border-color',               // 테두리 색상 전환
        text: 'color',                        // 텍스트 색상 전환
        opacity: 'opacity',                   // 투명도 전환
        shadow: 'box-shadow',                 // 그림자 전환
        transform: 'transform',               // 변형(이동, 크기 등) 전환
        height: 'height',                     // 높이 변화 전환
        spacing: 'margin, padding',           // 마진, 패딩 변화 전환
        width: 'width',                       // 너비 변화 전환
      },

      // animation & keyframe: animate-
      animation: {
        none: 'none',                                // 애니메이션 없음
        'fade-in': 'fadeIn 0.5s ease-in forwards',  // 페이드 인
        'fade-out': 'fadeOut 0.5s ease-out forwards', // 페이드 아웃
        'slide-up': 'slideUp 0.4s ease forwards',   // 슬라이드 업
        'slide-down': 'slideDown 0.4s ease forwards', // 슬라이드 다운
        'slide-left': 'slideLeft 0.4s ease forwards', // 슬라이드 왼쪽
        'slide-right': 'slideRight 0.4s ease forwards', // 슬라이드 오른쪽
        'bounce': 'bounce 1s infinite',               // 바운스 반복
        'spin-slow': 'spin 3s linear infinite',      // 천천히 회전
        'spin-fast': 'spin 1s linear infinite',      // 빠르게 회전
        'pulse': 'pulse 2s ease-in-out infinite',    // 펄스 효과
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', // 핑 효과
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        ping: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },

      // cursor: cursor-
      cursor: {
        auto: 'auto',               // 기본 커서
        default: 'default',         // 기본 화살표 커서
        pointer: 'pointer',         // 클릭 가능한 손가락 포인터
        wait: 'wait',               // 기다림(로딩) 커서
        text: 'text',               // 텍스트 입력 커서 (I-빔)
        move: 'move',               // 이동 커서
        crosshair: 'crosshair',     // 십자선 커서
        grab: 'grab',               // 잡기 전 커서
        grabbing: 'grabbing',       // 잡고 있는 상태 커서
        notAllowed: 'not-allowed',  // 금지(사용 불가) 커서
        progress: 'progress',       // 작업 중 커서 (진행 중)
        help: 'help',               // 도움말(?) 커서
        alias: 'alias',             // 별명(링크 대체) 커서
        copy: 'copy',               // 복사 커서
        zoomIn: 'zoom-in',          // 확대 커서
        zoomOut: 'zoom-out',        // 축소 커서
      },
    },
  },
  plugins: [],
}

