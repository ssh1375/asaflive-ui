import React, { useRef, useState, useCallback, useEffect } from 'react';

export interface User {
    id: string;
    name: string;
    hasVideo: boolean;
    videoUrl?: string;
    isMuted: boolean;
    isSpeaking: boolean;
}

interface UserSliderProps {
    users: User[];
}

const AVATAR_COLORS = [
    'from-indigo-600 to-indigo-800',
    'from-cyan-600 to-cyan-800',
    'from-emerald-600 to-emerald-800',
    'from-amber-600 to-amber-800',
    'from-pink-600 to-pink-800',
    'from-violet-600 to-violet-800',
];

const UserSlider: React.FC<UserSliderProps> = ({ users }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const updateArrows = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 8);
        setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    }, []);

    useEffect(() => {
        updateArrows();
    }, [users, updateArrows]);

    const slide = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'right' ? 200 : -200, behavior: 'smooth' });
        setTimeout(updateArrows, 350);
    };

    return (
        <div className="relative w-full flex items-center justify-center">
            <button
                onClick={() => slide('left')}
                className={`absolute left-1 z-10 w-7 h-7 rounded-full bg-zinc-900/90 border border-zinc-600 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:bg-zinc-700 active:scale-90 ${canLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div
                ref={scrollRef}
                onScroll={updateArrows}
                className="w-full flex gap-2 overflow-x-auto snap-x  snap-mandatory py-2 px-1"
                style={{ scrollbarWidth: 'none' }}
            >
                {users.map((user, i) => (
                    <div
                        key={user.id}
                        className={`
                            relative flex-shrink-0 snap-center rounded-xl overflow-hidden
                            w-[88px] h-[88px] sm:w-32 sm:h-24 md:w-44 md:h-28
                            transition-all duration-300 cursor-pointer
                            active:scale-95
                            ${user.isSpeaking
                                ? 'ring-2 ring-green-400 shadow-[0_0_0_3px_rgba(74,222,128,0.3),0_0_20px_rgba(74,222,128,0.2)]'
                                : 'ring-1 ring-zinc-700 hover:ring-zinc-500'
                            }
                        `}
                    >
                        {user.isSpeaking && (
                            <div className="absolute inset-0 rounded-xl animate-pulse bg-green-500/5 z-10 pointer-events-none" />
                        )}

                        {user.hasVideo ? (
                            <video
                                src={user.videoUrl}
                                autoPlay muted
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                <span className="text-white text-2xl sm:text-3xl font-bold drop-shadow">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-4 pb-1 px-1.5 flex items-center justify-between gap-1">
                            <span className="text-white text-[10px] sm:text-xs truncate flex-1 text-right">
                                {user.name}
                            </span>
                            {user.isMuted ? (
                                <svg className="w-3 h-3 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-3 h-3 text-green-400 shrink-0 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => slide('right')}
                className={`absolute right-1 z-10 w-7 h-7 rounded-full bg-zinc-900/90 border border-zinc-600 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:bg-zinc-700 active:scale-90 ${canRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default UserSlider;