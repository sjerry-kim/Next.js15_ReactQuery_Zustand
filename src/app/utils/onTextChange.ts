import { Dispatch, SetStateAction } from 'react';

type CustomEvent = {
  target: {
    name: string;
    value: string;
  };
};

const onTextChange = <T extends Record<string, any>>(
  _data: T,
  setData: Dispatch<SetStateAction<T>>
) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { type, id, name, value: inputValue } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const maxLength = (e.target as HTMLInputElement | HTMLTextAreaElement).maxLength;

    let value = inputValue;
    if (maxLength !== -1 && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    if (type === 'checkbox') {
      setData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'storeBusiNum') {
      const numeric = value.replace(/\D/g, '');
      let formatted = numeric;
      if (numeric.length <= 3) {
        formatted = numeric;
      } else if (numeric.length <= 5) {
        formatted = `${numeric.slice(0, 3)}-${numeric.slice(3)}`;
      } else {
        formatted = `${numeric.slice(0, 3)}-${numeric.slice(3, 5)}-${numeric.slice(5, 10)}`;
      }
      setData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === 'storeTel') {
      const digits = value.replace(/[^0-9]/g, '').slice(0, 11);
      let formatted = digits;
      if (digits.length <= 3) {
        formatted = digits;
      } else if (digits.length <= 7) {
        formatted = digits.replace(/(\d{3})(\d+)/, '$1-$2');
      } else {
        formatted = digits.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
      }
      setData((prev) => ({ ...prev, [name]: formatted }));
    } else if (type === 'tel') {
      const formattedValue = value.replace(/[^0-9-]/g, '');
      setData((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'contractPrice' || name === 'contractPay') {
      let onlyNums = value.replace(/\D/g, '').replace(/^0+/, '');
      const formatted = onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setData((prev) => ({ ...prev, [name]: formatted }));
    } else if (id === 'adminUserId') {
      const alphaNumOnly = value.replace(/[^a-zA-Z0-9]/g, '');
      setData((prev) => ({ ...prev, [name]: alphaNumOnly }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomChange = (e: CustomEvent) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return { handleChange, handleCustomChange };
};

export default onTextChange;
