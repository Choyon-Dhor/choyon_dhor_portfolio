import { FiGithub, FiLinkedin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 mt-20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-purple">Choyon Dhor</p>
            <p className="text-sm text-gray-400">CSE Student | ML Enthusiast</p>
          </div>
          <div className="flex gap-6 text-2xl">
            <a href="#" className="hover:text-purple transition-colors"><FiGithub /></a>
            <a href="#" className="hover:text-purple transition-colors"><FiLinkedin /></a>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-6">
          © 2026 Choyon Dhor. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer