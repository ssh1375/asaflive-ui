import React, { useState } from 'react';
import Chat from './Chat';
import UserList from '../lobby/UserLists';
import type { User } from './type';
import { useChatStore } from '../controls/ChatStore';
import { MemberForm, type MemberFormData } from '../../shared/MemberForm.js';

type ChatPageProps = {
    users: User[];
    onSubmit: (data: MemberFormData) => void;
    inviteUser: boolean;
    setInviteUser: (val: boolean) => void;
};

const ChatPage: React.FC<ChatPageProps> = ({ users, onSubmit ,inviteUser,setInviteUser }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { closeChat } = useChatStore();

    return (
        <div className="h-screen bg-zinc-900 text-white overflow-hidden">
            <div className="grid h-full grid-cols-[280px_minmax(2,2fr)] overflow-hidden">
                <div className='m-auto py-3 sm:hidden bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors duration-200 cursor-pointer w-full text-center text-sm font-medium border-t border-zinc-700/50 flex items-center justify-center gap-2'
                    onClick={closeChat}>
                    بستن صفحه چت
                    <button className='ml-5 active:scale-95 animate-bounce'>↓</button>
                </div>
                <div className="min-h-0 overflow-auto">
                    <UserList
                        users={users}
                        selectedUser={selectedUser}
                        onSelectUser={setSelectedUser}
                        inviteUser={inviteUser}
                        setInviteUser={setInviteUser}
                    />
                </div>

                {/* <div className="min-h-0 overflow-auto h-[44vh]">
                    <Chat
                        selectedUser={selectedUser}
                    />
                </div> */}
            </div>
        </div>
    );
};

export default ChatPage;
