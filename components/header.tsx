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
            className="text-lg font-bold text-gray-800 lg:text-2xl dark:text-gray-100"
          >
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
