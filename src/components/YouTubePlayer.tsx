import { useState, useEffect } from "react";
import { Search, Music, Loader2, Play, ExternalLink, History, Disc, Plus, Radio, Volume2, Link as LinkIcon, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function YouTubePlayer() {
  const [query, setQuery] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState("V1bFr2SWP1I"); // Default Mr Robot track
  const [results, setResults] = useState<any[]>([]);
  const [playlist, setPlaylist] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hacker-playlist");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [directUrl, setDirectUrl] = useState("");

  useEffect(() => {
    localStorage.setItem("hacker-playlist", JSON.stringify(playlist));
  }, [playlist]);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleDirectUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(directUrl);
    if (id) {
      setCurrentVideoId(id);
      setDirectUrl("");
      const newTrack = { id, title: `Direct Link Stream [${id}]`, author: "Remote Source", genre: "External" };
      setResults(prev => [newTrack, ...prev.filter(t => t.id !== id)]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      const mockDb = [
        { id: "V1bFr2SWP1I", title: "Mr. Robot Main Theme", author: "Mac Quayle", genre: "Synth" },
        { id: "fE_648_I-N0", title: "Cyberpunk 2077 - Rebel Path", author: "P.T. Adamczyk", genre: "Electronic" },
        { id: "eb6_T0I-0_s", title: "Hacker Synthwave Mix 2024", author: "Droid Bishop", genre: "Synthwave" },
        { id: "5qap5aO4i9A", title: "lofi hip hop radio - beats to hack to", author: "Lofi Girl", genre: "Lofi" },
        { id: "179471373", title: "Mr Robot - Mac Quayle Vol 1", author: "Lakeshore Records", genre: "Soundtrack" },
        { id: "dQw4w9WgXcQ", title: "System Security Test Protocol", author: "Unknown Entity", genre: "Audit" }
      ];
      
      const filtered = mockDb.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) || 
        track.author.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filtered.length > 0 ? filtered : mockDb.slice(0, 4));
      setLoading(false);
    }, 1000);
  };

  const selectTrack = (id: string) => {
    setCurrentVideoId(id);
  };

  const addToPlaylist = (track: any) => {
    if (!playlist.find(t => t.id === track.id)) {
      setPlaylist([track, ...playlist]);
    }
  };

  const removeFromPlaylist = (id: string) => {
    setPlaylist(playlist.filter(t => t.id !== id));
  };

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const embedUrl = `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=0&controls=1&origin=${origin}`;
  const visibleResults = results.length > 0 ? results : playlist;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="terminal-border rounded-2xl bg-black/80 p-6 backdrop-blur-xl border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-primary/10 border border-primary/20">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Media_Search.exe</h2>
              </div>
            </div>

            <form onSubmit={handleDirectUrl} className="relative mb-4">
              <input
                type="text"
                value={directUrl}
                onChange={(e) => setDirectUrl(e.target.value)}
                placeholder="Cole link direto do YouTube..."
                className="w-full rounded-xl border border-primary/10 bg-primary/[0.02] py-3 pl-4 pr-12 text-[10px] outline-none focus:border-primary/40 transition-all font-mono text-white placeholder:text-white/10"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-primary hover:bg-primary/10 transition-all"
              >
                <LinkIcon className="h-3 w-3" />
              </button>
            </form>

            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar música ou ID..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-4 pl-4 pr-12 text-xs outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all font-mono text-white placeholder:text-white/10 shadow-inner"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg text-primary hover:bg-primary/10 transition-all hover:scale-105"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
              </button>
            </form>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
                  <Radio className="h-3 w-3" /> Transmissões Localizadas
                </div>
                {visibleResults.length > 0 && <span className="text-[8px] font-mono text-primary/40">{visibleResults.length} NODES FOUND</span>}
              </div>
              
              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence mode="popLayout">
                  {visibleResults.length > 0 ? visibleResults.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left group relative overflow-hidden ${
                        currentVideoId === r.id 
                          ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/5" 
                          : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <button 
                        onClick={() => selectTrack(r.id)}
                        className="flex-1 flex items-center gap-3"
                      >
                        <div className={`p-2 rounded-lg transition-colors ${currentVideoId === r.id ? "bg-primary/20" : "bg-black/40 group-hover:bg-primary/20"}`}>
                          <Play className={`h-3 w-3 ${currentVideoId === r.id ? "text-primary fill-current" : "text-white/40"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[10px] font-bold truncate ${currentVideoId === r.id ? "text-primary" : "text-white"}`}>{r.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] font-mono text-white/30 truncate">{r.author}</span>
                          </div>
                        </div>
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {!playlist.find(t => t.id === r.id) ? (
                          <button 
                            onClick={() => addToPlaylist(r)}
                            className="p-2 rounded-lg text-white/20 hover:text-primary transition-all"
                            title="Save to Playlist"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => removeFromPlaylist(r.id)}
                            className="p-2 rounded-lg text-rose-500/40 hover:text-rose-500 transition-all"
                            title="Remove from Playlist"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            if(confirm("Deseja realmente limpar toda a playlist?")) setPlaylist([]);
                          }}
                          className="p-2 rounded-lg text-white/10 hover:text-white transition-all ml-1"
                          title="Limpar Tudo"
                        >
                          <History className="h-3 w-3" />
                        </button>
                      </div>

                      {currentVideoId === r.id && (
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
                          <div className="flex gap-0.5 items-end h-3">
                            {[1,2,3].map(i => (
                              <motion.div 
                                key={i}
                                animate={{ height: [4, 12, 6, 10, 4] }}
                                transition={{ repeat: Infinity, duration: 0.5 + i*0.1 }}
                                className="w-0.5 bg-primary"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )) : (
                    <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-2xl group hover:border-primary/10 transition-colors">
                      <Music className="h-8 w-8 text-white/5 mx-auto mb-3 group-hover:text-primary/20 transition-colors" />
                      <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.3em]">Aguardando Sincronização...</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {playlist.length > 0 && (
            <div className="terminal-border rounded-2xl bg-black/60 p-6 backdrop-blur-xl border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Disc className="h-4 w-4 text-primary animate-spin-slow" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Local_Playlist.m3u</h2>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                {playlist.map(track => (
                  <div key={track.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 group">
                    <button 
                      onClick={() => selectTrack(track.id)}
                      className="flex-1 text-left"
                    >
                      <p className="text-[9px] font-bold text-white/80 truncate">{track.title}</p>
                    </button>
                    <button 
                      onClick={() => removeFromPlaylist(track.id)}
                      className="p-1.5 opacity-0 group-hover:opacity-100 text-rose-500/40 hover:text-rose-500 transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="terminal-border rounded-2xl bg-black/90 p-3 backdrop-blur-2xl border-primary/20 overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="aspect-video w-full rounded-xl bg-black/80 overflow-hidden relative group border border-white/5">
              <iframe
                id="yt-player"
                width="100%"
                height="100%"
                src={embedUrl}
                title="YouTube player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0 grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
            <div className="px-5 py-4 flex items-center justify-between bg-black/40 mt-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-emerald-500/80">LINK_STABLE</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Digital Audio Interface // Port 443</span>
              </div>
              <button 
                onClick={() => setIsRotating(!isRotating)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${
                  isRotating ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-white/20"
                }`}
              >
                Visualizer: {isRotating ? "ON" : "OFF"}
              </button>
            </div>
          </div>
          
          <div className="mt-6 p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
             <div className="flex items-center gap-3 text-white/20 mb-4">
                <History className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Metadata Subsystem</span>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "BITRATE", val: "320 KBPS" },
                  { label: "SAMPLING", val: "48.1 KHZ" },
                  { label: "LATENCY", val: "12 MS" },
                  { label: "SYNC", val: "REAL-TIME" }
                ].map(stat => (
                  <div key={stat.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[8px] font-mono text-white/20 mb-1">{stat.label}</p>
                    <p className="text-xs font-black text-primary/60">{stat.val}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
