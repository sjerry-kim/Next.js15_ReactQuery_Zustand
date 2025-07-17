import { Dispatch, SetStateAction } from 'react';

type CustomEvent = {
  target: {
    name: string;
    value: string;
  };
};

/* ✅ onChange에 사용할 Changer 유틸 함수 */
const onInputsChange = <T extends Record<string, any>>(
  _data: T,
  setData: Dispatch<SetStateAction<T>>
) => {

  /* 1. 표준 HTML 입력 요소(input, textarea, select)의 변경 이벤트를 처리하는 중앙 핸들러 */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { type, id, name, value: inputValue } = e.target;
    const inputElement = e.target as HTMLInputElement; // input type이 number일 때 type 체크 위해서 별도로 캐스팅함
    const checked = (e.target as HTMLInputElement).checked;
    const maxLength = (e.target as HTMLInputElement | HTMLTextAreaElement).maxLength;
    const { format } = (e.target as HTMLElement).dataset; // ! input, textarea 등에 data-format 추가해서 사용
    let value = inputValue;

    // 1-1. maxLength
    if (maxLength !== -1 && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }
    // 1-2. checkbox
    if (type === 'checkbox') {
      setData((prev) => ({ ...prev, [name]: checked }));
    }
    // 1-3 type = number -> min, max
    else if (type === 'number') {
      let numericValue = value.replace(/[^0-9]/g, '');

      const min = inputElement.min;
      const max = inputElement.max;

      if (max && numericValue.length > 0 && Number(numericValue) > Number(max)) {
        numericValue = max;
      }

      if (min && numericValue.length > 0 && Number(numericValue) < Number(min)) {
        numericValue = min;
      }

      setData((prev) => ({ ...prev, [name]: numericValue }));
    }
    // 1-4. 사업자번호
    else if (format === 'business-num') {
      const numeric = value.replace(/\D/g, '');
      let formatted = numeric;
      if (numeric.length > 5) {
        formatted = `${numeric.slice(0, 3)}-${numeric.slice(3, 5)}-${numeric.slice(5, 10)}`;
      } else if (numeric.length > 3) {
        formatted = `${numeric.slice(0, 3)}-${numeric.slice(3)}`;
      }
      setData((prev) => ({ ...prev, [name]: formatted }));
    }
    // 1-5. 전화번호
    else if (format === 'local-tel') {
      const digits = value.replace(/[^0-9]/g, '').slice(0, 11);
      let formatted = digits;
      if (digits.length > 7) {
        formatted = digits.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
      } else if (digits.length > 3) {
        formatted = digits.replace(/(\d{3})(\d+)/, '$1-$2');
      }
      setData((prev) => ({ ...prev, [name]: formatted }));
    }
    // 1-6. 숫자 + 하이픈
    else if (format === 'tel') {
      const formattedValue = value.replace(/[^0-9-]/g, '');
      setData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    // 1-7. 금액 쉼표
    else if (format === 'money') {
      let onlyNums = value.replace(/\D/g, '').replace(/^0+/, '');
      const formatted = onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setData((prev) => ({ ...prev, [name]: formatted }));
    }
    // 1-8. 한글 (띄어쓰기도 안 됨)
    else if (format === 'ko-only') {
      const formattedValue = value.replace(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '');
      setData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    // 1-9. 영문 소문자
    else if (format === 'eng-lower-only') {
      const formattedValue = value.replace(/[^a-z]/g, '');
      setData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    // 1-10. 영문 대문자
    else if (format === 'eng-upper-only') {
      // 영문 대문자를 제외한 모든 문자를 제거합니다.
      const formattedValue = value.replace(/[^A-Z]/g, '');
      setData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    // 1-11. 영문 + 숫자
    else if (format === 'eng-num') {
      const formattedValue = value.replace(/[^a-zA-Z0-9]/g, '');
      setData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    // 1-12. 영문 + 숫자 + 특수문자(!@#$%^&*()_+-=[]{};':"\|,.<>/?~)
    else if (format === 'eng-num-special') {
      const formattedValue = value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
      setData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    // 1-13. 이메일 형식 (영문, 숫자, 일부 특수문자)
    else if (format === 'email') {
      // 이메일에 허용되는 문자(영문, 숫자, @, ., _, -) 외에는 모두 제거합니다.
      const formattedValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
      setData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    // 기타
    else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* 2. 커스텀 컴포넌트(예: CKEditor)에서 발생한 변경 이벤트를 처리하는 핸들러 */
  // - !!! 타입 안정성 추구 !!!
  // - 전달받은 name과 value를 다른 가공 없이 상태에 그대로 저장
  const handleCustomChange = (e: CustomEvent) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return { handleChange, handleCustomChange };
};

export default onInputsChange;
