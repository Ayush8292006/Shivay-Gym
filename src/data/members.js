// 60 realistic Indian members with diverse ages, statuses, plans, and metrics

export const members = [
  {
    id: "SHIV-1001",
    name: "Aarav Sharma",
    phone: "+91 98101 23451",
    email: "aarav.sharma@example.com",
    age: 27,
    gender: "Male",
    bloodGroup: "O+",
    plan: "Yearly Elite Strength",
    planId: "PLAN-12M",
    joinDate: "2024-01-15",
    expiryDate: "2025-01-15",
    trainer: "Vikram Chauhan",
    trainerId: "TR-01",
    status: "Active",
    duesPending: 0,
    attendanceStreak: 18,
    totalVisits: 142,
    lastVisit: "2024-11-09",
    emergencyContact: { name: "Sunita Sharma (Mother)", phone: "+91 98101 99881" },
    measurements: { weight: 76.4, height: 178, bodyFat: 14.8, chest: 41, waist: 32, arms: 15.2, thighs: 23 },
    assignedDiet: "Muscle Hypertrophy 2800 kcal (Non-Veg)",
    assignedWorkout: "Upper / Lower Heavy Strength Split",
    notes: "Goal: 200kg deadlift by Dec. Great discipline, never misses Monday leg sessions.",
    messageHistory: [
      { id: "M101", date: "2024-11-09 06:00", text: "Daily Motivation: The iron never lies to you. Have a powerful session today!", channel: "WhatsApp", status: "Read" },
      { id: "M102", date: "2024-10-31 09:30", text: "Diwali Special Offer: Get 20% off on your renewal!", channel: "WhatsApp", status: "Read" }
    ]
  },
  {
    id: "SHIV-1002",
    name: "Priya Nair",
    phone: "+91 98202 34562",
    email: "priya.nair@example.com",
    age: 25,
    gender: "Female",
    bloodGroup: "B+",
    plan: "Half-Yearly Builder",
    planId: "PLAN-6M",
    joinDate: "2024-05-18",
    expiryDate: "2024-11-18",
    trainer: "Neha Sharma",
    trainerId: "TR-03",
    status: "Expiring Soon",
    duesPending: 0,
    attendanceStreak: 4,
    totalVisits: 84,
    lastVisit: "2024-11-08",
    emergencyContact: { name: "K. Nair (Father)", phone: "+91 98202 99112" },
    measurements: { weight: 58.2, height: 162, bodyFat: 23.5, chest: 34, waist: 27, arms: 11.5, thighs: 20 },
    assignedDiet: "Fat Loss 1600 kcal (Veg High Protein)",
    assignedWorkout: "Glute & Core Specialized Conditioning",
    notes: "Membership expiring in 9 days. Offered early bird renewal with 1 free month.",
    messageHistory: [
      { id: "M103", date: "2024-11-08 11:00", text: "Hi Priya, your gym membership expires on 18 Nov. Renew today to keep your streak!", channel: "WhatsApp", status: "Delivered" }
    ]
  },
  {
    id: "SHIV-1003",
    name: "Gurpreet Singh",
    phone: "+91 98303 45673",
    email: "gurpreet.singh@example.com",
    age: 32,
    gender: "Male",
    bloodGroup: "A+",
    plan: "Quarterly Foundation",
    planId: "PLAN-3M",
    joinDate: "2024-08-10",
    expiryDate: "2024-11-10",
    trainer: "Amanpreet Singh",
    trainerId: "TR-02",
    status: "Expiring Soon",
    duesPending: 1500,
    attendanceStreak: 0,
    totalVisits: 38,
    lastVisit: "2024-11-02",
    emergencyContact: { name: "Manjit Kaur (Wife)", phone: "+91 98303 88771" },
    measurements: { weight: 89.0, height: 182, bodyFat: 21.0, chest: 43, waist: 36, arms: 16.0, thighs: 24.5 },
    assignedDiet: "Lean Bulking 3000 kcal (Non-Veg)",
    assignedWorkout: "Push / Pull / Legs Hypertrophy",
    notes: "Pending ₹1,500 due from last month supplementary PT session.",
    messageHistory: [
      { id: "M104", date: "2024-11-07 14:00", text: "Reminder: ₹1,500 pending dues for Shiva Gym account.", channel: "SMS", status: "Sent" }
    ]
  },
  {
    id: "SHIV-1004",
    name: "Ananya Iyer",
    phone: "+91 98404 56784",
    email: "ananya.iyer@example.com",
    age: 23,
    gender: "Female",
    bloodGroup: "AB+",
    plan: "Personal Training (36 Sessions)",
    planId: "PLAN-PT",
    joinDate: "2024-09-01",
    expiryDate: "2024-12-01",
    trainer: "Neha Sharma",
    trainerId: "TR-03",
    status: "Active",
    duesPending: 0,
    attendanceStreak: 12,
    totalVisits: 45,
    lastVisit: "2024-11-09",
    emergencyContact: { name: "Suresh Iyer (Brother)", phone: "+91 98404 11223" },
    measurements: { weight: 52.1, height: 158, bodyFat: 21.8, chest: 33, waist: 25.5, arms: 10.8, thighs: 19 },
    assignedDiet: "Maintenance & Toning 1750 kcal (Veg)",
    assignedWorkout: "Functional Strength & Mobility Routine",
    notes: "Training for half marathon while maintaining lean muscle mass.",
    messageHistory: []
  },
  {
    id: "SHIV-1005",
    name: "Rohan Mehta",
    phone: "+91 98505 67895",
    email: "rohan.mehta@example.com",
    age: 38,
    gender: "Male",
    bloodGroup: "O-",
    plan: "Monthly Starter",
    planId: "PLAN-1M",
    joinDate: "2024-10-01",
    expiryDate: "2024-11-01",
    trainer: "Rohit Deshmukh",
    trainerId: "TR-04",
    status: "Expired",
    duesPending: 0,
    attendanceStreak: 0,
    totalVisits: 14,
    lastVisit: "2024-10-29",
    emergencyContact: { name: "Ritu Mehta (Wife)", phone: "+91 98505 33441" },
    measurements: { weight: 84.5, height: 175, bodyFat: 26.2, chest: 40, waist: 37, arms: 14.0, thighs: 22 },
    assignedDiet: "Fat Loss Deficit 1900 kcal (Veg)",
    assignedWorkout: "Full Body Machine-Assisted Circuit",
    notes: "Expired on Nov 1st. Work travel to Mumbai reported.",
    messageHistory: [
      { id: "M105", date: "2024-11-04 10:15", text: "We miss you at Shivay Gym! Renew this week for 10% off.", channel: "WhatsApp", status: "Delivered" }
    ]
  },
  {
    id: "SHIV-1006",
    name: "Sneha Verma",
    phone: "+91 98606 78906",
    email: "sneha.verma@example.com",
    age: 29,
    gender: "Female",
    bloodGroup: "B-",
    plan: "Yearly Elite Strength",
    planId: "PLAN-12M",
    joinDate: "2024-03-12",
    expiryDate: "2025-03-12",
    trainer: "Pooja Varma",
    trainerId: "TR-05",
    status: "Frozen",
    duesPending: 0,
    attendanceStreak: 0,
    totalVisits: 67,
    lastVisit: "2024-10-15",
    emergencyContact: { name: "Deepak Verma (Husband)", phone: "+91 98606 44552" },
    measurements: { weight: 61.0, height: 165, bodyFat: 24.0, chest: 35, waist: 28, arms: 11.2, thighs: 20.5 },
    assignedDiet: "Healthy Maintenance 1800 kcal (Veg)",
    assignedWorkout: "Yoga & Lower Body Rehabilitation",
    notes: "Membership frozen from Oct 16 to Nov 20 due to knee ligament recovery.",
    messageHistory: []
  },
  {
    id: "SHIV-1007",
    name: "Kabir Mathur",
    phone: "+91 98707 89017",
    email: "kabir.mathur@example.com",
    age: 22,
    gender: "Male",
    bloodGroup: "A-",
    plan: "Quarterly Foundation",
    planId: "PLAN-3M",
    joinDate: "2024-09-15",
    expiryDate: "2024-12-15",
    trainer: "Devendra Rawat",
    trainerId: "TR-06",
    status: "Active",
    duesPending: 0,
    attendanceStreak: 9,
    totalVisits: 41,
    lastVisit: "2024-11-09",
    emergencyContact: { name: "Alok Mathur (Father)", phone: "+91 98707 55663" },
    measurements: { weight: 68.2, height: 176, bodyFat: 13.5, chest: 38, waist: 30, arms: 13.8, thighs: 21 },
    assignedDiet: "Lean Hypertrophy 2600 kcal (Eggitarian)",
    assignedWorkout: "Arnold Classic Split (Chest/Back, Shoulders/Arms, Legs)",
    notes: "College student, morning 6 AM batch regular.",
    messageHistory: []
  },
  {
    id: "SHIV-1008",
    name: "Deepika Joshi",
    phone: "+91 98808 90128",
    email: "deepika.joshi@example.com",
    age: 34,
    gender: "Female",
    bloodGroup: "O+",
    plan: "Half-Yearly Builder",
    planId: "PLAN-6M",
    joinDate: "2024-06-20",
    expiryDate: "2024-12-20",
    trainer: "Neha Sharma",
    trainerId: "TR-03",
    status: "Active",
    duesPending: 0,
    attendanceStreak: 6,
    totalVisits: 72,
    lastVisit: "2024-11-08",
    emergencyContact: { name: "Manoj Joshi (Husband)", phone: "+91 98808 66774" },
    measurements: { weight: 64.0, height: 160, bodyFat: 27.0, chest: 36, waist: 30, arms: 12.0, thighs: 22 },
    assignedDiet: "PCOD Friendly Low-GI 1650 kcal (Veg)",
    assignedWorkout: "Strength & Resistance Circuit for Hormonal Balance",
    notes: "Has reversed HbA1c from 6.2 to 5.6 over past 4 months.",
    messageHistory: []
  },
  {
    id: "SHIV-1009",
    name: "Harish Chawla",
    phone: "+91 98909 01239",
    email: "harish.chawla@example.com",
    age: 46,
    gender: "Male",
    bloodGroup: "B+",
    plan: "Yearly Elite Strength",
    planId: "PLAN-12M",
    joinDate: "2023-11-12",
    expiryDate: "2024-11-12",
    trainer: "Vikram Chauhan",
    trainerId: "TR-01",
    status: "Expiring Soon",
    duesPending: 0,
    attendanceStreak: 21,
    totalVisits: 220,
    lastVisit: "2024-11-09",
    emergencyContact: { name: "Suman Chawla (Wife)", phone: "+91 98909 77885" },
    measurements: { weight: 81.3, height: 174, bodyFat: 18.5, chest: 42, waist: 34, arms: 15.0, thighs: 23 },
    assignedDiet: "Longevity & Heart Health 2200 kcal",
    assignedWorkout: "Compound Movements + Zone 2 Cardio",
    notes: "One of our most dedicated senior members. Expiry in 3 days. Promised to renew Yearly.",
    messageHistory: [
      { id: "M106", date: "2024-11-07 10:00", text: "Hi Harish ji, your yearly renewal is ready with loyality bonus!", channel: "WhatsApp", status: "Read" }
    ]
  },
  {
    id: "SHIV-1010",
    name: "Tanya Kapoor",
    phone: "+91 98110 12340",
    email: "tanya.kapoor@example.com",
    age: 26,
    gender: "Female",
    bloodGroup: "A+",
    plan: "Monthly Starter",
    planId: "PLAN-1M",
    joinDate: "2024-10-12",
    expiryDate: "2024-11-12",
    trainer: "Devendra Rawat",
    trainerId: "TR-06",
    status: "Expiring Soon",
    duesPending: 500,
    attendanceStreak: 2,
    totalVisits: 16,
    lastVisit: "2024-11-07",
    emergencyContact: { name: "Kunal Kapoor (Brother)", phone: "+91 98110 88996" },
    measurements: { weight: 55.4, height: 164, bodyFat: 22.0, chest: 33, waist: 26, arms: 10.5, thighs: 19.5 },
    assignedDiet: "Calorie Deficit 1500 kcal",
    assignedWorkout: "HIIT & Core Conditioning",
    notes: "Locker key deposit ₹500 pending.",
    messageHistory: []
  },
  {
    id: "SHIV-1011",
    name: "Arjun Reddy",
    phone: "+91 98211 23451",
    email: "arjun.reddy@example.com",
    age: 31,
    gender: "Male",
    bloodGroup: "O+",
    plan: "Yearly Elite Strength",
    planId: "PLAN-12M",
    joinDate: "2024-02-14",
    expiryDate: "2025-02-14",
    trainer: "Amanpreet Singh",
    trainerId: "TR-02",
    status: "Active",
    duesPending: 0,
    attendanceStreak: 15,
    totalVisits: 130,
    lastVisit: "2024-11-09",
    emergencyContact: { name: "Venkat Reddy (Father)", phone: "+91 98211 99001" },
    measurements: { weight: 83.0, height: 180, bodyFat: 15.2, chest: 42, waist: 33, arms: 15.8, thighs: 23.5 },
    assignedDiet: "High Calorie Athletic 3200 kcal",
    assignedWorkout: "CrossFit WOD & Olympic Lifting",
    notes: "Bench press PR: 120kg. Squat PR: 160kg.",
    messageHistory: []
  },
  {
    id: "SHIV-1012",
    name: "Kavita Rao",
    phone: "+91 98312 34562",
    email: "kavita.rao@example.com",
    age: 41,
    gender: "Female",
    bloodGroup: "B+",
    plan: "Quarterly Foundation",
    planId: "PLAN-3M",
    joinDate: "2024-07-05",
    expiryDate: "2024-10-05",
    trainer: "Pooja Varma",
    trainerId: "TR-05",
    status: "Expired",
    duesPending: 0,
    attendanceStreak: 0,
    totalVisits: 28,
    lastVisit: "2024-09-28",
    emergencyContact: { name: "Srinivas Rao (Husband)", phone: "+91 98312 88992" },
    measurements: { weight: 69.5, height: 157, bodyFat: 31.0, chest: 37, waist: 33, arms: 12.5, thighs: 23 },
    assignedDiet: "Joint Health Anti-Inflammatory 1600 kcal",
    assignedWorkout: "Low Impact Functional Strength & Pilates",
    notes: "Stopped coming after knee ache. Sent physiotherapist consultation invite.",
    messageHistory: [
      { id: "M107", date: "2024-10-10 11:30", text: "Hi Kavita, Shivay Gym offers joint-safe rehabilitation. Come visit us!", channel: "WhatsApp", status: "Delivered" }
    ]
  },
  {
    id: "SHIV-1013",
    name: "Mohd. Zeeshan",
    phone: "+91 98413 45673",
    email: "zeeshan.m@example.com",
    age: 28,
    gender: "Male",
    bloodGroup: "AB-",
    plan: "Half-Yearly Builder",
    planId: "PLAN-6M",
    joinDate: "2024-04-10",
    expiryDate: "2024-10-10",
    trainer: "Vikram Chauhan",
    trainerId: "TR-01",
    status: "Left",
    duesPending: 0,
    attendanceStreak: 0,
    totalVisits: 55,
    lastVisit: "2024-10-02",
    emergencyContact: { name: "Farhan Zeeshan (Brother)", phone: "+91 98413 77883" },
    measurements: { weight: 75.0, height: 175, bodyFat: 17.0, chest: 39, waist: 32, arms: 14.2, thighs: 22 },
    assignedDiet: "Clean Bulking 2700 kcal",
    assignedWorkout: "Bro Split (Chest, Back, Arms, Shoulders, Legs)",
    notes: "Relocated to Bangalore for tech job. Marked as Left.",
    messageHistory: []
  },
  {
    id: "SHIV-1014",
    name: "Ritu Singhania",
    phone: "+91 98514 56784",
    email: "ritu.singhania@example.com",
    age: 36,
    gender: "Female",
    bloodGroup: "O+",
    plan: "Yearly Elite Strength",
    planId: "PLAN-12M",
    joinDate: "2024-04-01",
    expiryDate: "2025-04-01",
    trainer: "Neha Sharma",
    trainerId: "TR-03",
    status: "Active",
    duesPending: 0,
    attendanceStreak: 8,
    totalVisits: 104,
    lastVisit: "2024-11-09",
    emergencyContact: { name: "Anand Singhania (Husband)", phone: "+91 98514 66774" },
    measurements: { weight: 62.8, height: 167, bodyFat: 23.0, chest: 35, waist: 28, arms: 11.8, thighs: 21 },
    assignedDiet: "Balanced Indian Diet 1700 kcal (Paneer & Dal)",
    assignedWorkout: "Full Body Functional Kettlebell & Barbell",
    notes: "Attends 7:00 AM batch daily without fail. Very positive presence.",
    messageHistory: []
  },
  {
    id: "SHIV-1015",
    name: "Manish Tiwari",
    phone: "+91 98615 67895",
    email: "manish.tiwari@example.com",
    age: 44,
    gender: "Male",
    bloodGroup: "B+",
    plan: "Quarterly Foundation",
    planId: "PLAN-3M",
    joinDate: "2024-09-01",
    expiryDate: "2024-12-01",
    trainer: "Rohit Deshmukh",
    trainerId: "TR-04",
    status: "Active",
    duesPending: 0,
    attendanceStreak: 5,
    totalVisits: 32,
    lastVisit: "2024-11-08",
    emergencyContact: { name: "Seema Tiwari (Wife)", phone: "+91 98615 55665" },
    measurements: { weight: 86.4, height: 172, bodyFat: 25.5, chest: 41, waist: 36, arms: 14.5, thighs: 23 },
    assignedDiet: "Low Carb Fat Loss 2000 kcal",
    assignedWorkout: "Upper / Lower Strength Progression",
    notes: "Working on back posture and thoracic mobility.",
    messageHistory: []
  }
];

// Helper to expand seed to 60 total members realistically
const indianFirstNames = [
  "Aditya", "Akash", "Bhavna", "Chetan", "Divya", "Gaurav", "Himanshu", "Ishaan", 
  "Jatin", "Kunal", "Lakshmi", "Meera", "Nikhil", "Omkar", "Pankaj", "Qasim",
  "Rajesh", "Sachin", "Tanvi", "Umesh", "Varun", "Yash", "Zoya", "Alok",
  "Brijesh", "Charu", "Dev", "Ekta", "Girish", "Harshit", "Isha", "Jagdish",
  "Karan", "Lavanya", "Mayank", "Naveen", "Pranav", "Rashmi", "Saurabh", "Tarun",
  "Vipin", "Vineet", "Shikha", "Ankit", "Bikram"
];

const indianLastNames = [
  "Bansal", "Chopra", "Dixit", "Garg", "Hegde", "Jain", "Kulkarni", "Lal",
  "Malhotra", "Nanda", "Pandey", "Rathore", "Saxena", "Thakur", "Upadhyay", "Vyas",
  "Yadav", "Bajpai", "Chatterjee", "Dubey", "Goswami", "Kashyap", "Mishra", "Patil",
  "Rastogi", "Sengupta", "Tripathi", "Venkatesh", "Ahluwalia", "Bhatt", "Chakraborty",
  "Dhar", "Gill", "Kapoor", "Mukherjee", "Nambiar", "Prasad", "Sood", "Verma", "Wadhwa"
];

const plansList = [
  { name: "Monthly Starter", id: "PLAN-1M" },
  { name: "Quarterly Foundation", id: "PLAN-3M" },
  { name: "Half-Yearly Builder", id: "PLAN-6M" },
  { name: "Yearly Elite Strength", id: "PLAN-12M" },
  { name: "Personal Training (36 Sessions)", id: "PLAN-PT" }
];

const trainerNames = [
  { name: "Vikram Chauhan", id: "TR-01" },
  { name: "Amanpreet Singh", id: "TR-02" },
  { name: "Neha Sharma", id: "TR-03" },
  { name: "Rohit Deshmukh", id: "TR-04" },
  { name: "Pooja Varma", id: "TR-05" },
  { name: "Devendra Rawat", id: "TR-06" }
];

// Generate remainder up to 60 members
for (let i = 16; i <= 60; i++) {
  const firstName = indianFirstNames[(i * 3 + 7) % indianFirstNames.length];
  const lastName = indianLastNames[(i * 5 + 11) % indianLastNames.length];
  const isFemale = ["Bhavna", "Divya", "Lakshmi", "Meera", "Tanvi", "Zoya", "Charu", "Ekta", "Isha", "Lavanya", "Rashmi", "Shikha"].includes(firstName);
  const planObj = plansList[(i * 2 + 1) % plansList.length];
  const trainerObj = trainerNames[i % trainerNames.length];
  
  // Status balance: mostly active, some expiring, some expired, few frozen, few left
  let status = "Active";
  let duesPending = 0;
  if (i % 9 === 0) status = "Expiring Soon";
  else if (i % 11 === 0) status = "Expired";
  else if (i % 17 === 0) status = "Frozen";
  else if (i % 23 === 0) status = "Left";
  
  if (i % 8 === 0 && status !== "Left") duesPending = (i % 3 + 1) * 750;

  const joinMonth = (i % 10) + 1;
  const joinDate = `2024-0${joinMonth > 9 ? '9' : joinMonth}-1${i % 8 + 1}`;
  
  let expiryDate = "2025-05-15";
  if (status === "Expiring Soon") expiryDate = `2024-11-1${i % 7 + 1}`;
  else if (status === "Expired") expiryDate = `2024-10-2${i % 8 + 1}`;
  else if (planObj.id === "PLAN-1M") expiryDate = "2024-12-05";
  else if (planObj.id === "PLAN-3M") expiryDate = "2025-01-20";

  members.push({
    id: `SHIV-10${i < 10 ? '0' + i : i}`,
    name: `${firstName} ${lastName}`,
    phone: `+91 ${98100 + i * 17} ${10000 + i * 123}`.slice(0, 15),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    age: 20 + (i % 32),
    gender: isFemale ? "Female" : "Male",
    bloodGroup: ["A+", "B+", "O+", "AB+", "O-"][(i * 3) % 5],
    plan: planObj.name,
    planId: planObj.id,
    joinDate,
    expiryDate,
    trainer: trainerObj.name,
    trainerId: trainerObj.id,
    status,
    duesPending,
    attendanceStreak: status === "Active" ? (i % 14) + 1 : 0,
    totalVisits: (i * 4) + 12,
    lastVisit: status === "Active" ? "2024-11-09" : "2024-10-25",
    emergencyContact: {
      name: `${lastName} Family`,
      phone: `+91 98990 ${20000 + i * 111}`.slice(0, 15)
    },
    measurements: {
      weight: isFemale ? 52 + (i % 18) : 68 + (i % 26),
      height: isFemale ? 155 + (i % 12) : 170 + (i % 15),
      bodyFat: isFemale ? 22 + (i % 8) : 13 + (i % 12),
      chest: isFemale ? 34 + (i % 4) : 40 + (i % 6),
      waist: isFemale ? 27 + (i % 5) : 32 + (i % 6),
      arms: isFemale ? 11 + (i % 2) : 14.5 + (i % 3),
      thighs: isFemale ? 20 + (i % 3) : 22.5 + (i % 4)
    },
    assignedDiet: isFemale 
      ? (i % 2 === 0 ? "Fat Loss High Protein (Veg) 1600 kcal" : "Muscle Toning & Wellness (Veg) 1800 kcal")
      : (i % 2 === 0 ? "Hypertrophy High Protein (Non-Veg) 2800 kcal" : "Lean Strength Protocol (Eggitarian) 2400 kcal"),
    assignedWorkout: i % 3 === 0 
      ? "Push / Pull / Legs Hypertrophy Split" 
      : (i % 3 === 1 ? "Upper / Lower Strength Progression" : "Full Body Functional Circuit"),
    notes: status === "Expiring Soon" ? "Renewal alert triggered. Follow up scheduled." : "Regular training attendance.",
    messageHistory: []
  });
}

