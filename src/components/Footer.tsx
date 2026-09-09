import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, ShieldCheck, Heart, BookOpen, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setAuthModalOpen, setAuthModalMode } = useApp();

  return (
    <footer id="isps-dark-footer" className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs pb-16 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Plataforma educacional moderna e rápida para estudantes e explicadores do Instituto Superior Politécnico de Songo e de todo Moçambique.
            </p>
            <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Songo, Distrito de Cahora Bassa, Província de Tete</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono">
                Vodacom M-Pesa
              </span>
              <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono">
                Movitel e-Mola
              </span>
              <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono">
                SIMO Rede
              </span>
            </div>
          </div>

          {/* Links: Navegação */}
          <div className="space-y-3">
            <h4 className="text-zinc-100 font-bold text-xs uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveTab('home');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveTab('tutors');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Encontrar Explicador
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveTab('library');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Biblioteca Digital
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActiveTab('community');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Comunidade & Q&A
                </button>
              </li>
            </ul>
          </div>

          {/* Links: Disciplinas */}
          <div className="space-y-3">
            <h4 className="text-zinc-100 font-bold text-xs uppercase tracking-wider">Cursos & Áreas</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>Engenharia Elétrica & Potência</li>
              <li>Engenharia Mecânica</li>
              <li>Física & Matemática Superior</li>
              <li>Eletrónica & Telecomunicações</li>
              <li>Programação & Informática</li>
              <li>Economia & Contabilidade</li>
            </ul>
          </div>

          {/* Contactos & Quero Ser Explicador */}
          <div className="space-y-3">
            <h4 className="text-zinc-100 font-bold text-xs uppercase tracking-wider">Explicadores</h4>
            <p className="text-zinc-400 text-xs">
              É formado ou estudante avançado no ISPS? Partilhe o seu saber e monetize o seu conhecimento.
            </p>
            <button
              onClick={() => {
                setAuthModalMode('register-tutor');
                setAuthModalOpen(true);
              }}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors"
            >
              Quero ser explicador
            </button>
            <div className="pt-2 text-[11px] text-zinc-500 space-y-1">
              <p>Email: suporte@isps.ac.mz</p>
              <p>Atendimento: Seg a Sex 08:00 - 18:00</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} ISPS Dark. Todos os direitos reservados. "Aprender. Ensinar. Partilhar."</p>
          <div className="flex items-center gap-1">
            <span>Desenvolvido para o</span>
            <strong className="text-zinc-400">Instituto Superior Politécnico de Songo</strong>
          </div>
        </div>
      </div>
    </footer>
  );
};
