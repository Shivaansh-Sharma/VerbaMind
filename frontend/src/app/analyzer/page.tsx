import Header2 from "@/components/Header2";
import Text from "@/components/Textbox";
import Footer from "@/components/footer";
import HomeDiv5 from "@/components/HomeDiv5";


export default function Analyzer() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header2 />
            <br />
      {/* Page Content */}
      <main className="flex-grow">
        <HomeDiv5 />
        <Text />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
