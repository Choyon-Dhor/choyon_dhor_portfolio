import { FaFacebook, FaLinkedin, FaWhatsapp, FaGithub } from 'react-icons/fa'

const LeftSocialBar = () => {
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col items-center space-y-4">
      {/* Top vertical line */}
      <div className="w-px h-24 bg-gray-600 mb-4"></div>

      {/* Social Icons */}
      <a
        href="https://facebook.com/choyondh0r"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-purple transition-colors"
      >
        <FaFacebook size={20} />
      </a>
      <a
        href="https://linkedin.com/in/choyondhor"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-purple transition-colors"
      >
        <FaLinkedin size={20} />
      </a>
      <a
        href="https://wa.me/qr/HNLCEJTYX7VPN1"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-purple transition-colors"
      >
        <FaWhatsapp size={20} />
      </a>
      <a
        href="https://github.com/choyon-dhor"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-purple transition-colors"
      >
        <FaGithub size={20} />
      </a>

      {/* Bottom vertical line */}
      <div className="w-px h-24 bg-gray-600 mt-4"></div>
    </div>
  )
}

export default LeftSocialBar