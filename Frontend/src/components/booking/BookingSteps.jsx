export default function BookingSteps({ currentStep }) {
  const steps = ["Service", "Staff", "Date", "Time", "Summary"];

  return (
    <div className="mb-10 flex flex-wrap justify-center gap-3">
      {steps.map((step, index) => {
        const stepNumber = index + 1;

        const active = stepNumber === currentStep;

        const completed = stepNumber < currentStep;

        return (
          <div
            key={step}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              active || completed
                ? "bg-stone-900 text-white"
                : "bg-stone-200 text-stone-500"
            }`}
          >
            <span>{stepNumber}</span>
            {step}
          </div>
        );
      })}
    </div>
  );
}
