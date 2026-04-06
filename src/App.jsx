/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

//import { motion } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";


export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-100 selection:text-red-600">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}
