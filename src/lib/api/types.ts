export type Currency = "USD" | "VES" | "EUR";
export type TenantCurrency = "USD" | "COP" | "PEN" | "DOP";

export interface TenantBranding {
  id: number;
  name: string;
  currency: TenantCurrency;
  logoUrl: string | null;
  logoLightUrl: string | null;
  faviconUrl: string | null;
  mainColor: string | null;
  secondaryColor: string | null;
  thirdColor: string | null;
  buttonColor: string | null;
  buttonTextColor: string | null;
  buttonHoverColor: string | null;
  showCategories: boolean | null;
  showSubCategories: boolean | null;
  showBrands: boolean | null;
  contact1Number: string | null;
  address: string | null;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  modelNumber: string | null;
  ram: string;
  color: string;
  price: number;
  status: "AVAILABLE" | "DISCONTINUED";
  category: { id: number; name: string; imageUrl: string | null } | null;
  brand: { id: number; name: string } | null;
  stock: number;
  prices: { id: number; price: number; description: string | null }[];
  images: ProductImage[];
  features: { title: string; description: string }[];
}

export interface FinancingType {
  id: number;
  name: string;
  paymentCount: number;
  interestRate: number;
  additionalCost: number;
  /** Fracción del precio (0-1), no un monto. */
  initialPayment: number;
  isBusinessDays: boolean;
  daysBetweenPayments: number;
  payAllAtOnce: boolean;
  /** Fracción (0-1) que se descuenta del precio base. */
  priceDiscount: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description: string | null;
  defaultCurrency: Currency;
}

interface SimulationAmounts {
  price: number;
  initialPayment: number;
  installmentAmount: number;
  totalAmount: number;
  discountAmount: number;
  finalPrice: number;
}

export interface SimulationPayment {
  number: number;
  date: string;
  amount: number;
  usdAmount?: number;
  isInitial: boolean;
}

export interface Simulation extends SimulationAmounts {
  financingTypeId: number;
  name: string;
  currency: "USD" | "VES";
  surchargePercent: number;
  daysBetweenPayments: number;
  payAllAtOnce: boolean;
  priceDiscount: number;
  /** Equivalente en USD (con recargo); solo cuando currency === "VES". */
  usd: SimulationAmounts | null;
  payments: SimulationPayment[];
}
