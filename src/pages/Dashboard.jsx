import WelcomeBanner from "../components/WelcomeBanner";
import StatCard from "../components/StatCard";
import BookInventory from "../components/BookInventory";
import QuickActions from "../components/QuickActions";
import StockAlerts from "../components/StockAlerts";
import RecentDistribution from "../components/RecentDistribution";
import StockBySubject from "../components/StockBySubject";
import RecentActivity from "../components/RecentActivity";
import Footer from "../components/Footer";
import { useEduStock } from "../context/EduStockContext";

function Dashboard() {
  const { classBooks, students, distributions, getInventory } = useEduStock();
  const stats = [
    {
      id: "total-books",
      icon: "BookOpen",
      title: "Total Books",
      value: classBooks.reduce((total, book) => total + getInventory(book.id).total, 0).toLocaleString(),
      accent: "blue",
    },
    {
      id: "total-students",
      icon: "Users",
      title: "Total Students",
      value: students.length.toLocaleString(),
      accent: "green",
    },
    {
      id: "books-issued",
      icon: "Package",
      title: "Books Issued",
      value: distributions.filter((item) => item.action === "issued").length
        - distributions.filter((item) => item.action === "returned").length,
      accent: "purple",
    },
    {
      id: "low-stock",
      icon: "AlertTriangle",
      title: "Low Stock Items",
      value: classBooks.filter((book) => {
        const stock = getInventory(book.id);
        return stock.available > 0 && stock.available <= 15;
      }).length,
      accent: "red",
    },
  ];

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <BookInventory />
        <div className="space-y-5">
          <QuickActions />
          <StockAlerts />
          <RecentActivity />
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <RecentDistribution />
        <StockBySubject />
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
