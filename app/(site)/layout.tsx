import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { getAllCategories, getSettingsByKeysFooter } from "@/api/categoryActions";
import NavigationLoader from "@/components/common/NavigationLoader";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categoriesRes = await getAllCategories();
  const settingsRes = await getSettingsByKeysFooter();

  const categories = categoriesRes?.success ? categoriesRes.data : [];
  const settings = settingsRes?.success ? settingsRes.data : null;

  return (
    <>
      <NavigationLoader />
      <Header categories={categories} settings={settings} />
      <main>{children}</main>
      <Footer />
    </>
  );
}