import Header2 from "@/components/Header2";
import Text from "@/components/Textbox";
import Footer from "@/components/footer";
import HomeDiv6 from "@/components/HomeDiv6";


export default function Summarizer() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header2 />
            <br />
      {/* Page Content */}
      <main className="flex-grow">
        <HomeDiv6 />
        <Text />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
