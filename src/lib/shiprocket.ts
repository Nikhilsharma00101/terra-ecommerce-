import { Product } from '@/models/Product';

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

export class ShiprocketService {
  private static instance: ShiprocketService;

  private constructor() {}

  public static getInstance(): ShiprocketService {
    if (!ShiprocketService.instance) {
      ShiprocketService.instance = new ShiprocketService();
    }
    return ShiprocketService.instance;
  }

  private async getToken(): Promise<string> {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
      throw new Error('Shiprocket credentials are not configured in environment variables.');
    }

    const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Shiprocket Auth Error:', err);
      throw new Error('Failed to authenticate with Shiprocket');
    }

    const data = await response.json();
    return data.token;
  }

  private async makeApiCall(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) {
    const token = await this.getToken();
    
    const response = await fetch(`${SHIPROCKET_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`Shiprocket API Error [${endpoint}]:`, data);
      throw new Error(data.message || 'Shiprocket API request failed');
    }
    return data;
  }

  /**
   * Pushes the order to Shiprocket
   */
  public async createOrder(order: any, paymentMethod: 'Prepaid' | 'COD'): Promise<any> {
    // 1. Map order items and fetch product weights
    const productIds = order.items.map((i: any) => i.productId);
    
    const validObjectIds = productIds.filter((id: string) => id && id.length === 24);
    const allDbProducts = await Product.find({ 
      $or: [
         { _id: { $in: validObjectIds } },
         { slug: { $in: productIds } }
      ]
    }).lean();

    let totalWeight = 0;
    let maxLen = 10, maxBreadth = 10, maxHt = 10;

    const orderItems = order.items.map((item: any) => {
      const dbProd: any = allDbProducts.find((p: any) => p._id.toString() === item.productId || p.slug === item.productId);
      
      if (dbProd) {
        totalWeight += (dbProd.weight || 0.5) * item.quantity;
        maxLen = Math.max(maxLen, dbProd.dimensions?.length || 10);
        maxBreadth = Math.max(maxBreadth, dbProd.dimensions?.breadth || 10);
        maxHt = Math.max(maxHt, dbProd.dimensions?.height || 10);
      } else {
        totalWeight += 0.5 * item.quantity;
      }

      return {
        name: item.name,
        sku: item.productId,
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
      };
    });

    // Handle edge case where weight might end up as 0 (Shiprocket requires > 0)
    if (totalWeight <= 0) totalWeight = 0.5;

    const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary';

    const payload = {
      order_id: order.orderNumber,
      order_date: new Date(order.createdAt || Date.now()).toISOString().replace('T', ' ').substring(0, 16),
      pickup_location: pickupLocation,
      billing_customer_name: order.shippingAddress.firstName,
      billing_last_name: order.shippingAddress.lastName || '',
      billing_address: order.shippingAddress.address1,
      billing_address_2: order.shippingAddress.address2 || '',
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.postalCode,
      billing_state: order.shippingAddress.state,
      billing_country: order.shippingAddress.country || 'India',
      billing_email: order.customerEmail,
      billing_phone: order.customerPhone || '0000000000',
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: paymentMethod,
      sub_total: order.total,
      length: maxLen,
      breadth: maxBreadth,
      height: maxHt,
      weight: parseFloat(totalWeight.toFixed(2)),
    };

    return await this.makeApiCall('/orders/create/adhoc', 'POST', payload);
  }

  /**
   * Assigns a courier and generates AWB
   */
  public async assignCourier(shipmentId: number): Promise<any> {
    return await this.makeApiCall('/courier/assign/awb', 'POST', {
      shipment_id: shipmentId
    });
  }

  /**
   * Generates Shipping Label PDF URL
   */
  public async generateLabel(shipmentId: number[]): Promise<any> {
    return await this.makeApiCall('/courier/generate/label', 'POST', {
      shipment_id: shipmentId
    });
  }

  /**
   * Generates Manifest PDF URL
   */
  public async generateManifest(shipmentId: number[]): Promise<any> {
    return await this.makeApiCall('/manifests/generate', 'POST', {
      shipment_id: shipmentId
    });
  }

  /**
   * Requests Pickup
   */
  public async requestPickup(shipmentId: number[]): Promise<any> {
    return await this.makeApiCall('/courier/generate/pickup', 'POST', {
      shipment_id: shipmentId
    });
  }

  /**
   * Cancels an order in Shiprocket
   */
  public async cancelOrder(shiprocketOrderIds: number[]): Promise<any> {
    return await this.makeApiCall('/orders/cancel', 'POST', {
      ids: shiprocketOrderIds
    });
  }

  /**
   * Tracks a shipment by AWB
   */
  public async trackShipment(awb: string): Promise<any> {
    return await this.makeApiCall(`/courier/track/awb/${awb}`, 'GET');
  }
}

// Export a singleton instance for easy imports
export const shiprocket = ShiprocketService.getInstance();
