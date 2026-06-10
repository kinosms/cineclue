export const isNativeApp =
  typeof window !== 'undefined' &&
  window.Capacitor?.isNativePlatform?.()

export const isAndroidApp =
  typeof window !== 'undefined' &&
  window.Capacitor?.isNativePlatform?.() &&
  /Android/i.test(navigator.userAgent)

export const isIOS =
  typeof navigator !== 'undefined' &&
  /iPhone|iPad|iPod/i.test(navigator.userAgent)

export const isAndroidMobile =
  typeof navigator !== 'undefined' &&
  /Android/i.test(navigator.userAgent)