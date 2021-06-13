import React from "react";

interface Page {
  name: string;
  href: string;
}

interface HeaderPropsLoggedOut {
  onLogin: () => void;
  onCreateAccount: () => void;
}

interface User {
  email: string;
}

interface HeaderPropsLoggedIn {
  onLogout: () => void;
  user: User;
}

export interface HeaderProps {
  pages: Page[];
  user?: User;
  onLogin: () => void;
  onLogout: () => void;
  onCreateAccount: () => void;
}

const LoggedOut: React.FC<HeaderPropsLoggedOut> = ({ onLogin, onCreateAccount }) => (
  <div className="ml-10 space-x-4">
    <a
      onClick={onLogin}
      className="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
    >
      Sign in
    </a>
    <a
      onClick={onCreateAccount}
      className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
    >
      Sign up
    </a>
  </div>
);

const LoggedIn: React.FC<HeaderPropsLoggedIn> = ({ onLogout, user }) => (
  <div className="ml-10 space-x-4">
    <span className="text-base font-medium text-white">Logged in as: {user.email}</span>
    <a
      onClick={onLogout}
      className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
    >
      Log Out
    </a>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ pages, user, ...props }) => (
  <header className="bg-indigo-600">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
        <div className="flex items-center">
          <a href="#">
            <span className="sr-only">Workflow</span>
            <img
              className="h-10 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
              alt=""
            />
          </a>
          <div className="hidden ml-10 space-x-8 lg:block">
            {pages.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-base font-medium text-white hover:text-indigo-50"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
        {console.log(props)
        }
        {user ? <LoggedIn {...props} user={user} /> : <LoggedOut {...props} />}
      </div>
      <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
        {pages.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-base font-medium text-white hover:text-indigo-50"
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  </header>
);
