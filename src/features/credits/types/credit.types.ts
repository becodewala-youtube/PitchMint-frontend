export interface CreditPlan {
  name: string;
  credits: number;
  price: number;
  description: string;
}

export interface CreditPlans {
  [key: string]: CreditPlan;
}
