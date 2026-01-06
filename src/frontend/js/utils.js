/**
 * Utility Functions
 * Common UI utilities for confirmations and notifications
 */

class Utils {
  /**
   * Show a confirmation dialog
   * @param {string} message - Confirmation message
   * @param {string} title - Dialog title (optional)
   * @param {string} confirmText - Confirm button text (optional)
   * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
   */
  static confirm(message, title = 'Confirm Action', confirmText = 'Confirm') {
    return new Promise((resolve) => {
      const modal = document.getElementById('confirm-modal');
      const titleEl = document.getElementById('confirm-title');
      const messageEl = document.getElementById('confirm-message');
      const okBtn = document.getElementById('confirm-ok-btn');
      const cancelBtn = document.getElementById('confirm-cancel-btn');

      // Check if elements exist
      if (!modal || !titleEl || !messageEl || !okBtn || !cancelBtn) {
        console.error('Confirmation modal elements not found. Falling back to browser confirm.');
        const result = window.confirm(message);
        resolve(result);
        return;
      }

      // Set content
      titleEl.textContent = title;
      messageEl.textContent = message;
      okBtn.textContent = confirmText;

      // Show modal
      modal.classList.add('active');

      // Handle confirm
      const handleConfirm = () => {
        cleanup();
        resolve(true);
      };

      // Handle cancel
      const handleCancel = () => {
        cleanup();
        resolve(false);
      };

      // Cleanup function
      const cleanup = () => {
        modal.classList.remove('active');
        okBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
        modal.removeEventListener('click', handleModalClick);
      };

      // Handle click outside modal
      const handleModalClick = (e) => {
        if (e.target === modal) {
          handleCancel();
        }
      };

      // Attach event listeners
      okBtn.addEventListener('click', handleConfirm);
      cancelBtn.addEventListener('click', handleCancel);
      modal.addEventListener('click', handleModalClick);
    });
  }

  /**
   * Show a notification toast
   * @param {string} message - Notification message
   * @param {string} type - Type of notification: 'success', 'error', 'info' (default: 'info')
   * @param {number} duration - Duration in milliseconds (default: 3000, 0 = no auto-close)
   */
  static showNotification(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('notification-toast');
    const messageEl = document.getElementById('toast-message');
    const closeBtn = document.getElementById('toast-close');

    // Check if elements exist
    if (!toast || !messageEl || !closeBtn) {
      console.error('Notification toast elements not found. Falling back to browser alert.');
      window.alert(message);
      return;
    }

    // Remove existing type classes
    toast.classList.remove('success', 'error', 'info');
    // Add new type class
    toast.classList.add(type);

    // Set message
    messageEl.textContent = message;

    // Show toast
    toast.classList.add('show');

    // Handle close
    const handleClose = () => {
      toast.classList.add('hiding');
      setTimeout(() => {
        toast.classList.remove('show', 'hiding');
      }, 300);
    };

    // Close button
    closeBtn.onclick = handleClose;

    // Auto-close if duration is set
    if (duration > 0) {
      setTimeout(handleClose, duration);
    }
  }

  /**
   * Show success notification
   * @param {string} message - Success message
   */
  static showSuccess(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Show error notification
   * @param {string} message - Error message
   */
  static showError(message) {
    this.showNotification(message, 'error', 5000); // Show errors longer
  }

  /**
   * Show info notification
   * @param {string} message - Info message
   */
  static showInfo(message) {
    this.showNotification(message, 'info');
  }
}

// Make Utils available globally for inline onclick handlers
if (typeof window !== 'undefined') {
  window.Utils = Utils;
}

