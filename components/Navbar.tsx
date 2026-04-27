import Link from "next/link";
import Image from "next/image";
import CustomButton from "./CustomButton";

const Navbar = () => {
  return (
    <header className="w-full sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-100">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-3">
        <Link href='/' className="flex justify-center items-center">
          <Image
            src="logo.svg"
            alt="Car Hub Logo"
            width="118"
            height="18"
            className="object-contain"
          >
          </Image>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/wishlist" className="text-sm font-semibold text-primary-blue">
            Wishlist
          </Link>
          <CustomButton
            title="Hubungi Sales"
            btnType="button"
            containerStyles="text-primary-blue rounded-full bg-white min-w-[130px]"
          />
        </div>
      </nav>
    </header>
  )
}

export default Navbar