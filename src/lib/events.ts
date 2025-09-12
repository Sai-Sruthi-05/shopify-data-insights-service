import { ApiService } from './api';
import { v4 as uuidv4 } from 'uuid';
import { CustomEventType } from '../types';

export class EventTracker {
  private static sessionId = uuidv4();
  private static userId: string | null = null;

  static setUserId(userId: string | null) {
    this.userId = userId;
  }

  static async trackCartAbandoned(cartData: any) {
    try {
      await ApiService.trackEvent({
        eventType: 'cart_abandoned' as CustomEventType,
        userId: this.userId,
        sessionId: this.sessionId,
        data: {
          cartItems: cartData.items,
          cartValue: cartData.total,
          abandonedAt: new Date().toISOString(),
          pageUrl: window.location.href,
        },
      });
    } catch (error) {
      console.error('Failed to track cart abandoned event:', error);
    }
  }

  static async trackCheckoutStarted(checkoutData: any) {
    try {
      await ApiService.trackEvent({
        eventType: 'checkout_started' as CustomEventType,
        userId: this.userId,
        sessionId: this.sessionId,
        data: {
          cartItems: checkoutData.items,
          cartValue: checkoutData.total,
          checkoutStep: 'initiated',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to track checkout started event:', error);
    }
  }

  static async trackProductViewed(productId: string, productData: any) {
    try {
      await ApiService.trackEvent({
        eventType: 'product_viewed' as CustomEventType,
        userId: this.userId,
        sessionId: this.sessionId,
        data: {
          productId,
          productName: productData.name,
          productCategory: productData.category,
          productPrice: productData.price,
          viewedAt: new Date().toISOString(),
          referrer: document.referrer,
        },
      });
    } catch (error) {
      console.error('Failed to track product viewed event:', error);
    }
  }

  static async trackUserRegistered(userData: any) {
    try {
      await ApiService.trackEvent({
        eventType: 'user_registered' as CustomEventType,
        userId: userData.id,
        sessionId: this.sessionId,
        data: {
          registrationMethod: 'email',
          userRole: userData.role,
          registeredAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to track user registered event:', error);
    }
  }
}