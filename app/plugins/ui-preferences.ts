export default defineNuxtPlugin(() => {
  const { initLocale } = useAppI18n();
  const { initTheme } = useThemeMode();

  initLocale();
  initTheme();
});
