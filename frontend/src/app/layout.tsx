import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ["latin", "cyrillic"],
  variable: '--font-roboto'
});

export const metadata: Metadata = {
  title: "Fullstack App",
  description: "Fullstack application with Next.js and Express",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${roboto.variable}`}>
        <AntdRegistry>
          <ConfigProvider locale={ruRU}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
