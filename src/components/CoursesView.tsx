import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Course } from '../types';
import {
  GraduationCap,
  BookOpen,
  Search,
  Users,
  Clock,
  UserCheck,
  Zap,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

export const CoursesView: React.FC = () => {
  const { courses, tutors, libraryFiles, currentUser, setActiveTab, setSearchQuery } = useApp();

  const [search, setSearch] = useState('');
  const [selectedDegree, setSelectedDegree] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Extract unique departments and degrees
  const degrees = ['all', ...Array.from(new Set(courses.map(c => c.degree)))];
  const departments = ['all', ...Array.from(new Set(courses.map(c => c.department)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      (course.coordinator && course.coordinator.toLowerCase().includes(search.toLowerCase())) ||
      (course.subjects && course.subjects.some(s => s.toLowerCase().includes(search.toLowerCase())));

    const matchesDegree = selectedDegree === 'all' || course.degree === selectedDegree;
    const matchesDept = selectedDepartment === 'all' || course.department === selectedDepartment;

    return matchesSearch && matchesDegree && matchesDept;
  });

  const handleFilterTutorsByCourse = (course: Course) => {
    setSearchQuery(course.name);
    setActiveTab('tutors');
  };

  const handleFilterLibraryByCourse = (course: Course) => {
    setSearchQuery(course.name);
    setActiveTab('library');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/20 border border-zinc-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Oferta Formativa Oficial • ISPS Songo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-50 tracking-tight">
            Cursos Superiores e Departamentos do ISPS
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Consulte a lista de cursos cadastrados pela administração acadêmica do Instituto Superior Politécnico de Songo, planos curriculares, disciplinas lecionadas e encontre explicadores qualificados para cada área.
          </p>

          {/* If user is admin, show shortcut to management */}
          {currentUser?.role === 'admin' && (
            <div className="pt-2">
              <button
                type="button"
                id="admin-manage-courses-btn"
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Adicionar & Gerenciar Cursos (Painel do Administrador)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 text-xs">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por curso, código, disciplina..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Degree filter */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Grau:</span>
          </div>
          <select
            value={selectedDegree}
            onChange={e => setSelectedDegree(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todos os Graus</option>
            {degrees.filter(d => d !== 'all').map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Department filter */}
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500 max-w-[220px] truncate"
          >
            <option value="all">Todos os Departamentos</option>
            {departments.filter(d => d !== 'all').map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          // Count tutors who teach in this course or related subjects
          const relatedTutors = tutors.filter(
            t =>
              t.course === course.name ||
              (course.subjects && t.subjects?.some(s => course.subjects?.includes(s)))
          );

          // Count files related to this course
          const relatedFiles = libraryFiles.filter(
            f =>
              f.category === course.name ||
              (course.subjects && course.subjects.some(s => f.title.toLowerCase().includes(s.toLowerCase())))
          );

          return (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header with code and degree */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
                    {course.code}
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg">
                    {course.degree} • {course.durationYears} Anos
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{course.department}</p>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>

                {/* Coordinator */}
                {course.coordinator && (
                  <div className="flex items-center gap-2 text-xs text-zinc-300 pt-1">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Coord.: <strong className="text-zinc-200">{course.coordinator}</strong></span>
                  </div>
                )}

                {/* Subjects tags */}
                {course.subjects && course.subjects.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block">
                      Disciplinas Principais ({course.subjects.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.subjects.slice(0, 4).map((sub, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300"
                        >
                          {sub}
                        </span>
                      ))}
                      {course.subjects.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] text-zinc-400">
                          +{course.subjects.length - 4} mais
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1">
                  <span>{relatedTutors.length} explicadores ativos</span>
                  <span>{relatedFiles.length} materiais de estudo</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFilterTutorsByCourse(course)}
                    className="py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold flex items-center justify-center gap-1 transition-colors text-[11px]"
                  >
                    <Users className="w-3 h-3 text-amber-400" />
                    <span>Ver Explicadores</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFilterLibraryByCourse(course)}
                    className="py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-semibold flex items-center justify-center gap-1 transition-colors text-[11px]"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Ver Materiais</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <GraduationCap className="w-10 h-10 text-zinc-600 mx-auto" />
          <h4 className="text-sm font-bold text-zinc-200">Nenhum curso encontrado</h4>
          <p className="text-xs text-zinc-400">Tente ajustar o termo de pesquisa ou filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};
