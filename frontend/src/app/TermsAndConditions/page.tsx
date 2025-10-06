import Header1 from "@/components/Header1";
import Footer from "@/components/footer";
import TermsAndConditions from "@/components/TnC";

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header1 />
            <br />
      {/* Page Content */}
      <main>
        <TermsAndConditions />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
