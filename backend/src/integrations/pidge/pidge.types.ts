export type PidgeAddress = {
  name: string;
  phone: string;

  addressLine1: string;
  addressLine2?: string;

  city?: string;
  state?: string;
  postalCode?: string;

  latitude?: number;
  longitude?: number;
};

export type PidgeCreateOrderInput = {
  referenceId: string;

  pickup: PidgeAddress;
  drop: PidgeAddress;

  paymentMode?: "PREPAID" | "COD";

  amount?: number;

  package?: {
    weight?: number;

    length?: number;
    width?: number;
    height?: number;

    description?: string;
  };

  metadata?: Record<string, unknown>;
};