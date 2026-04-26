/** Plan definitions — single source of truth for limits & metadata. */

export type PlanId = "trial" | "pro" | "business";

export interface PlanDef {
  id: PlanId;
  name: string;
  roLimit: number | null; // null = unlimited
  price: number; // INR per month
}

export const PLANS: Record<PlanId, PlanDef> = {
  trial: { id: "trial", name: "Trial", roLimit: 10, price: 0 },
  pro: { id: "pro", name: "Pro", roLimit: null, price: 999 },
  business: { id: "business", name: "Business", roLimit: null, price: 2999 },
};

export function getPlan(id: string | null | undefined): PlanDef {
  if (id && id in PLANS) return PLANS[id as PlanId];
  return PLANS.trial;
}
