import '../../../../styles/global.scss';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">About</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-500 transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Products</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Duolingo for Schools</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Duolingo English Test</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Mobile Apps</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Help</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Guidelines</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Social</h3>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                f
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                t
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                i
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
          © 2025 Duolingo Clone. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;