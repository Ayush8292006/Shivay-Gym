import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGym } from '../../context/GymContext';
import ImageFallback from '../../components/common/ImageFallback';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  ChevronRight,
  Calculator,
  MessageSquare,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const { gymInfo, plans, trainers, classes, showToast, addLead } = useGym();
  const navigate = useNavigate();

  // Free trial modal / form state
  const [trialForm, setTrialForm] = useState({ name: '', phone: '', preferredTime: 'Morning 6:30 AM', goal: 'Strength & Muscle Building' });
  const [trialSubmitted, setTrialSubmitted] = useState(false);

  // BMI preview state
  const [bmiInput, setBmiInput] = useState({ weight: 72, height: 175 });
  const [calculatedBmi, setCalculatedBmi] = useState(null);

  const calculateLandingBmi = (e) => {
    e.preventDefault();
    const hM = bmiInput.height / 100;
    const bmiVal = (bmiInput.weight / (hM * hM)).toFixed(1);
    let category = 'Normal Weight';
    if (bmiVal < 18.5) category = 'Underweight';
    else if (bmiVal >= 25 && bmiVal < 29.9) category = 'Overweight';
    else if (bmiVal >= 30) category = 'Obesity';

    setCalculatedBmi({ value: bmiVal, category });
  };

  const handleTrialSubmit = (e) => {
    e.preventDefault();
    if (!trialForm.name || !trialForm.phone) return;

    addLead({
      name: trialForm.name,
      phone: trialForm.phone,
      interest: trialForm.goal,
      source: 'Landing Page Trial Form',
      notes: `Preferred slot: ${trialForm.preferredTime}`
    });

    setTrialSubmitted(true);
    showToast(`Trial pass booked for ${trialForm.name}! Our head coach will confirm via WhatsApp.`, 'success');
  };

  const facilities = [
    {
      title: "Olympic Iron & Strength Arena",
      desc: "Calibrated steel plates, power racks, competition deadlift platforms, and Eleiko-grade barbells for serious lifters.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Cardio & HIIT Conditioning Zone",
      desc: "Commercial Life Fitness treadmills, Concept2 rowing ergometers, assault bikes, and curved motorless runners.",
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Functional Turf & Plyometrics",
      desc: "25-meter sled turf track, kettlebells up to 48kg, slam balls, plyometric boxes, and battle ropes for athletic stamina.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Recovery Steam & Sauna Suites",
      desc: "Temperature-regulated steam bath sessions to dilate blood vessels, relax strained muscle fascia, and accelerate recovery.",
      image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Dedicated Lockers & Rain Showers",
      desc: "Keyless digital locker bays, sanitized private rain shower enclosures, and blow-dry grooming counters.",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Spacious Valet & Covered Parking",
      desc: "Convenient zero-hassle parking lot right in front of Sector 14 facility, protected by 24x7 security surveillance.",
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const transformations = [
    {
      name: "Rohan Malhotra (Age 31)",
      duration: "6 Months",
      achievement: "-18 kg Fat Loss • Added 4kg Muscle",
      quote: "Shivay Gym has zero gimmicks. No neon lights or loud DJ drama. Just real iron, honest coaching from Vikram Sir, and real nutrition.",
      beforeImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
      afterImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Kavita Swaminathan (Age 28)",
      duration: "4 Months",
      achievement: "Reversed Pre-diabetes • Deadlift 100 kg",
      quote: "Coach Neha taught me that weight training won't make women bulky. Today I feel stronger and more energetic than I did in college.",
      beforeImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
      afterImage: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const testimonials = [
    {
      name: "Col. Rajesh Bakshi (Retd.)",
      membership: "Yearly Elite Strength Member",
      review: "Clean floor, well-maintained equipment, and an environment where everyone respects each other's workout space. Best gym in Gurugram by far."
    },
    {
      name: "Sneha Kapur",
      membership: "Personal Training Client",
      review: "The WhatsApp reminders and personalized Indian diet charts made all the difference. Paneer and dal never felt boring."
    },
    {
      name: "Dr. Alok Verma",
      membership: "6 Months Builder Plan",
      review: "As a surgeon, I need a gym that opens sharp at 5:30 AM without excuses. Shivay Gym delivers discipline every single morning."
    }
  ];

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-[#2A2A2A]">
        {/* Real Gym Photo Background with verified parameters */}
        <div className="absolute inset-0 z-0">
          <ImageFallback
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80"
            alt="Shivay Gym Main Floor"
            className="w-full h-full"
            overlay={true}
            overlayOpacity="bg-black/75"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E8590C]/40 bg-[#E8590C]/10 text-xs font-semibold text-[#E8590C] uppercase tracking-wider mb-6">
            <Flame className="w-3.5 h-3.5" />
            Delhi NCR's Premier Strength Facility
          </div>

          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-[#F2F2F2] leading-none mb-6">
            SHIVAY GYM
          </h1>

          <p className="font-heading uppercase text-xl sm:text-2xl tracking-widest text-[#E8590C] font-semibold mb-4">
            Train Hard. Stay Consistent.
          </p>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#9A9A9A] leading-relaxed mb-8">
            No neon distractions or trendy shortcuts. A serious iron house built for disciplined individuals looking to build genuine physical strength, lean muscle, and lifelong vitality.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href="#plans"
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#E8590C]/20"
            >
              Join Membership
            </a>
            <a
              href="#trial"
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg border border-[#2A2A2A] bg-[#161616]/90 hover:bg-[#1E1E1E] text-[#F2F2F2] font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              Book Free Trial Pass
            </a>
          </div>

          {/* Quick Metrics Bar below CTA */}
          <div className="mt-14 pt-8 border-t border-[#2A2A2A]/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="font-heading text-3xl font-bold text-[#F2F2F2] tabular-nums">8,500</div>
              <div className="text-[11px] uppercase tracking-wider text-[#9A9A9A] mt-0.5">Sq. Ft. Dedicated Floor</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-[#F2F2F2] tabular-nums">340+</div>
              <div className="text-[11px] uppercase tracking-wider text-[#9A9A9A] mt-0.5">Active Members</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-[#F2F2F2] tabular-nums">8</div>
              <div className="text-[11px] uppercase tracking-wider text-[#9A9A9A] mt-0.5">Certified Strength Coaches</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-[#E8590C] tabular-nums">05:30 AM</div>
              <div className="text-[11px] uppercase tracking-wider text-[#9A9A9A] mt-0.5">Morning Opening Sharp</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE GYM SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#E8590C] mb-2">
              The Shivay Ethos
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F2F2F2] mb-6">
              Built on Discipline, Not Hype.
            </h2>
            <div className="space-y-4 text-sm text-[#9A9A9A] leading-relaxed">
              <p>
                Founded in 2017, Shivay Gym was established with a singular vision: to bring authentic strength and athletic conditioning back to Delhi NCR. We reject superficial fitness gimmicks in favor of proven exercise science, progressive overload, and honest accountability.
              </p>
              <p>
                Whether your goal is stepping up to a 200 kg barbell deadlift, dropping stubborn visceral fat, or recovering from chronic desk fatigue, our certified coaches build customized Indian meal frameworks and structured workout splits tailored to your daily schedule.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#161616] border border-[#2A2A2A]">
                <ShieldCheck className="w-5 h-5 text-[#E8590C] mb-2" />
                <div className="font-heading text-base font-bold text-[#F2F2F2]">Certified Science</div>
                <div className="text-xs text-[#9A9A9A] mt-0.5">CSCS, ISSA & ACE accredited trainers on floor.</div>
              </div>
              <div className="p-4 rounded-lg bg-[#161616] border border-[#2A2A2A]">
                <Clock className="w-5 h-5 text-[#E8590C] mb-2" />
                <div className="font-heading text-base font-bold text-[#F2F2F2]">No Waiting in Queues</div>
                <div className="text-xs text-[#9A9A9A] mt-0.5">Multiple squat racks & heavy dumbbell sets up to 50kg.</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <ImageFallback
              src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1000&q=80"
              alt="Coach instructing squat form"
              className="rounded-xl h-[440px] w-full border border-[#2A2A2A]"
              zoomOnHover={true}
            />
            <div className="absolute -bottom-6 -left-6 hidden sm:block p-4 rounded-lg bg-[#161616] border border-[#2A2A2A] shadow-xl max-w-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F9E44]"></span>
                <span className="text-xs font-bold text-[#F2F2F2]">Community Standard</span>
              </div>
              <p className="text-xs text-[#9A9A9A]">Every member is taught barbell safety and gym etiquette from day one.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FACILITIES SECTION */}
      <section id="facilities" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#E8590C] mb-2">
            Facility Infrastructure
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F2F2F2]">
            Engineered For Peak Performance
          </h2>
          <p className="text-sm text-[#9A9A9A] mt-3">
            Over 8,500 sq. ft. of climate-controlled, rubber-floored training space divided into specialized performance zones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[#2A2A2A] bg-[#161616] overflow-hidden group hover:border-[#3A3A3A] transition-colors"
            >
              <div className="h-52 overflow-hidden">
                <ImageFallback
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full"
                  zoomOnHover={true}
                  overlay={true}
                  overlayOpacity="bg-black/30"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2] mb-1.5 group-hover:text-[#E8590C] transition-colors">
                  {fac.title}
                </h3>
                <p className="text-xs text-[#9A9A9A] leading-relaxed">
                  {fac.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MEMBERSHIP PLANS SECTION */}
      <section id="plans" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#E8590C] mb-2">
            Honest Pricing
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F2F2F2]">
            Choose Your Commitment
          </h2>
          <p className="text-sm text-[#9A9A9A] mt-3">
            All prices are transparent in ₹ INR with zero hidden admission fees. Includes locker access, fitness assessment, and mobile app tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col justify-between rounded-lg p-5 border transition-all ${
                p.popular
                  ? 'bg-[#181818] border-[#E8590C] shadow-lg shadow-[#E8590C]/10 scale-[1.02]'
                  : 'bg-[#161616] border-[#2A2A2A] hover:border-[#3A3A3A]'
              }`}
            >
              <div>
                {p.badge ? (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E8590C] text-white mb-3">
                    {p.badge}
                  </span>
                ) : (
                  <div className="h-5 mb-3" />
                )}

                <h3 className="font-heading text-lg font-bold uppercase text-[#F2F2F2]">
                  {p.name}
                </h3>
                <p className="text-[11px] text-[#9A9A9A] mt-1 mb-4 min-h-[32px]">
                  {p.description}
                </p>

                <div className="mb-4 pb-4 border-b border-[#2A2A2A]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-[#9A9A9A]">₹</span>
                    <span className="font-heading text-3xl font-bold text-[#F2F2F2] tabular-nums">
                      {p.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#9A9A9A]">
                      / {p.durationMonths} {p.durationMonths === 1 ? 'mo' : 'mos'}
                    </span>
                  </div>
                  {p.originalPrice && (
                    <span className="text-[11px] line-through text-[#666666]">
                      ₹{p.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-xs text-[#9A9A9A]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2F9E44] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`https://wa.me/${gymInfo.whatsapp}?text=Hi%20Shivay%20Gym%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(p.name)}%20plan.`}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-2.5 rounded text-center text-xs font-semibold uppercase tracking-wider transition-colors ${
                  p.popular
                    ? 'bg-[#E8590C] hover:bg-[#D04F0A] text-white'
                    : 'bg-[#222222] hover:bg-[#2A2A2A] text-[#F2F2F2] border border-[#2A2A2A]'
                }`}
              >
                Enroll Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TRAINERS SECTION */}
      <section id="trainers" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#E8590C] mb-2">
            Coaching Faculty
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F2F2F2]">
            Mentors On The Floor
          </h2>
          <p className="text-sm text-[#9A9A9A] mt-3">
            Our coaches don't sit on mobile phones. They actively monitor posture, biomechanical form, and safety.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((tr) => (
            <div
              key={tr.id}
              className="rounded-lg border border-[#2A2A2A] bg-[#161616] overflow-hidden group hover:border-[#3A3A3A] transition-colors"
            >
              <div className="h-64 overflow-hidden relative">
                <ImageFallback
                  src={tr.image}
                  alt={tr.name}
                  className="w-full h-full"
                  zoomOnHover={true}
                  overlay={true}
                  overlayOpacity="bg-black/35"
                />
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E8590C] text-white">
                    {tr.experience}
                  </span>
                  <span className="text-[11px] font-mono text-[#F2F2F2] bg-black/60 px-2 py-0.5 rounded">
                    {tr.certification.split(',')[0]}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-[#F2F2F2]">
                  {tr.name}
                </h3>
                <div className="text-xs text-[#E8590C] font-semibold mb-2">
                  {tr.role} • {tr.specialization}
                </div>
                <p className="text-xs text-[#9A9A9A] leading-relaxed mb-4">
                  {tr.bio}
                </p>
                <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-xs text-[#9A9A9A]">
                  <span>Shift: {tr.shift.split(' ')[0]}</span>
                  <a
                    href={`https://wa.me/${gymInfo.whatsapp}?text=Hi%2C%20I%20would%20like%20to%20consult%20Coach%20${encodeURIComponent(tr.name)}%20for%20PT.`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#E8590C] hover:underline font-medium"
                  >
                    Request PT →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WEEKLY CLASS TIMETABLE */}
      <section id="timetable" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#E8590C] mb-2">
            Weekly Schedule
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F2F2F2]">
            Group Classes & Studio Sessions
          </h2>
          <p className="text-sm text-[#9A9A9A] mt-2">
            Included free with Quarterly, Half-Yearly, and Yearly membership plans.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#2A2A2A] bg-[#1A1A1A] text-[#9A9A9A] text-xs uppercase tracking-wider">
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Class Name</th>
                <th className="px-4 py-3">Timing</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Instructor</th>
                <th className="px-4 py-3">Studio</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-[#F2F2F2]">{cls.day}</td>
                  <td className="px-4 py-3.5 font-medium text-[#F2F2F2]">{cls.name}</td>
                  <td className="px-4 py-3.5 text-xs text-[#9A9A9A]">{cls.time}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#1E1E1E] text-[#E8590C] border border-[#2A2A2A]">
                      {cls.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#9A9A9A]">{cls.trainer}</td>
                  <td className="px-4 py-3.5 text-xs text-[#666666]">{cls.room}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => navigate('/member/bookings')}
                      className="px-3 py-1 rounded bg-[#1E1E1E] hover:bg-[#E8590C] hover:text-white border border-[#2A2A2A] text-xs font-medium text-[#F2F2F2] transition-colors"
                    >
                      Book Slot
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. TRANSFORMATIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#E8590C] mb-2">
            Real Proof
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F2F2F2]">
            Transformations Built On Sweat
          </h2>
          <p className="text-xs text-[#666666] mt-2">
            *Member photographs displayed with explicit written consent. Results vary based on individual genetic profile and lifestyle discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {transformations.map((t, idx) => (
            <div key={idx} className="rounded-lg border border-[#2A2A2A] bg-[#161616] p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#9A9A9A]">Phase 1 (Starting Point)</div>
                  <ImageFallback
                    src={t.beforeImage}
                    alt={`${t.name} Before`}
                    className="h-56 rounded-md border border-[#2A2A2A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#E8590C]">Phase 2 ({t.duration} Checkpoint)</div>
                  <ImageFallback
                    src={t.afterImage}
                    alt={`${t.name} After`}
                    className="h-56 rounded-md border border-[#2A2A2A]"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-[#F2F2F2]">{t.name}</h3>
                <div className="text-xs font-semibold text-[#2F9E44]">{t.achievement}</div>
                <p className="text-xs text-[#9A9A9A] italic mt-2">
                  "{t.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FREE BMI & CALORIE CALCULATOR PREVIEW */}
      <section id="calculator" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#E8590C] mb-2">
                <Calculator className="w-4 h-4" />
                Free Diagnostic Tool
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#F2F2F2] mb-3">
                Calculate Your Baseline BMI
              </h2>
              <p className="text-xs text-[#9A9A9A] leading-relaxed mb-6">
                Understand your starting metric before setting foot on the platform. The full macro and BMR/TDEE calculator is accessible inside the Member App.
              </p>

              <form onSubmit={calculateLandingBmi} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="35"
                      max="200"
                      value={bmiInput.weight}
                      onChange={(e) => setBmiInput({ ...bmiInput, weight: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-sm text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      min="120"
                      max="230"
                      value={bmiInput.height}
                      onChange={(e) => setBmiInput({ ...bmiInput, height: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-sm text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-[#E8590C] hover:bg-[#D04F0A] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Calculate BMI
                </button>
              </form>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-[#2A2A2A] bg-[#121212] text-center">
              {calculatedBmi ? (
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wider text-[#9A9A9A]">Your Body Mass Index</div>
                  <div className="font-heading text-6xl font-bold text-[#E8590C] tabular-nums">
                    {calculatedBmi.value}
                  </div>
                  <div className="inline-block px-3 py-1 rounded text-xs font-semibold bg-[#1E1E1E] border border-[#2A2A2A] text-[#F2F2F2]">
                    Category: {calculatedBmi.category}
                  </div>
                  <p className="text-[11px] text-[#666666] pt-2">
                    Want exact daily calories & Indian meal macro targets?{' '}
                    <button
                      onClick={() => navigate('/member/calculator')}
                      className="text-[#E8590C] underline font-medium"
                    >
                      Open Full Member Calculator
                    </button>
                  </p>
                </div>
              ) : (
                <div className="text-[#9A9A9A] space-y-2">
                  <Calculator className="w-10 h-10 mx-auto text-[#666666]" />
                  <div className="text-xs">Enter weight and height on the left and hit Calculate.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#E8590C] mb-2">
            Member Feedback
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F2F2F2]">
            Respected By Lifters
          </h2>
          <span className="text-[11px] text-[#666666] uppercase tracking-wider">(Sample representative reviews)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] flex flex-col justify-between">
              <p className="text-xs text-[#9A9A9A] leading-relaxed italic mb-4">
                "{t.review}"
              </p>
              <div className="pt-3 border-t border-[#242424]">
                <div className="font-heading text-base font-bold text-[#F2F2F2]">{t.name}</div>
                <div className="text-[11px] text-[#E8590C]">{t.membership}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. TRIAL BOOKING & LOCATION MAP */}
      <section id="trial" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div id="location" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Booking Form */}
          <div className="p-6 sm:p-8 rounded-xl border border-[#2A2A2A] bg-[#161616]">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#E8590C] mb-1">
              Complimentary Pass
            </div>
            <h2 className="font-heading text-3xl font-bold uppercase text-[#F2F2F2] mb-3">
              Book A Free Trial Workout
            </h2>
            <p className="text-xs text-[#9A9A9A] mb-6">
              Experience the facility firsthand. No pushy sales calls, guaranteed.
            </p>

            {trialSubmitted ? (
              <div className="p-6 rounded-lg bg-[#142918] border border-[#2F9E44]/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#2F9E44] mx-auto" />
                <h4 className="font-heading text-lg font-bold text-[#F2F2F2]">Trial Pass Confirmed!</h4>
                <p className="text-xs text-[#9A9A9A]">
                  Our head trainer will send your workout slot confirmation on WhatsApp. Please carry clean shoes.
                </p>
                <button
                  onClick={() => setTrialSubmitted(false)}
                  className="mt-3 text-xs text-[#E8590C] underline font-medium"
                >
                  Book another pass
                </button>
              </div>
            ) : (
              <form onSubmit={handleTrialSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={trialForm.name}
                    onChange={(e) => setTrialForm({ ...trialForm, name: e.target.value })}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Mobile Number (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={trialForm.phone}
                    onChange={(e) => setTrialForm({ ...trialForm, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Preferred Time</label>
                    <select
                      value={trialForm.preferredTime}
                      onChange={(e) => setTrialForm({ ...trialForm, preferredTime: e.target.value })}
                      className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
                    >
                      <option>Morning 6:30 AM</option>
                      <option>Morning 8:00 AM</option>
                      <option>Evening 5:30 PM</option>
                      <option>Evening 7:30 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Primary Goal</label>
                    <select
                      value={trialForm.goal}
                      onChange={(e) => setTrialForm({ ...trialForm, goal: e.target.value })}
                      className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
                    >
                      <option>Strength & Muscle</option>
                      <option>Fat Loss & Toning</option>
                      <option>Cardio Endurance</option>
                      <option>Injury Rehabilitation</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded bg-[#E8590C] hover:bg-[#D04F0A] text-white font-semibold text-xs uppercase tracking-wider transition-colors mt-2"
                >
                  Confirm Free Trial Request
                </button>
              </form>
            )}
          </div>

          {/* Location & Map Information */}
          <div className="p-6 sm:p-8 rounded-xl border border-[#2A2A2A] bg-[#161616] flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-[#E8590C] mb-1">
                Gurugram Facility
              </div>
              <h2 className="font-heading text-3xl font-bold uppercase text-[#F2F2F2] mb-3">
                Visit The Iron House
              </h2>
              <p className="text-xs text-[#9A9A9A] leading-relaxed mb-6">
                Located on Sector 14 Main Road, centrally positioned 5 minutes from MG Road Metro.
              </p>

              <div className="space-y-3 text-xs text-[#9A9A9A] mb-6">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#E8590C] flex-shrink-0 mt-0.5" />
                  <span>{gymInfo.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#E8590C] flex-shrink-0" />
                  <span>{gymInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#E8590C] flex-shrink-0" />
                  <span>Mon-Sat {gymInfo.timings.weekdays} • Sun {gymInfo.timings.sundays}</span>
                </div>
              </div>
            </div>

            {/* Clean Map Graphic Placeholder */}
            <div className="h-44 rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] flex flex-col items-center justify-center p-4 text-center">
              <MapPin className="w-8 h-8 text-[#E8590C] mb-2" />
              <div className="font-heading text-base font-bold text-[#F2F2F2]">
                Sector 14 Main Market, Gurugram
              </div>
              <p className="text-[11px] text-[#666666] mt-0.5">Opposite Metro Pillar 114 • Ample Valet Parking</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="mt-3 px-3 py-1 rounded bg-[#2A2A2A] hover:bg-[#E8590C] hover:text-white text-xs font-medium text-[#F2F2F2] transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

