'use client';

export type FlashBannerVariant = 'success' | 'error';

export type FlashBannerPayload = {
  message: string;
  durationMs: number;
  variant?: FlashBannerVariant;
};

const FLASH_BANNER_STORAGE_KEY = 'fundraise:flash-banner';
export const FLASH_BANNER_EVENT = 'fundraise:flash-banner';

export function queueFlashBanner(payload: FlashBannerPayload): void {
  try {
    sessionStorage.setItem(FLASH_BANNER_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage write failures so UI actions can continue.
  }
}

export function consumeFlashBanner(): FlashBannerPayload | null {
  try {
    const storedValue = sessionStorage.getItem(FLASH_BANNER_STORAGE_KEY);
    if (!storedValue) {
      return null;
    }

    sessionStorage.removeItem(FLASH_BANNER_STORAGE_KEY);
    const parsedValue = JSON.parse(storedValue) as Partial<FlashBannerPayload>;

    if (typeof parsedValue.message !== 'string' || typeof parsedValue.durationMs !== 'number') {
      return null;
    }

    const variant: FlashBannerVariant = parsedValue.variant === 'error' ? 'error' : 'success';

    return {
      message: parsedValue.message,
      durationMs: parsedValue.durationMs,
      variant,
    };
  } catch {
    return null;
  }
}

export function broadcastFlashBanner(payload: FlashBannerPayload): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<FlashBannerPayload>(FLASH_BANNER_EVENT, { detail: payload }));
}
