
import Link from 'next/link';
import PopupButton from "./popup";

const Header1 = () => {
  return (
    <header
      className="w-full flex items-center justify-between px-6 py-4 shadow-md border-b-2
         bg-[var(--color-BG)] transition-colors"
    >
      {/* Left side - Logo / Title */}
      <Link href='/'><h1 className="text-4xl font-bold text-[var(--color-P1)] text-stroke">
        VerbaMind
      </h1></Link>

      {/* Right side - Theme Toggle */}
      <PopupButton />
    </header>
  );
};

export default Header1;
