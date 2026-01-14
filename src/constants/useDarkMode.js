import { ref, watch } from 'vue';

const isDarkMode = ref(localStorage.getItem('isDarkMode') === 'true');

watch(isDarkMode, (newValue) => {
  localStorage.setItem('isDarkMode', newValue.toString());
});

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  return {
    isDarkMode,
    toggleDarkMode
  };
}