"use client";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMotorcycle,
  faPenNib,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/app/_hooks/useAuth";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();
  const { isLoading, session } = useAuth();
  const buttonStyle =
    "rounded-md border border-white transition-colors " +
    "text-xs px-2 py-1 " +
    "md:text-base md:px-3 md:py-1 " +
    "hover:bg-white hover:text-slate-800";
  const postButtonStyle =
    "rounded-md bg-blue-300 text-white transition-colors " +
    "text-xs px-2 py-1 " +
    "md:text-base md:px-3 md:py-1 " +
    "hover:bg-blue-900";
  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <header>
      <div className="bg-gray-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-2xl md:mx-auto",
            "flex flex-col gap-1",
            "text-lg font-bold text-white",
          )}
        >
          <div>
            <Link href="/" className="font-solid text-2xl md:text-3xl">
              <FontAwesomeIcon icon={faMotorcycle} className="mr-1" />
              Bike Blog
            </Link>
          </div>
          <div className="font-smart flex w-full flex-wrap justify-end gap-2">
            {!isLoading &&
              (session ? (
                <>
                  <Link href="/admin/posts/new" className={postButtonStyle}>
                    <FontAwesomeIcon icon={faPenNib} className="mr-1" />
                    Post
                  </Link>

                  <Link href="/admin" className={postButtonStyle}>
                    <FontAwesomeIcon icon={faBars} className="mr-1" />
                    Admin
                  </Link>

                  <button onClick={logout} className={buttonStyle}>
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className={buttonStyle}>
                  Login
                </Link>
              ))}
            <Link href="/about" className={buttonStyle}>
              About
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
