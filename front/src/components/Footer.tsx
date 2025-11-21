/**
 * Footer - Single Responsibility: Display footer with navigation
 * Following KISS and DRY principles
 */
import {
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MessageCircle,
  Coffee,
} from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import snRadioLogo from "figma:asset/2139041d24232c172eb80f7428131e88b26c339b.png";

export default function Footer() {
  const { scrollToSection, goToLegal } = useNavigation();
  return (
    <footer
      style={{
        backgroundColor: "#12171C",
        borderTopColor: "#ffffff20",
      }}
      className="border-t"
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <img
                  src={snRadioLogo}
                  alt="SN-Radio Logo"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold text-white">
                SN-Radio
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Votre radio en ligne préférée. Musique,
              talk-shows, podcasts et bien plus encore. Nous
              sommes là pour vous accompagner 24h/24, 7j/7.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a
                href="https://ko-fi.com/snradio"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: "#1a2025" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "#72A4F2")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "#1a2025")
                }
              >
                <Coffee className="h-5 w-5 text-gray-400 hover:text-white" />
              </a>
              <a
                href="https://www.youtube.com/@RiverFreez-Tv"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: "#1a2025" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "#FF0000")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "#1a2025")
                }
              >
                <Youtube className="h-5 w-5 text-gray-400 hover:text-white" />
              </a>

              <a
                href="https://www.instagram.com/sn_radio"
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: "#1a2025" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "#FD0061")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "#1a2025")
                }
              >
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Liens rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('accueil')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('actualites')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Actualités
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('equipe')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Équipe
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#007EFF]" />
                <a
                  href="mailto:sn-radio@outlook.fr"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  sn-radio@outlook.fr
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-[#5865F2]" />
                <a
                  href="https://discord.gg/Z8rEm389Wy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Rejoignez-nous sur Discord
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 SN-Radio. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <button
              onClick={() => goToLegal("mentions")}
              className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Mentions légales
            </button>
            <button
              onClick={() => goToLegal("privacy")}
              className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Politique de confidentialité
            </button>
            <button
              onClick={() => goToLegal("terms")}
              className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              CGU
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}