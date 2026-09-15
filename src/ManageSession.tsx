import { useRef, useState } from "react";
import DynamicTable from "./shared/Tabel/DynamicTable";
import getNestedValue from "./hooks/pubFunc/getNestedValue";
import { toShamsi } from "./hooks/pubFunc/dateController";
import api from "./api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type CustomRenderersType = Record<string, (val: any, row: any) => React.ReactNode>;

type Metadata = {
  type: string;
  livekitRoomName?: string;
};

interface DeleteModalState {
  isOpen: boolean;
  roomId: string | null;
  roomName: string | null;
}

function ManageSession() {
  const downloadingRef = useRef<Set<string>>(new Set());
  const navigate = useNavigate();

  
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    roomId: null,
    roomName: null,
  });
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const columns = [
    { header: "نام", accessor: "name", showSearch: false },
    { header: "تاریخ جلسه", accessor: "createdAt", showSearch: false },
    { header: "نوع جلسه", accessor: "metadata", showSearch: false },
    { header: "دانلود جلسه", accessor: "download_session", showSearch: false },
    { header: "حذف جلسه", accessor: "delete_room", showSearch: false },
    { header: "ورود به جلسه", accessor: "join_room", showSearch: false },
  ];

  const downloadSession = async (livekitRoomName?: string) => {
    if (!livekitRoomName) {
      toast.error("نام اتاق برای دانلود معتبر نیست");
      return;
    }
    downloadingRef.current.add(livekitRoomName);
    window.open(`https://asaflive.ir/api/session-manager/download/${livekitRoomName}`, "_blank");
  };

  const checkEgressStatus = async (egressId?: string) => {
    if (!egressId) return true;

    try {
      const res = await api.get(`/session-manager/meeting/${egressId}`);

      if (res.data === false) {
        toast.error("ضبط متوقف شده است و امکان ورود به این جلسه وجود ندارد.");
        return false;
      }

      return res.data;
    } catch (error) {
      console.error("خطا در چک کردن وضعیت خروجی:", error);
      toast.error("خطا در استعلام وضعیت جلسه");
      return false;
    }
  };

  const getToken = async (id?: string, egressId?: string): Promise<string | null> => {
    const isEgressActive = await checkEgressStatus(egressId);

    if (!isEgressActive) return null;

    const toastId = toast.loading("در حال دریافت توکن و ساخت دعوتنامه...");

    try {
      const userRes = await api.get("/auth/me");
      const user = userRes.data;

      const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

      const inviteRes = await api.post(`/session-manager/invite/${id}`, {
        phone: user.phone,
        displayName: displayName || "پشتیبان",
        permissions: { roomJoin: true, canPublish: true, canSubscribe: true },
      });

      toast.success("توکن با موفقیت ساخته شد", { id: toastId });

      const token = inviteRes.data?.accessToken;

      navigate(`/session/${id}?token=${token}&egressId=${egressId}`, {
        state: { egress: egressId },
      });

      return token;
    } catch (error: any) {
      console.error("خطا در استعلام کاربر یا ساخت توکن:", error);
      toast.error("خطا در ساخت توکن", { id: toastId });
      return null;
    }
  };

  
  const handleConfirmDelete = async () => {
    if (!deleteModal.roomId) return;

    setIsDeleting(true);
    const toastId = toast.loading("در حال حذف جلسه...");

    try {
      await api.delete(`session-manager/meetings/${deleteModal.roomId}`);
      toast.success("جلسه با موفقیت حذف شد", { id: toastId });
      
      
      setDeleteModal({ isOpen: false, roomId: null, roomName: null });
      
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("خطا در حذف جلسه:", error);
      toast.error("خطایی در حذف رکورد رخ داد", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const customRenderers: CustomRenderersType = {
    name: (value: string) => {
      if (value) {
        const result = value.split(":");
        return (
          <span className="font-mono text-blue-400" dir="ltr">
            {result[0]}
          </span>
        );
      }
      return "-";
    },
    metadata: (value: Metadata) => {
      let typeSession = "";
      switch (value?.type) {
        case "CARGO_DAMAGE":
          typeSession = "خسارت";
          break;
        case "INSURANCE_VISIT":
          typeSession = "بازدید";
          break;
        case "SIMPLE_MEETING":
          typeSession = "دورهمی";
          break;
        default:
          typeSession = "_";
          break;
      }
      return <span>{typeSession}</span>;
    },
    createdAt: (value: string) => {
      return <span>{toShamsi(value, true)}</span>;
    },
    download_session: (_, element) => {
      const roomName = element?.metadata?.livekitRoomName;
      return (
        <button
          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm rounded transition-colors cursor-pointer"
          onClick={() => {
            downloadSession(roomName);
          }}
        >
          دانلود جلسه
        </button>
      );
    },
    delete_room: (_, element) => {
      const roomId = element?.id;
      const sessionName = element?.name?.split(":")[0] || "این جلسه";
      
      return (
        <button
          className="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:bg-red-400 disabled:cursor-not-allowed text-white text-sm rounded transition-colors cursor-pointer"
          onClick={() => {
            
            setDeleteModal({
              isOpen: true,
              roomId: roomId,
              roomName: sessionName,
            });
          }}
        >
          حذف رکورد جلسه
        </button>
      );
    },
    join_room: (_, element) => {
      const meetingRoom = element?.id;
      let res = element?.egressdata ? JSON.parse(element?.egressdata) : null;

      if (res?.status === "EGRESS_ACTIVE" || res?.status === "EGRESS_STARTING") {
        return (
          <button
            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white text-sm rounded transition-colors cursor-pointer"
            onClick={() => {
              getToken(meetingRoom, res?.egressId);
            }}
          >
            ورود به جلسه
          </button>
        );
      }
      return null;
    },
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen relative p-4">
      <h1 className="text-5xl text-white font-extrabold mb-8">مدیریت جلسات</h1>
      
      <div className="w-11/12">
        <DynamicTable
          // key={refreshKey} 
          apiEndpoint="/session-manager"
          columns={columns}
          recordsPerPage={10}
          customRender={(row, colIndex) => {
            const col = columns[colIndex];
            if (col && customRenderers[col.accessor]) {
              return customRenderers[col.accessor](row[col.accessor], row);
            } else {
              const value = getNestedValue(row, col.accessor);
              return value || "-";
            }
          }}
        />
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
          <div 
            className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all text-right"
            dir="rtl"
          >
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold text-white">تایید حذف جلسه</h3>
            </div>

            <p className="text-zinc-300 text-sm leading-6 mb-6">
              آیا از حذف جلسه <span className="font-semibold text-red-400 font-mono">"{deleteModal.roomName}"</span> اطمینان دارید؟ 
              این عملیات قابل بازگشت نخواهد بود.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModal({ isOpen: false, roomId: null, roomName: null })}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-2 disabled:bg-red-800 disabled:cursor-not-allowed"
              >
                {isDeleting ? "در حال حذف..." : "بله، حذف شود"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSession;
