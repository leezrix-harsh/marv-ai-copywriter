import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CopywriterForm from "@/components/CopywriterForm";
import SamplePrompts from "@/components/SamplePrompts";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import TargetAudience from "@/components/TargetAudience";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CopywriterForm />
        <SamplePrompts />
        <HowItWorks />
        <Benefits />
        <TargetAudience />
      </main>
      <Footer />
    </>
  );
}
