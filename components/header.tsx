import Link from "next/link";
import ConnectWalletButton from "./connect-wallet-button";
import { DarkModeToggle } from "./dark-mode-toggle";

export default function Header() {
  return (
    <div className="border-b">
      <div className="container flex items-center h-16">
        <div className="flex-1">
          <Link
            href="/"
            className="flex gap-2 items-center text-lg font-bold lg:text-2xl hover:opacity-80"
          >
            <img
              src="/logo.jpeg"
              alt="etheract"
              className="h-12 rounded-full"
            />
            Etheract
          </Link>
        </div>

        <div className="flex items-center ml-auto space-x-2">
          <DarkModeToggle />
        </div>
      </div>
    </div>
  );
}
