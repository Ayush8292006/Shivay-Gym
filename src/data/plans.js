export const plans = [
  {
    id: "PLAN-1M",
    name: "Monthly Starter",
    durationMonths: 1,
    price: 2499,
    originalPrice: 3000,
    popular: false,
    description: "Ideal for testing the waters and short-term workout commitment.",
    features: [
      "Full gym floor access",
      "General trainer guidance",
      "Locker room & shower access",
      "Free fitness assessment",
      "Mobile app access"
    ]
  },
  {
    id: "PLAN-3M",
    name: "Quarterly Foundation",
    durationMonths: 3,
    price: 6499,
    originalPrice: 8000,
    popular: false,
    description: "Great for building habit and witnessing noticeable body recomposition.",
    features: [
      "Everything in Starter",
      "1 InBody body composition scan",
      "Custom workout split plan",
      "Weekend group class passes (4x)",
      "Steam bath access (2x / month)"
    ]
  },
  {
    id: "PLAN-6M",
    name: "Half-Yearly Builder",
    durationMonths: 6,
    price: 11499,
    originalPrice: 15000,
    popular: true,
    badge: "MOST POPULAR",
    description: "The sweet spot for disciplined progress and major physical transformations.",
    features: [
      "Everything in Foundation",
      "Monthly InBody scans & progress tracking",
      "1 Complimentary PT trial session",
      "Unlimited group fitness classes",
      "Free locker facility included",
      "15 days membership freeze option"
    ]
  },
  {
    id: "PLAN-12M",
    name: "Yearly Elite Strength",
    durationMonths: 12,
    price: 18999,
    originalPrice: 28000,
    popular: false,
    badge: "BEST VALUE (₹1,583/mo)",
    description: "Serious commitment for peak fitness with maximum privileges and value.",
    features: [
      "All-inclusive full gym & class access",
      "2 Complimentary Personal Training sessions",
      "Custom Indian diet chart by nutritionist",
      "Dedicated personal locker",
      "Unlimited steam bath recovery sessions",
      "30 days membership freeze guarantee",
      "1 Free buddy guest pass every month"
    ]
  },
  {
    id: "PLAN-PT",
    name: "Personal Training (36 Sessions)",
    durationMonths: 3,
    price: 15999,
    originalPrice: 22000,
    popular: false,
    description: "1-on-1 dedicated coaching, form correction, and personalized nutrition plan.",
    features: [
      "36 one-on-one 60-min sessions",
      "Dedicated senior coach assigned",
      "Custom macro-calculated Indian diet",
      "Weekly body metric calibrations",
      "Direct 24/7 WhatsApp guidance from coach"
    ]
  }
];

export const addOns = [
  { id: "ADDON-LOCKER", name: "Dedicated Key Locker", price: 500, period: "month" },
  { id: "ADDON-STEAM", name: "Unlimited Steam Bath Pass", price: 800, period: "month" },
  { id: "ADDON-DIET", name: "Custom Nutrition Consultation", price: 1200, period: "one-time" },
  { id: "ADDON-GUEST", name: "Weekend Guest Pass (5 Visits)", price: 999, period: "pack" }
];

