import Header1 from "@/components/Header1";
import Footer from "@/components/footer";
import PrivacyPolicy from "@/components/PrivacyPolicy";

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header1 />
            <br />
      {/* Page Content */}
      <main>
        <PrivacyPolicy />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
