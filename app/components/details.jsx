import React from "react";
// import Container from "../ui/Container";
import FeatureRow from "./feature-row"


export default function Details({ features }) {
 return (
   <section className="dynamic-padding">
     {/* <Container className="py-6"> */}
       <div className="flex flex-col gap-9">
          <header className="flex flex-col gap-3 py-6 w-[606px]">
        <h1>Built for real life</h1>
        <p>
         Rehab AI gives you quick support, clear next steps, and progress you can track over time.
        </p>
      </header>
         {features.map((f) => (
           <FeatureRow key={`${f.title}-${f.body}`} {...f} />
         ))}
       </div>
     {/* </Container> */}
   </section>
 );
}
