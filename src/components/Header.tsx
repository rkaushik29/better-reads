import React from 'react';
import Link from 'next/link';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="w-full h-16 bg-white shadow flex items-center px-4">
      <div className="flex-shrink-0">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Better Reads
        </Link>
      </div>

      <div className="flex-1 flex justify-center">
        <nav className="flex space-x-8">
          <Link href="/library" className="text-gray-600 hover:text-gray-900 font-medium">
            Library
          </Link>
          <Link href="/feed" className="text-gray-600 hover:text-gray-900 font-medium">
            Feed
          </Link>
        </nav>
      </div>

      <div className="flex-shrink-0">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="default">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-8 h-8',
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
