type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/40 p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-25 h-7 rounded-2xl bg-red-600 shadow-md mb-5">
            <span className="text-white text-lg font-bold">SHOP VN</span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h1>

          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}