import { useConfirmStore } from '@/zustand/confirmStore';

// ✅ 컴포넌트에서 쉽게 호출할 수 있도록 open 함수만 꺼내 쓰는 커스텀 훅
export const useConfirm = () => {
  return useConfirmStore((state) => state.open);
};