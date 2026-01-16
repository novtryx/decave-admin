// "use client";

// import Hero from "@/components/login/Hero";
// import Navbar from "@/components/login/Navbar";
// import LoginModal from "@/components/login/LoginModal";
// import { useState } from "react";
// import LoginForm from "@/components/login/LoginForm";
// import OtpForm from "@/components/login/OtpForm";


// type AuthStep = "login" | "otp";

// export default function AdminLogin() {
//   const [open, setOpen] = useState<boolean>(false);
//   const [step, setStep] = useState<AuthStep>("login");

//   return (
//     <div>
//       <Navbar />
//       <Hero open={open} setOpen={setOpen} />

//       <LoginModal isOpen={open} onClose={() => setOpen(false)}>
//         {step === "login" && (
//           <LoginForm
//             onSuccess={() => setStep("otp")}
//           />
//         )}

//         {step === "otp" && (
//           <OtpForm
//             onBack={() => setStep("login")}
//           />
//         )}
//       </LoginModal>
//     </div>
//   );
// }


"use client";

import Hero from "@/components/login/Hero";
import Navbar from "@/components/login/Navbar";
import LoginModal from "@/components/login/LoginModal";
import { useState } from "react";
import LoginForm from "@/components/login/LoginForm";
import OtpForm from "@/components/login/OtpForm";

type AuthStep = "login" | "otp";

export default function AdminLogin() {
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState<AuthStep>("login");
  const [userEmail, setUserEmail] = useState<string>("");

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setStep("otp");
  };

  const handleBackToLogin = () => {
    setStep("login");
    setUserEmail("");
  };

  return (
    <div>
      <Navbar />
      <Hero open={open} setOpen={setOpen} />

      <LoginModal isOpen={open} onClose={() => setOpen(false)}>
        {step === "login" && (
          <LoginForm onSuccess={handleLoginSuccess} />
        )}

        {step === "otp" && (
          <OtpForm onBack={handleBackToLogin} email={userEmail} />
        )}
      </LoginModal>
    </div>
  );
}