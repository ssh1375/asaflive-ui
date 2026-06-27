import React from 'react';
import type { User } from '../chat/type'; 

type UserListProps = {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User | null) => void;
};

const UserList: React.FC<UserListProps> = ({
  users,
  selectedUser,
  onSelectUser,
}) => {
  return (
    <div className="h-max bg-zinc-900 border-l border-zinc-800 p-4 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-zinc-100 font-bold text-sm">لیست کاربران</h2>

        {/* <button
          onClick={() => onSelectUser(null)}
          className={`text-xs px-3 py-1.5 rounded-lg transition ${
            selectedUser === null
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          چت عمومی
        </button> */}
        <button
          // onClick={() => onSelectUser(null)}
          className={`text-xs px-3 py-1.5 rounded-lg transition bg-blue-600 text-white`}
        >
          افزودن کاربر+ 
        </button>
      </div>

      <div className="flex flex-col gap-2 h-6/12 overflow-x-visible">
        {users.map((user) => {
          const isActive = selectedUser?.id === user.id;

          return (
            <button
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`w-full text-right px-3 py-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{user.name}</div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {user.isSpeaking
                      ? 'در حال صحبت'
                      : user.isMuted
                      ? 'میکروفون خاموش'
                      : 'آنلاین'}
                  </div>
                </div>

                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${
                      user.isSpeaking ? 'bg-green-400' : 'bg-zinc-500'
                    }`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
