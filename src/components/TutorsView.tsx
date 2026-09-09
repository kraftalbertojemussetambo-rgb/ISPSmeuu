import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  MapPin,
  Users,
  Calendar,
  MessageSquare,
  Bookmark,
  RotateCcw,
  GraduationCap
} from 'lucide-react';
import { TutorProfileModal } from './TutorProfileModal';

export const TutorsView: React.FC = () => {
  const {
    tutors,
    selectedTutorProfile,
    setSelectedTutorProfile,
    setLessonModalTutor,
    setActiveChatUser,
    setActiveTab,
    toggleSaveItem,
    isItemSaved,
    currentUser,
    setAuthModalOpen,
    setAuthModalMode
  } = useApp();

  // Filters
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterMode, setFilterMode] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [filterLocation, setFilterLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // List of all unique subjects across tutors
  const allSubjects = useMemo(() => {
    const set = new Set<string>();
    tutors.forEach(t => {
      if (t.mainSubject) set.add(t.mainSubject);
      t.subjects?.forEach(s => set.add(s));
    });
    return Array.from(set);
  }, [tutors]);

  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = tutor.name.toLowerCase().includes(q);
        const matchesSubject = tutor.subjects?.some(s => s.toLowerCase().includes(q)) || tutor.mainSubject?.toLowerCase().includes(q);
        const matchesCourse = tutor.course?.toLowerCase().includes(q);
        const matchesBio = tutor.bio?.toLowerCase().includes(q);
        if (!matchesName && !matchesSubject && !matchesCourse && !matchesBio) return false;
      }

      // Subject
      if (filterSubject !== 'all') {
        const hasSubject = tutor.subjects?.includes(filterSubject) || tutor.mainSubject === filterSubject;
        if (!hasSubject) return false;
      }

      // Mode
      if (filterMode !== 'all') {
        if (tutor.teachingMode !== 'both' && tutor.teachingMode !== filterMode) return false;
      }

      // Max price
      if (tutor.hourlyRateMzn && tutor.hourlyRateMzn > maxPrice) return false;

      // Min rating
      if (tutor.rating && tutor.rating < minRating) return false;

      // Verified
      if (verifiedOnly && !tutor.isVerified) return false;

      // Location
      if (filterLocation !== 'all') {
        if (!tutor.location?.toLowerCase().includes(filterLocation.toLowerCase())) return false;
      }

      return true;
    });
  }, [tutors, searchQuery, filterSubject, filterMode, maxPrice, minRating, verifiedOnly, filterLocation]);

  const resetFilters = () => {
    setFilterSubject('all');
    setFilterMode('all');
    setMaxPrice(1000);
    setMinRating(0);
    setVerifiedOnly(false);
    setFilterLocation('all');
    setSearchQuery('');
  };

  const handleOpenChat = (tutor: User) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setSelectedTutorProfile(null);
    setActiveChatUser(tutor);
    setActiveTab('chat');
  };

  const handleRequestLesson = (tutor: User) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setSelectedTutorProfile(null);
    setLessonModalTutor(tutor);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-50 tracking-tight">
            Encontrar Explicador
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Descubra explicadores experientes do ISPS e de todo Moçambique para aulas particulares online ou presenciais.
          </p>
        </div>

        {/* Quick search input & Mobile filter trigger */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, disciplina..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
          >
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Sidebar Filters */}
        <div
          className={`lg:block ${
            showMobileFilters ? 'block' : 'hidden'
          } space-y-6 bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800/80 h-fit sticky top-20`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Filtros Avançados</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Limpar
            </button>
          </div>

          {/* Disciplina */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Disciplina
            </label>
            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">Todas as disciplinas</option>
              {allSubjects.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Modalidade */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Modalidade de Aula
            </label>
            <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`py-1.5 rounded-lg font-medium transition-all ${
                  filterMode === 'all' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-400'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterMode('online')}
                className={`py-1.5 rounded-lg font-medium transition-all ${
                  filterMode === 'online' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-400'
                }`}
              >
                Online
              </button>
              <button
                onClick={() => setFilterMode('in_person')}
                className={`py-1.5 rounded-lg font-medium transition-all ${
                  filterMode === 'in_person' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-400'
                }`}
              >
                Presencial
              </button>
            </div>
          </div>

          {/* Preço Máximo por Hora */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-zinc-400">Preço Máximo</span>
              <span className="font-bold text-amber-400">{maxPrice} MZN/h</span>
            </div>
            <input
              type="range"
              min="200"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>200 MZN</span>
              <span>1000 MZN</span>
            </div>
          </div>

          {/* Avaliação Mínima */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Avaliação Mínima
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[0, 4.0, 4.5, 4.8].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-1 ${
                    minRating === r
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{r === 0 ? 'Todas' : `${r}+`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Localização
            </label>
            <select
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">Todas as regiões</option>
              <option value="Songo">Songo (Cahora Bassa / ISPS)</option>
              <option value="Tete">Tete Cidade</option>
              <option value="Maputo">Maputo & Matola</option>
              <option value="Beira">Beira</option>
              <option value="Online">Online / Qualquer lugar</option>
            </select>
          </div>

          {/* Verificados Only Switch */}
          <div className="pt-2 border-t border-zinc-800">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Apenas Explicadores Verificados
              </span>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
                className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-zinc-400">
              A mostrar <strong className="text-zinc-100">{filteredTutors.length}</strong> explicadores disponíveis
            </p>
          </div>

          {filteredTutors.length === 0 ? (
            <div className="text-center py-16 px-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/60">
              <GraduationCap className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-200">Nenhum explicador encontrado</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Tente ajustar os filtros de disciplina, preço ou localização para ver mais resultados.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTutors.map(tutor => {
                const isSaved = isItemSaved(tutor.id);
                return (
                  <div
                    key={tutor.id}
                    className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:shadow-black/40"
                  >
                    <div>
                      {/* Top row: Avatar, Details, Bookmark */}
                      <div className="flex items-start gap-3.5">
                        <div className="relative">
                          <img
                            src={tutor.avatar}
                            alt={tutor.name}
                            className="w-14 h-14 rounded-xl object-cover ring-1 ring-zinc-700 shadow-md group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-900 ${
                              tutor.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-zinc-600'
                            }`}
                            title={tutor.onlineStatus === 'online' ? 'Online agora' : 'Offline'}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-zinc-100 truncate group-hover:text-amber-400 transition-colors">
                              {tutor.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1 mt-0.5">
                            {tutor.isVerified && (
                              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3" /> Verificado
                              </span>
                            )}
                            <span className="text-[10px] text-zinc-500">•</span>
                            <span className="text-[11px] text-zinc-400 truncate">
                              {tutor.location || 'Songo, Moçambique'}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-amber-300 mt-1">
                            {tutor.mainSubject || tutor.course}
                          </p>
                        </div>

                        {/* Save Favorite */}
                        <button
                          onClick={() => toggleSaveItem(tutor.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSaved
                              ? 'text-amber-400 bg-amber-500/20'
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                          }`}
                          title={isSaved ? 'Remover dos guardados' : 'Guardar explicador'}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bio snippet */}
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-3 leading-relaxed">
                        {tutor.bio}
                      </p>

                      {/* Subjects Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(tutor.subjects || [tutor.mainSubject || 'Geral']).slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60"
                          >
                            {s}
                          </span>
                        ))}
                        {(tutor.subjects || []).length > 3 && (
                          <span className="text-[10px] text-zinc-500 self-center">
                            +{tutor.subjects!.length - 3} mais
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom stats and action buttons */}
                    <div className="mt-5 pt-3 border-t border-zinc-800/80 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{tutor.rating || 5.0}</span>
                          <span className="text-zinc-500 text-[10px]">({tutor.reviewCount || 0})</span>
                          <span className="text-zinc-600 mx-1">•</span>
                          <span className="text-zinc-400 text-[11px] flex items-center gap-1 font-normal">
                            <Users className="w-3 h-3 text-zinc-500" />
                            {tutor.studentCount || 0} alunos
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-zinc-100">{tutor.hourlyRateMzn || 400}</span>
                          <span className="text-[10px] text-amber-400 ml-1">MZN/aula</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          id={`btn-view-profile-${tutor.id}`}
                          onClick={() => setSelectedTutorProfile(tutor)}
                          className="py-2 px-3 rounded-xl border border-zinc-700/80 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold text-center transition-colors"
                        >
                          Ver perfil
                        </button>
                        <button
                          id={`btn-request-lesson-${tutor.id}`}
                          onClick={() => handleRequestLesson(tutor)}
                          className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold text-center transition-colors shadow-sm"
                        >
                          Solicitar aula
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tutor Profile Modal */}
      {selectedTutorProfile && (
        <TutorProfileModal
          tutor={selectedTutorProfile}
          onClose={() => setSelectedTutorProfile(null)}
          onRequestLesson={handleRequestLesson}
          onOpenChat={handleOpenChat}
        />
      )}
    </div>
  );
};
