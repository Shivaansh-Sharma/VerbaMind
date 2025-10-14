import Header2 from "@/components/Header2";
import Text from "@/components/Textbox";
import Footer from "@/components/footer";
import DashboardDiv2 from "@/components/DashboardDiv2";


export default function Summarizer() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header2 />
            <br />
      {/* Page Content */}
      <main className="flex-grow">
        <DashboardDiv2 />
        <Text />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
