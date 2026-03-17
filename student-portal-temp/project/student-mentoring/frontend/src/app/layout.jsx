import '../index.css';

export const metadata = {
  title: 'Student Portal',
  description: 'Student Mentoring Portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
