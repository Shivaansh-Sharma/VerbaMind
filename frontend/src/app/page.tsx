import Header1 from "@/components/Header1";
import Footer from "@/components/footer";
import HomeDiv1 from "@/components/HomeDiv1";
import HomeDiv2 from "@/components/HomeDiv2";
import HomeDiv3 from "@/components/HomeDiv3";
import HomeDiv4 from "@/components/HomeDiv4";
import HomeDiv5 from "@/components/HomeDiv5";
import HomeDiv6 from "@/components/HomeDiv6";



export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header1 />
            <br />
      {/* Page Content */}
      <main className="flex-grow">
        <HomeDiv1 />
        <HomeDiv2 />
        <HomeDiv3 />
        <HomeDiv4 />
        <HomeDiv5 />
        <HomeDiv6 />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
