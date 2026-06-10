export const isNativeApp =

  window.Capacitor?.isNativePlatform?.()

export const isAndroidApp =

  isNativeApp &&

  /Android/i.test(navigator.userAgent)

export const isIOS =

  /iPhone|iPad|iPod/i.test(navigator.userAgent)

export const isAndroidMobile =

  /Android/i.test(navigator.userAgent)