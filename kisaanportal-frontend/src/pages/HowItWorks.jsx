function HowItWorks() {

  const steps = [
    { icon: "📝", title: "Register", desc: "Sign up as Farmer or Owner" },
    { icon: "🚜", title: "Browse", desc: "Choose farming equipment" },
    { icon: "📅", title: "Select Dates", desc: "Pick rental duration" },
    { icon: "💰", title: "Payment", desc: "Check price & pay" },
    { icon: "✅", title: "Booking", desc: "Confirm your booking" },
  ];

  return (
    <div className="min-h-screen bg-green-50 py-10">

      <h1 className="text-4xl font-bold text-center text-green-700">
        How KisaanPortal Works
      </h1>

      <p className="text-center text-gray-600 mt-2 mb-10">
        Just follow these simple steps.
      </p>

      <div className="flex justify-center items-center flex-wrap gap-4">

        {steps.map((step, index) => (
          <>
            <div
              key={index}
              className="bg-white w-48 p-5 rounded-xl shadow text-center"
            >
              <div className="text-5xl">
                {step.icon}
              </div>

              <h2 className="font-bold text-green-700 mt-3">
                {step.title}
              </h2>

              <p className="text-sm text-gray-600 mt-2">
                {step.desc}
              </p>
            </div>

            {index !== steps.length - 1 && (
              <div className="text-4xl text-green-600">
                ➜
              </div>
            )}

          </>
        ))}

      </div>

    </div>
  );
}

export default HowItWorks;