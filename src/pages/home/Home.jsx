import AboutAndContact from './components/AboutAndContact';
import DashboardServices from './components/DashboardServices';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <DashboardServices />
      <AboutAndContact /> 
    </div>
  );
}
export default Home;

