import React from "react";

type Props = {
  children: React.ReactNode;
  headerSlot?: React.ReactNode;
  footer?: React.ReactNode;
};

const Layout = ({ children, headerSlot, footer }: Props) => (
  <div className="app">
    <header className="app-header">
      <h1>Problem Monty'ego Halla</h1>
      {headerSlot}
    </header>

    <main className="app-main">{children}</main>

    {footer && <footer className="app-footer">{footer}</footer>}
  </div>
);

export default Layout;
