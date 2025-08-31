import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center text-white mb-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">🍳 Restaurant Digital Signage</h1>
          <h2 className="text-2xl md:text-3xl mb-8 font-light">Free, Open Source Menu Display System</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Save thousands on digital menu boards. Display your menus on any number of TVs using 
            Raspberry Pis and this free, professional signage system.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Link 
            href="/admin" 
            className="group bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 hover:bg-opacity-30 transition-all border border-white border-opacity-30 text-center text-white"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
            <h3 className="text-2xl font-bold mb-4">Admin Panel</h3>
            <p className="text-lg opacity-90">Manage all your displays, upload menus, and monitor status</p>
          </Link>
          
          <Link 
            href="/display/1" 
            target="_blank"
            className="group bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 hover:bg-opacity-30 transition-all border border-white border-opacity-30 text-center text-white"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📺</div>
            <h3 className="text-2xl font-bold mb-4">View Sample Display</h3>
            <p className="text-lg opacity-90">See how your menu will look on the TV screens</p>
          </Link>
        </div>

        {/* Features */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-white border-opacity-20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why Choose This System?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
            <div className="text-center">
              <div className="text-3xl mb-3">💰</div>
              <h4 className="font-bold text-lg mb-2">$0 Monthly Fees</h4>
              <p className="text-sm opacity-90">Save $50-200/month vs commercial solutions</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-bold text-lg mb-2">Easy Updates</h4>
              <p className="text-sm opacity-90">Change menus instantly from any device</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔢</div>
              <h4 className="font-bold text-lg mb-2">Unlimited Displays</h4>
              <p className="text-sm opacity-90">Scale to as many TVs as you need</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold text-lg mb-2">Raspberry Pi Ready</h4>
              <p className="text-sm opacity-90">Professional setup for ~$50 per TV</p>
            </div>
          </div>
        </div>

        {/* Quick Access to Displays */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
          <h3 className="text-2xl font-bold text-white text-center mb-6">Quick Display Access</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {Array.from({ length: 8 }, (_, i) => (
              <Link
                key={i + 1}
                href={`/display/${i + 1}`}
                target="_blank"
                className="bg-white bg-opacity-20 hover:bg-opacity-40 text-white text-center py-3 px-2 rounded-lg transition-all font-medium"
              >
                TV {i + 1}
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-white opacity-75">Need more displays? Visit the admin panel to configure unlimited screens.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white mt-16 opacity-75">
          <p className="mb-4">Made with ❤️ for the restaurant community</p>
          <p className="text-sm">
            Open source • MIT License • 
            <a href="https://github.com/Tuftn/signage-pi" className="underline hover:no-underline ml-1">
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}