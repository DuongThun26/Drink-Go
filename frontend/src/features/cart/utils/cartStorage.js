const GUEST_CART_SESSION_KEY = 'guestCartSessionId';

/**
 * Gets the guest cart session ID from local storage.
 * @returns {string|null} The session ID or null if not found.
 */
export const getGuestCartSessionId = () => {
  return localStorage.getItem(GUEST_CART_SESSION_KEY);
};

/**
 * Sets the guest cart session ID in local storage.
 * @param {string} sessionId - The session ID to store.
 */
export const setGuestCartSessionId = (sessionId) => {
  localStorage.setItem(GUEST_CART_SESSION_KEY, sessionId);
};

/**
 * Removes the guest cart session ID from local storage.
 */
export const clearGuestCartSessionId = () => {
  localStorage.removeItem(GUEST_CART_SESSION_KEY);
};
