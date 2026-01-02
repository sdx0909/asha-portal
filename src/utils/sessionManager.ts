import { SessionTimeoutConfig, SessionState } from '../types/auth.types';

/**
 * Session Manager for handling user session timeout and activity tracking
 */
class SessionManager {
  private config: SessionTimeoutConfig = {
    timeoutMinutes: 30, // 30 minutes timeout
    warningMinutes: 5   // Show warning 5 minutes before timeout
  };

  private state: SessionState = {
    isActive: false,
    lastActivity: Date.now(),
    timeoutId: null,
    warningTimeoutId: null
  };

  private onSessionExpired: (() => void) | null = null;
  private onSessionWarning: (() => void) | null = null;

  // Activity events to track
  private activityEvents = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click'
  ];

  /**
   * Start session monitoring
   */
  startSession(onExpired: () => void, onWarning?: () => void): void {
    this.onSessionExpired = onExpired;
    this.onSessionWarning = onWarning || null;
    
    this.state.isActive = true;
    this.state.lastActivity = Date.now();
    
    // Add activity listeners
    this.addActivityListeners();
    
    // Start timeout timers
    this.resetTimers();
    
    console.log('🔐 Session started with', this.config.timeoutMinutes, 'minute timeout');
  }

  /**
   * Clear session and cleanup
   */
  clearSession(): void {
    this.state.isActive = false;
    
    // Remove activity listeners
    this.removeActivityListeners();
    
    // Clear timers
    this.clearTimers();
    
    console.log('🔐 Session cleared');
  }

  /**
   * Update session configuration
   */
  updateConfig(config: Partial<SessionTimeoutConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.state.isActive) {
      this.resetTimers();
    }
  }

  /**
   * Get current session state
   */
  getSessionState(): SessionState {
    return { ...this.state };
  }

  /**
   * Get time remaining until session expires (in milliseconds)
   */
  getTimeRemaining(): number {
    if (!this.state.isActive) return 0;
    
    const timeoutMs = this.config.timeoutMinutes * 60 * 1000;
    const elapsed = Date.now() - this.state.lastActivity;
    const remaining = timeoutMs - elapsed;
    
    return Math.max(0, remaining);
  }

  /**
   * Check if session is about to expire
   */
  isSessionExpiring(): boolean {
    const remaining = this.getTimeRemaining();
    const warningMs = this.config.warningMinutes * 60 * 1000;
    
    return remaining > 0 && remaining <= warningMs;
  }

  /**
   * Manually extend session
   */
  extendSession(): void {
    if (!this.state.isActive) return;
    
    this.updateActivity();
    console.log('🔐 Session extended manually');
  }

  /**
   * Add activity event listeners
   */
  private addActivityListeners(): void {
    this.activityEvents.forEach(event => {
      document.addEventListener(event, this.handleActivity, true);
    });
  }

  /**
   * Remove activity event listeners
   */
  private removeActivityListeners(): void {
    this.activityEvents.forEach(event => {
      document.removeEventListener(event, this.handleActivity, true);
    });
  }

  /**
   * Handle user activity
   */
  private handleActivity = (): void => {
    if (!this.state.isActive) return;
    
    this.updateActivity();
  };

  /**
   * Update last activity time and reset timers
   */
  private updateActivity(): void {
    this.state.lastActivity = Date.now();
    this.resetTimers();
  }

  /**
   * Reset timeout timers
   */
  private resetTimers(): void {
    this.clearTimers();
    
    const timeoutMs = this.config.timeoutMinutes * 60 * 1000;
    const warningMs = (this.config.timeoutMinutes - this.config.warningMinutes) * 60 * 1000;
    
    // Set warning timer
    if (this.onSessionWarning && warningMs > 0) {
      this.state.warningTimeoutId = setTimeout(() => {
        if (this.state.isActive && this.onSessionWarning) {
          this.onSessionWarning();
        }
      }, warningMs);
    }
    
    // Set session timeout timer
    this.state.timeoutId = setTimeout(() => {
      if (this.state.isActive && this.onSessionExpired) {
        this.handleSessionExpired();
      }
    }, timeoutMs);
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
      this.state.timeoutId = null;
    }
    
    if (this.state.warningTimeoutId) {
      clearTimeout(this.state.warningTimeoutId);
      this.state.warningTimeoutId = null;
    }
  }

  /**
   * Handle session expiration
   */
  private handleSessionExpired(): void {
    console.log('🔐 Session expired due to inactivity');
    
    this.clearSession();
    
    if (this.onSessionExpired) {
      this.onSessionExpired();
    }
  }

  /**
   * Format remaining time as human readable string
   */
  formatTimeRemaining(): string {
    const remaining = this.getTimeRemaining();
    
    if (remaining <= 0) return '0:00';
    
    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get session activity status
   */
  getActivityStatus(): 'active' | 'warning' | 'expired' {
    if (!this.state.isActive) return 'expired';
    
    const remaining = this.getTimeRemaining();
    
    if (remaining <= 0) return 'expired';
    if (this.isSessionExpiring()) return 'warning';
    
    return 'active';
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();

// Export utilities for session management
export const sessionUtils = {
  /**
   * Format milliseconds to MM:SS format
   */
  formatTime: (ms: number): string => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  /**
   * Check if session storage is available
   */
  isSessionStorageAvailable: (): boolean => {
    try {
      const test = '__session_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if local storage is available
   */
  isLocalStorageAvailable: (): boolean => {
    try {
      const test = '__local_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get session data from storage
   */
  getSessionData: (key: string): any => {
    try {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set session data to storage
   */
  setSessionData: (key: string, data: any): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to set session data:', error);
    }
  },

  /**
   * Remove session data from storage
   */
  removeSessionData: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove session data:', error);
    }
  }
};