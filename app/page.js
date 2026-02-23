import Image from "next/image";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Chatbot from "./components/chatbot";
import Details from "./components/details";
import ThreeWays from "./components/three-ways";

export default function Home() {
    const features = [
    {
      minititle: "Performance",
      title: "Results you can measure",
      body: "Track progress over time so you can see what’s improving and what needs support.",
      reverse: true,
      imageAlt: "Progress animation",
      imageSrc: "/graph.json",
      cta: { label: "Learn more", href: "/progress" },
    },
        {
           minititle: "Proven",
      title: "Runs on tools you can trust",
      body: "Powered by reliable languages and frameworks to keep Rehab AI fast, secure, and smooth on any device.",
      reverse: false,
      imageAlt: "Progress animation",
      imageSrc: "/code-animation.json",
      cta: { label: "Learn more", href: "/progress" },
    },
  ];
  return (
   <div className="h-fit overflow-hidden">
    <Navbar/>
    <Image src="/borders.svg" height={1440} width={1440} alt="border" className="absolute z-0"/>
    <Hero/>
    <Chatbot/>
      <Details features={features} />
        {/* <div
        className="absolute top-200"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(900px 500px at 50% 0%, rgba(80, 220, 255, 0.12), rgba(0,0,0,0) 55%), radial-gradient(900px 500px at 10% 10%, rgba(120, 255, 210, 0.08), rgba(0,0,0,0) 55%), #07090b",
        color: "rgba(255,255,255,0.92)",
        padding: "96px 48px",
        
      }}
    /> */}
    <ThreeWays/>
   </div>
  );
}
