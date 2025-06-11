import React, { useEffect, useRef, useState } from 'react';
import { StoreConfiguration } from '../../types';
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  ArrowTrendingUpIcon,
  LinkIcon, 
  MagnifyingGlassCircleIcon, 
  PackageIcon, 
  UserIcon,
  StarIcon as SeoStarIcon, 
  PhotoIcon, 
  DocumentTextIcon 
} from '../../constants';
import { Chart, registerables } from 'chart.js';
import { tailwindConfig } from '../../utils'; 

Chart.register(...registerables);

interface AnalyticsViewProps {
  storeConfig: StoreConfiguration;
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactElement<{ className?: string }>; 
  trend?: string; 
  trendColor?: 'text-SUCCESS_GREEN' | 'text-ERROR_RED';
  description?: string;
  children?: React.ReactNode; 
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, trendColor, description, children }) => {
  let currentTrendClasses = 'text-SUCCESS_GREEN dark:text-replit-dark-green'; // Default to success
  if (trendColor === 'text-ERROR_RED') {
    currentTrendClasses = 'text-ERROR_RED dark:text-replit-dark-red'; 
  }
  
  return (
    <div className="bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg p-4 rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border transition-colors duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-replit-dark-border-muted">
      <div className="flex items-center text-TEXT_SECONDARY dark:text-replit-dark-text-secondary mb-1.5">
        <span className="p-1 bg-PRIMARY_MAIN/10 dark:bg-replit-primary-blue/20 text-PRIMARY_MAIN dark:text-replit-primary-blue rounded-full mr-2">
          {React.cloneElement(icon, { className: "w-4 h-4" })}
        </span>
        <h4 className="text-xs font-medium uppercase tracking-wider">{title}</h4>
      </div>
      <p className="text-lg font-bold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-0.5 truncate">{value}</p>
      {trend && (
        <p className={`text-xs font-medium ${currentTrendClasses}`}>{trend}</p>
      )}
      {description && (
        <p className="text-xs text-TEXT_MUTED dark:text-replit-dark-text-disabled mt-1">{description}</p>
      )}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

interface ChartComponentProps {
  chartId: string;
  type: 'line' | 'bar' | 'doughnut';
  labels: string[];
  datasets: any[]; 
  options?: any; 
  className?: string;
  editorTheme: 'light' | 'dark';
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartId, type, labels, datasets, options, className, editorTheme }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const isDark = editorTheme === 'dark';
  const legendColor = isDark ? tailwindConfig.theme.extend.colors['replit-dark-text-secondary'] : tailwindConfig.theme.extend.colors['TEXT_SECONDARY'];
  const tooltipBgColor = isDark ? tailwindConfig.theme.extend.colors['replit-dark-text-main'] : tailwindConfig.theme.extend.colors['TEXT_PRIMARY'];
  const tooltipFontColor = isDark ? tailwindConfig.theme.extend.colors['replit-dark-panel-bg'] : tailwindConfig.theme.extend.colors['BACKGROUND_CONTENT'];
  const gridLineColor = isDark ? tailwindConfig.theme.extend.colors['replit-dark-border'] + '80' : tailwindConfig.theme.extend.colors['BORDER_DEFAULT'] + '80';
  const tickColor = isDark ? tailwindConfig.theme.extend.colors['replit-dark-text-disabled'] : tailwindConfig.theme.extend.colors['TEXT_MUTED'];


  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstanceRef.current = new Chart(ctx, {
          type,
          data: {
            labels,
            datasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: type === 'doughnut', 
                position: 'bottom',
                labels: { color: legendColor, boxWidth: 12, padding: 15 }
              },
              tooltip: {
                backgroundColor: tooltipBgColor,
                titleColor: tooltipFontColor,
                bodyColor: tooltipFontColor,
                borderColor: gridLineColor, 
                borderWidth: 1,
              }
            },
            scales: (type === 'line' || type === 'bar') ? {
              y: { 
                beginAtZero: true, 
                grid: { color: gridLineColor },
                ticks: { color: tickColor }
              },
              x: { 
                grid: { display: false },
                ticks: { color: tickColor }
              }
            } : undefined,
            ...options,
          },
        });
      }
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [type, labels, datasets, options, editorTheme, legendColor, tooltipBgColor, tooltipFontColor, gridLineColor, tickColor]);

  return <div className={`relative ${className || 'h-64'}`}><canvas id={chartId} ref={chartRef}></canvas></div>;
};

const ProgressBar: React.FC<{ value: number; colorClass: string }> = ({ value, colorClass }) => (
    <div className="w-full bg-BORDER_DEFAULT/50 dark:bg-replit-dark-border/50 rounded-full h-2.5">
        <div 
            className={`${colorClass} h-2.5 rounded-full transition-all duration-500 ease-out`} 
            style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
        ></div>
    </div>
);


const AnalyticsView: React.FC<AnalyticsViewProps> = ({ storeConfig }) => {
  const [currentEditorTheme, setCurrentEditorTheme] = useState<'light' | 'dark'>('dark'); // Default to dark

  useEffect(() => {
    const updateTheme = () => {
        setCurrentEditorTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    };
    updateTheme(); // Initial check
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const today = new Date();
  const getLastNDays = (n: number) => Array.from({length: n}, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (n - 1 - i));
    return d.toLocaleDateString('en-CA'); 
  });

  const mockData = {
    financial: {
      totalRevenue: 12530.75,
      totalOrders: 312,
      avgOrderValue: (12530.75 / 312).toFixed(2),
      dailyRevenue: getLastNDays(7).map((day, i) => ({
        date: day,
        revenue: Math.floor(Math.random() * (i === 6 ? 500 : 300) + 150 * (i+1) + 500) 
      })),
    },
    product: {
      topSelling: storeConfig.products.slice(0, 5).map((p, i) => ({
        name: p.name.length > 20 ? p.name.substring(0,18) + "..." : p.name,
        unitsSold: Math.floor(Math.random() * 50) + 20 + (5-i)*10 
      })).sort((a,b) => b.unitsSold - a.unitsSold),
      totalUnitsSoldOverall: storeConfig.products.reduce((sum, p) => sum + (p.stockQuantity ? (100 - p.stockQuantity) : 20), 0) || 150,
    },
    traffic: {
      totalVisitors: 5870,
      uniqueVisitors: 4120,
      bounceRate: "35.6%",
      dailyVisitors: getLastNDays(7).map((day, i) => ({
        date: day,
        visitors: Math.floor(Math.random() * (i === 6 ? 300 : 200) + 700 + i*20) 
      })),
      sources: [
        { name: "Direct", value: 2100, colorName: 'PRIMARY_MAIN' },
        { name: "Organic", value: 1850, colorName: 'ACCENT_MAIN' },
        { name: "Referral", value: 920, colorName: 'SUCCESS_GREEN' },
        { name: "Social", value: 1000, colorName: 'TEXT_SECONDARY' },
      ],
    },
    contentSEO: {
        avgDescriptionScore: Math.floor(Math.random() * 30) + 65, 
        imageCoverage: Math.floor(Math.random() * 20) + 80, 
        seoHealth: Math.floor(Math.random() * 40) + 55, 
        topKeywords: ["handmade gifts", "eco-friendly products", storeConfig.basicInfo.storeName.toLowerCase().split(' ')[0]],
    }
  };
  
  const primaryMainColor = currentEditorTheme === 'dark' ? tailwindConfig.theme.extend.colors['replit-primary-blue-darker'] : tailwindConfig.theme.extend.colors['replit-primary-blue'];
  const primaryMainBgColor = currentEditorTheme === 'dark' ? tailwindConfig.theme.extend.colors['replit-primary-blue'] + '40' : tailwindConfig.theme.extend.colors['replit-primary-blue'] + '33';
  const accentMainColor = currentEditorTheme === 'dark' ? tailwindConfig.theme.extend.colors['ACCENT_DARK'] : tailwindConfig.theme.extend.colors['ACCENT_MAIN'];
  const accentMainBgColor = currentEditorTheme === 'dark' ? tailwindConfig.theme.extend.colors['ACCENT_DARK'] + '40' : tailwindConfig.theme.extend.colors['ACCENT_MAIN'] + '33';
  const accentMainBarColor = currentEditorTheme === 'dark' ? tailwindConfig.theme.extend.colors['ACCENT_DARK'] + 'CF' : tailwindConfig.theme.extend.colors['ACCENT_MAIN'] + 'BF';
  
  const trafficSourceColors = mockData.traffic.sources.map(source => {
    switch(source.colorName) {
        case 'PRIMARY_MAIN': return currentEditorTheme === 'dark' ? tailwindConfig.theme.extend.colors['replit-primary-blue-darker'] : tailwindConfig.theme.extend.colors['replit-primary-blue'];
        case 'ACCENT_MAIN': return currentEditorTheme === 'dark' ? tailwindConfig.theme.extend.colors['ACCENT_DARK'] : tailwindConfig.theme.extend.colors['ACCENT_MAIN'];
        case 'SUCCESS_GREEN': return currentEditorTheme === 'dark' ? tailwindConfig.theme.extend.colors['replit-dark-green'] : tailwindConfig.theme.extend.colors['replit-light-green'];
        case 'TEXT_SECONDARY': return currentEditorTheme === 'dark' ? tailwindConfig.theme.extend.colors['replit-dark-text-secondary'] : tailwindConfig.theme.extend.colors['replit-light-text-secondary'];
        default: return currentEditorTheme === 'dark' ? '#64748B' : '#475569'; 
    }
  });


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-0.5">Store Analytics</h2>
        <p className="text-xs text-TEXT_SECONDARY dark:text-replit-dark-text-secondary mb-3">Overview of your store's performance and insights. (Mock Data)</p>
      </div>

      <section>
        <h3 className="text-base font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-2">Financial Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <MetricCard title="Total Revenue" value={`$${mockData.financial.totalRevenue.toLocaleString()}`} icon={<CurrencyDollarIcon />} trend="+12.5% vs last month" />
          <MetricCard title="Total Orders" value={mockData.financial.totalOrders.toString()} icon={<ShoppingCartIcon />} trend="+8.1% vs last month" />
          <MetricCard title="Avg. Order Value" value={`$${mockData.financial.avgOrderValue}`} icon={<CurrencyDollarIcon />} trend="-1.2% vs last month" trendColor="text-ERROR_RED" />
        </div>
        <div className="bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg p-4 rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border">
          <h4 className="text-xs font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-2">Daily Revenue (Last 7 Days)</h4>
          <ChartComponent
            chartId="dailyRevenueChart"
            type="line"
            editorTheme={currentEditorTheme}
            labels={mockData.financial.dailyRevenue.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))}
            datasets={[{
              label: 'Revenue ($)',
              data: mockData.financial.dailyRevenue.map(d => d.revenue),
              borderColor: primaryMainColor,
              backgroundColor: primaryMainBgColor, 
              tension: 0.3,
              fill: true,
            }]}
          />
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-2">Product Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <MetricCard 
                title="Top Selling Product" 
                value={mockData.product.topSelling.length > 0 ? mockData.product.topSelling[0].name : "N/A"} 
                icon={<PackageIcon />} 
                description={mockData.product.topSelling.length > 0 ? `${mockData.product.topSelling[0].unitsSold} units sold` : ""}
            />
            <MetricCard 
                title="Total Units Sold" 
                value={mockData.product.totalUnitsSoldOverall.toString()} 
                icon={<PackageIcon />} 
                trend="+150 units this week"
            />
        </div>
        <div className="bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg p-4 rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border">
          <h4 className="text-xs font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-2">Top {mockData.product.topSelling.length} Products (Units Sold)</h4>
          <ChartComponent
            chartId="topProductsChart"
            type="bar"
            editorTheme={currentEditorTheme}
            labels={mockData.product.topSelling.map(p => p.name)}
            datasets={[{
              label: 'Units Sold',
              data: mockData.product.topSelling.map(p => p.unitsSold),
              backgroundColor: accentMainBarColor, 
              borderColor: accentMainColor,
              borderWidth: 1,
              borderRadius: 4,
            }]}
            options={{ indexAxis: 'y', scales: { y: { grid: { display: false } } } }}
            className="h-80" 
          />
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-2">Website Traffic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <MetricCard title="Total Visitors" value={mockData.traffic.totalVisitors.toLocaleString()} icon={<UserGroupIcon />} trend="+22% last 30 days" />
          <MetricCard title="Unique Visitors" value={mockData.traffic.uniqueVisitors.toLocaleString()} icon={<UserIcon />} />
          <MetricCard title="Bounce Rate" value={mockData.traffic.bounceRate} icon={<ArrowTrendingUpIcon className="transform rotate-90"/>} description="Lower is better" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg p-4 rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border">
                <h4 className="text-xs font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-2">Daily Visitors (Last 7 Days)</h4>
                <ChartComponent
                    chartId="dailyVisitorsChart"
                    type="line"
                    editorTheme={currentEditorTheme}
                    labels={mockData.traffic.dailyVisitors.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))}
                    datasets={[{
                        label: 'Visitors',
                        data: mockData.traffic.dailyVisitors.map(d => d.visitors),
                        borderColor: accentMainColor,
                        backgroundColor: accentMainBgColor,
                        tension: 0.3,
                        fill: true,
                    }]}
                />
            </div>
            <div className="lg:col-span-2 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg p-4 rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border flex flex-col items-center">
                <h4 className="text-xs font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-2 text-center w-full">Traffic Sources</h4>
                <ChartComponent
                    chartId="trafficSourcesChart"
                    type="doughnut"
                    editorTheme={currentEditorTheme}
                    labels={mockData.traffic.sources.map(s => s.name)}
                    datasets={[{
                        label: 'Visitors',
                        data: mockData.traffic.sources.map(s => s.value),
                        backgroundColor: trafficSourceColors,
                        hoverOffset: 8,
                    }]}
                    className="h-56 w-56 self-center mt-2" 
                    options={{ plugins: { legend: { display: true, position: 'bottom' }}}}
                />
            </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-base font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-2">Content & SEO Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard title="Description Quality" value={`${mockData.contentSEO.avgDescriptionScore}/100`} icon={<DocumentTextIcon />}>
            <ProgressBar value={mockData.contentSEO.avgDescriptionScore} colorClass="bg-SUCCESS_GREEN dark:bg-replit-dark-green" />
          </MetricCard>
          <MetricCard title="Image Coverage" value={`${mockData.contentSEO.imageCoverage}%`} icon={<PhotoIcon />}>
            <ProgressBar value={mockData.contentSEO.imageCoverage} colorClass="bg-ACCENT_MAIN dark:bg-ACCENT_DARK" />
          </MetricCard>
          <MetricCard title="Overall SEO Score" value={`${mockData.contentSEO.seoHealth}/100`} icon={<SeoStarIcon />}>
            <ProgressBar value={mockData.contentSEO.seoHealth} colorClass={mockData.contentSEO.seoHealth > 70 ? "bg-SUCCESS_GREEN dark:bg-replit-dark-green" : (mockData.contentSEO.seoHealth > 40 ? "bg-yellow-500 dark:bg-replit-dark-yellow" : "bg-ERROR_RED dark:bg-replit-dark-red")} />
          </MetricCard>
        </div>
        <div className="mt-4 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg p-4 rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border">
            <h4 className="text-xs font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-2">Top Focus Keywords (Mock)</h4>
            <ul className="space-y-1">
                {mockData.contentSEO.topKeywords.map(keyword => (
                    <li key={keyword} className="flex justify-between items-center py-1 text-xs">
                        <span className="text-TEXT_SECONDARY dark:text-replit-dark-text-secondary flex items-center">
                            <MagnifyingGlassCircleIcon className="w-4 h-4 mr-2 text-PRIMARY_MAIN/70 dark:text-replit-primary-blue/70" />
                            {keyword}
                        </span>
                        <span className="text-xs text-ACCENT_MAIN dark:text-ACCENT_DARK hover:underline cursor-pointer">View details</span>
                    </li>
                ))}
            </ul>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsView;
