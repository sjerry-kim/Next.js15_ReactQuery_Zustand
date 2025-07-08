import { useState } from 'react';

type JsonData = {
  [key: string]: string | undefined;
};

interface ValidationRule {
  required?: boolean;
  format?: 'email' | 'ko-only' | 'eng-lower-only' | 'eng-upper-only' | 'eng-num' | 'eng-num-special';
  minLength?: number;
  maxLength?: number;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface Errors {
  [key: string]: string;
}

// 포맷룰
const formatRules = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: '이메일 형식으로 작성해주세요.',
  },
  'ko-only': {
    pattern: /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/,
    message: '한글만 입력할 수 있습니다.',
  },
  'eng-lower-only': {
    pattern: /^[a-z]+$/,
    message: '영문 소문자만 입력할 수 있습니다.',
  },
  'eng-upper-only': {
    pattern: /^[A-Z]+$/,
    message: '영문 대문자만 입력할 수 있습니다.',
  },
  'eng-num': {
    pattern: /^[a-zA-Z0-9]+$/,
    message: '영문과 숫자만 입력할 수 있습니다.',
  },
  'eng-num-special': { // 허용 특수 문자: !@#$%^&*()_+-=[]{};':"\|,.<>/?~
    pattern: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]+$/,
    message: '영어, 숫자, 특수문자만 입력할 수 있습니다.',
  },
};

/* ✅ validation hook 함수 */
const useValidation = (jsonData: JsonData, validationRules: ValidationRules) => {
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    let valid = true;
    const newErrors: Errors = {};

    for (const [key, rules] of Object.entries(validationRules)) {
      const value = jsonData[key] || ''; // value가 undefined일 경우 빈 문자열로 처리

      if (rules.required && !value) {
        newErrors[key] = '필수 입력 사항입니다.';
        valid = false;
        continue; // 필수 항목이 비어있으면 다른 검사는 건너뜀
      }

      if (rules.minLength && value.length < rules.minLength) {
        newErrors[key] = `최소 ${rules.minLength}자 이상이어야 합니다.`;
        valid = false;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        newErrors[key] = `최대 ${rules.maxLength}자 이하로 입력해야 합니다.`;
        valid = false;
      }

      // 포맷팅 검사
      if (rules.format && value) {
        const formatRule = formatRules[rules.format];
        if (formatRule && !formatRule.pattern.test(value)) {
          newErrors[key] = formatRule.message;
          valid = false;
        }
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const resetErrors = () => {
    setErrors({});
  };

  return { errors, setErrors, validate, resetErrors };
};

export default useValidation;