import { useEffect, useState } from "react";

// Giới hạn số lượng toast hiển thị
const TOAST_LIMIT = 1;

let count = 0;
function generateId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  dismiss: () => void;
  [key: string]: any; // Nếu có thêm props động như action
}

interface ToastStoreState {
  toasts: Toast[];
}

type ToastStoreListener = (state: ToastStoreState) => void;

const toastStore = {
  state: {
    toasts: [],
  } as ToastStoreState,

  listeners: [] as ToastStoreListener[],

  getState() {
    return this.state;
  },

  setState(nextState: ToastStoreState | ((prev: ToastStoreState) => ToastStoreState)) {
    this.state = typeof nextState === "function"
      ? nextState(this.state)
      : { ...this.state, ...nextState };

    this.listeners.forEach((listener) => listener(this.state));
  },

  subscribe(listener: ToastStoreListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
};

// API gọi toast từ bất kỳ đâu
export const toast = (props: Omit<Partial<Toast>, "id" | "dismiss">) => {
  const id = generateId();

  const dismiss = () => {
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  };

  const update = (updatedProps: Partial<Toast>) => {
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, ...updatedProps } : t
      ),
    }));
  };

  toastStore.setState((state) => ({
    ...state,
    toasts: [{ ...props, id, dismiss }, ...state.toasts].slice(0, TOAST_LIMIT),
  }));

  return {
    id,
    dismiss,
    update,
  };
};

// Hook React để sử dụng toast trong component
export function useToast() {
  const [state, setState] = useState<ToastStoreState>(toastStore.getState());

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    state.toasts.forEach((toast) => {
      if (toast.duration === Infinity) return;

      const timeout = setTimeout(() => {
        toast.dismiss();
      }, toast.duration ?? 5000);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [state.toasts]);


  return {
    toast,
    toasts: state.toasts,
  };
}
