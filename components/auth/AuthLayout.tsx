'use client';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#2D5F8D] to-[#1e3f5a] text-white flex-col justify-between p-8 lg:p-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#2D5F8D] font-bold text-lg">▶</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">Nordmatch</h1>
              <p className="text-xs text-blue-200">APPLICANT TRACKING SYSTEM</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Welcome Back!
          </h2>
          <p className="text-blue-100 mb-8">
            Access your recruiter dashboard and find the best Nordic talent
          </p>

          <div className="space-y-4">
            {[
              {
                title: 'Smart Candidate Matching',
                desc: 'AI-powered recruitment tools',
              },
              {
                title: 'Streamlined Workflow',
                desc: 'Manage your hiring pipeline efficiently',
              },
              {
                title: 'Global Reach, Local Impact',
                desc: 'Easily manage diverse hiring campaigns',
              },
              {
                title: 'High-Fidelity Talent CRM',
                desc: 'Cultivate relationships with future talent',
              },
            ].map((feature, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-green-400 text-xl mt-1">✓</span>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-blue-200">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-blue-300">© 2025 Nordmatch. All rights reserved.</p>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}