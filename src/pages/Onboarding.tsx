import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, ArrowRight, ArrowLeft, Check } from "lucide-react";
import onboardingWelcome from "@/assets/onboarding-welcome.png";
import onboardingCalendar from "@/assets/onboarding-calendar.png";
import onboardingChat from "@/assets/onboarding-chat.png";
import onboardingPayments from "@/assets/onboarding-payments.png";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to GamePlan!",
      description: "The all-in-one platform built for amateur sports teams. Let's get you started.",
      image: onboardingWelcome,
      benefits: [
        "Organize your entire team in one place",
        "Free for teams up to 10 members",
        "Set up in under 5 minutes"
      ]
    },
    {
      title: "Never Miss an Event",
      description: "Create events, track RSVPs, and keep everyone in sync with our interactive calendar.",
      image: onboardingCalendar,
      benefits: [
        "Shared team calendar",
        "Automatic RSVP reminders",
        "Attendance tracking"
      ]
    },
    {
      title: "Stay Connected",
      description: "Chat with your team in dedicated channels. Like Slack, but built for sports teams.",
      image: onboardingChat,
      benefits: [
        "Real-time team chat",
        "Organized by topic",
        "Mobile & desktop apps"
      ]
    },
    {
      title: "Simplify Payments",
      description: "Collect dues, event fees, and donations with secure automated payment processing.",
      image: onboardingPayments,
      benefits: [
        "Automated payment collection",
        "Track who's paid",
        "Stripe & PayPal integration"
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 md:p-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GamePlan</span>
          </Link>
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
        </div>

        {/* Progress Indicators */}
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "bg-primary"
                  : index < currentStep
                  ? "bg-accent"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6 text-center">
          <div className="relative w-full max-w-sm mx-auto aspect-square">
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-full object-contain animate-fade-in"
            />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">{step.title}</h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              {step.description}
            </p>
          </div>

          <div className="space-y-3 max-w-md mx-auto text-left">
            {step.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              size="lg"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            variant="hero"
            onClick={handleNext}
            size="lg"
            className="flex-1"
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </p>
      </Card>
    </div>
  );
};

export default Onboarding;
