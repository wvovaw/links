export default function useCounter({ init }: { init?: number }) {
  const counter = ref(init ?? 0);

  function increment() {
    counter.value++;
  }
  function decrement() {
    counter.value--;
  }

  return {
    counter,
    increment,
    decrement,
  };
}
